import { firestore } from '@/firebase/firebaseClient'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

/**
 * Service to handle product reviews and technical questions in Firestore
 */

// --- PRODUCT REVIEWS ---

/**
 * Fetches all reviews for a specific product
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
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Format timestamp if present
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
 * Adds a new review for a product
 * @param {Object} reviewData
 * @returns {Promise<string>} Document ID
 */
export const addProductReview = async ({ productId, userId, userName, userEmail, rating, title, comment }) => {
  if (!productId || !userId) throw new Error('Identificador de producto y usuario requeridos.')

  try {
    const reviewsRef = collection(firestore, 'product_reviews')
    const docRef = await addDoc(reviewsRef, {
      productId,
      userId,
      userName: userName || 'Usuario Wavi',
      userEmail: userEmail || '',
      rating: Number(rating) || 5,
      title: title?.trim() || '',
      comment: comment?.trim() || '',
      createdAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding product review:', error)
    throw error
  }
}

// --- TECHNICAL QUESTIONS ---

/**
 * Fetches all technical questions for a specific product
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
    console.error('Error fetching product questions:', error)
    return []
  }
}

/**
 * Adds a new technical question for a product
 * @param {Object} questionData
 * @returns {Promise<string>} Document ID
 */
export const addProductQuestion = async ({ productId, userId, userName, userEmail, question }) => {
  if (!productId || !userId) throw new Error('Identificador de producto y usuario requeridos.')

  try {
    const questionsRef = collection(firestore, 'product_questions')
    const docRef = await addDoc(questionsRef, {
      productId,
      userId,
      userName: userName || 'Usuario Wavi',
      userEmail: userEmail || '',
      question: question?.trim() || '',
      answer: null,
      answeredAt: null,
      createdAt: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding product question:', error)
    throw error
  }
}
