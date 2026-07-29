import { firestore } from '@/firebase/firebaseClient'
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  getCountFromServer
} from 'firebase/firestore'

/**
 * Service to handle product reviews and technical questions in Firestore
 */

// --- VERIFIED PURCHASER CHECK ---

/**
 * Checks if a user has purchased a specific product in any successful order
 * @param {string} userId
 * @param {string} productId
 * @returns {Promise<boolean>}
 */
export const checkUserPurchasedProduct = async (userId, productId) => {
  if (!userId || !productId) return false

  try {
    const ordersRef = collection(firestore, 'orders')
    const q = query(ordersRef, where('userId', '==', userId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) return false

    return querySnapshot.docs.some((docSnap) => {
      const order = docSnap.data()
      // Exclude cancelled or failed orders
      const isPaidStatus = !['cancelled', 'failed', 'rejected'].includes(order.status)
      if (!isPaidStatus) return false

      const items = order.items || order.products || order.cartItems || []
      return items.some((item) => item.id === productId || item.productID === productId || item.sku === productId)
    })
  } catch (error) {
    console.error('Error checking verified purchase:', error)
    return false
  }
}

// --- PRODUCT REVIEWS ---

/**
 * Fetches all APPROVED reviews for a specific product (Storefront)
 * @param {string} productId
 * @returns {Promise<Array>} List of review objects
 */
export const fetchProductReviews = async (productId) => {
  if (!productId) return []

  try {
    const reviewsRef = collection(firestore, 'product_reviews')
    const q = query(
      reviewsRef,
      where('productId', '==', productId),
      where('approved', '==', true),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate
        ? doc.data().createdAt.toDate().toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'Reciente'
    }))
  } catch (error) {
    console.error('Error fetching product reviews:', error)
    return []
  }
}

/**
 * Adds a new review for a product (Pending admin approval by default)
 * @param {Object} reviewData
 * @returns {Promise<string>} Document ID
 */
export const addProductReview = async ({ productId, userId, userName, userEmail, rating, title, comment, productName }) => {
  if (!productId || !userId) throw new Error('Identificador de producto y usuario requeridos.')

  try {
    const reviewsRef = collection(firestore, 'product_reviews')
    const docRef = await addDoc(reviewsRef, {
      productId,
      productName: productName || 'Producto',
      userId,
      userName: userName || 'Usuario Wavi',
      userEmail: userEmail || '',
      rating: Number(rating) || 5,
      title: title?.trim() || '',
      comment: comment?.trim() || '',
      approved: false,
      createdAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding product review:', error)
    throw error
  }
}

/**
 * Fetches ALL reviews for admin panel moderation
 * @returns {Promise<Array>}
 */
export const fetchAllReviews = async () => {
  try {
    const reviewsRef = collection(firestore, 'product_reviews')
    const q = query(reviewsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAtFormatted: docSnap.data().createdAt?.toDate
        ? docSnap.data().createdAt.toDate().toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'Reciente'
    }))
  } catch (error) {
    console.error('Error fetching all reviews:', error)
    return []
  }
}

/**
 * Counts pending (unapproved) reviews for Admin KPI
 * @returns {Promise<number>}
 */
export const fetchPendingReviewsCount = async () => {
  try {
    const reviewsRef = collection(firestore, 'product_reviews')
    const q = query(reviewsRef, where('approved', '==', false))
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
  } catch (error) {
    console.error('Error fetching pending reviews count:', error)
    return 0
  }
}

/**
 * Approves a product review
 * @param {string} reviewId
 */
export const approveReview = async (reviewId) => {
  if (!reviewId) return
  const reviewRef = doc(firestore, 'product_reviews', reviewId)
  await updateDoc(reviewRef, {
    approved: true,
    approvedAt: serverTimestamp()
  })
}

/**
 * Deletes a product review (or rejects it)
 * @param {string} reviewId
 */
export const deleteReview = async (reviewId) => {
  if (!reviewId) return
  const reviewRef = doc(firestore, 'product_reviews', reviewId)
  await deleteDoc(reviewRef)
}

// --- TECHNICAL QUESTIONS ---

/**
 * Fetches all technical questions for a specific product (Storefront - excludes duplicates)
 * @param {string} productId
 * @returns {Promise<Array>} List of question objects
 */
export const fetchProductQuestions = async (productId) => {
  if (!productId) return []

  try {
    const questionsRef = collection(firestore, 'product_questions')
    const q = query(
      questionsRef,
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs
      .map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate
          ? docSnap.data().createdAt.toDate().toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : 'Reciente'
      }))
      .filter((q) => q.status !== 'duplicated')
  } catch (error) {
    console.error('Error fetching product questions:', error)
    return []
  }
}

/**
 * Adds a new technical question for a product
 * @param {Object} questionData
 * @returns {Promise<string>} Document ID
 */
export const addProductQuestion = async ({ productId, userId, userName, userEmail, question, productName }) => {
  if (!productId || !userId) throw new Error('Identificador de producto y usuario requeridos.')

  try {
    const questionsRef = collection(firestore, 'product_questions')
    const docRef = await addDoc(questionsRef, {
      productId,
      productName: productName || 'Producto',
      userId,
      userName: userName || 'Usuario Wavi',
      userEmail: userEmail || '',
      question: question?.trim() || '',
      answer: null,
      answeredAt: null,
      status: 'active',
      createdAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding product question:', error)
    throw error
  }
}

/**
 * Fetches ALL questions for admin panel moderation
 * @returns {Promise<Array>}
 */
export const fetchAllQuestions = async () => {
  try {
    const questionsRef = collection(firestore, 'product_questions')
    const q = query(questionsRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAtFormatted: docSnap.data().createdAt?.toDate
        ? docSnap.data().createdAt.toDate().toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'Reciente'
    }))
  } catch (error) {
    console.error('Error fetching all questions:', error)
    return []
  }
}

/**
 * Counts unanswered questions for Admin KPI
 * @returns {Promise<number>}
 */
export const fetchUnansweredQuestionsCount = async () => {
  try {
    const questionsRef = collection(firestore, 'product_questions')
    const querySnapshot = await getDocs(questionsRef)
    return querySnapshot.docs.filter((docSnap) => {
      const data = docSnap.data()
      return (!data.answer || data.answer.trim() === '') && data.status !== 'duplicated'
    }).length
  } catch (error) {
    console.error('Error fetching unanswered questions count:', error)
    return 0
  }
}

/**
 * Answers and/or edits a technical question formulation
 * @param {string} questionId
 * @param {Object} updateParams { question, answer }
 */
export const answerAndEditQuestion = async (questionId, { question, answer }) => {
  if (!questionId) return
  const questionRef = doc(firestore, 'product_questions', questionId)
  await updateDoc(questionRef, {
    question: question?.trim() || '',
    answer: answer?.trim() || '',
    answeredAt: serverTimestamp()
  })
}

/**
 * Marks a question as duplicated
 * @param {string} questionId
 */
export const markQuestionDuplicated = async (questionId) => {
  if (!questionId) return
  const questionRef = doc(firestore, 'product_questions', questionId)
  await updateDoc(questionRef, {
    status: 'duplicated'
  })
}

/**
 * Deletes a technical question
 * @param {string} questionId
 */
export const deleteQuestion = async (questionId) => {
  if (!questionId) return
  const questionRef = doc(firestore, 'product_questions', questionId)
  await deleteDoc(questionRef)
}
