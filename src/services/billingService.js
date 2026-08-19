import { firestore } from '@/firebase/firebaseClient'
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'

/**
 * Service to manage User Billing Profiles & Saved Payment References (PCI-Compliant)
 * Firestore path:
 * - Billing Profile: users/{userId}/billingInfo/default (or users/{userId})
 * - Payment Methods: users/{userId}/paymentMethods/{methodId}
 */

// --- BILLING PROFILE ---

/**
 * Fetches the user's fiscal / billing profile
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
export const getUserBillingProfile = async (userId) => {
  if (!userId) return null

  try {
    const billingDocRef = doc(firestore, 'users', userId, 'billingInfo', 'default')
    const docSnap = await getDoc(billingDocRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }

    // Fallback: check if stored directly on users/{userId}
    const userDocRef = doc(firestore, 'users', userId)
    const userSnap = await getDoc(userDocRef)
    if (userSnap.exists() && userSnap.data().billingInfo) {
      return userSnap.data().billingInfo
    }

    return null
  } catch (error) {
    console.error('[billingService] Error fetching billing profile:', error)
    return null
  }
}

/**
 * Saves or updates user's fiscal billing profile
 * @param {string} userId
 * @param {Object} billingData
 * @returns {Promise<void>}
 */
export const saveUserBillingProfile = async (userId, billingData) => {
  if (!userId) throw new Error('userId is required')

  try {
    const billingDocRef = doc(firestore, 'users', userId, 'billingInfo', 'default')
    await setDoc(
      billingDocRef,
      {
        docType: billingData.docType || 'CC',
        docNumber: billingData.docNumber?.trim() || '',
        businessName: billingData.businessName?.trim() || '',
        address: billingData.address?.trim() || '',
        city: billingData.city?.trim() || '',
        department: billingData.department?.trim() || '',
        postalCode: billingData.postalCode?.trim() || '',
        phone: billingData.phone?.trim() || '',
        email: billingData.email?.trim() || '',
        updatedAt: serverTimestamp()
      },
      { merge: true }
    )
  } catch (error) {
    console.error('[billingService] Error saving billing profile:', error)
    throw error
  }
}

// --- SAVED PAYMENT METHODS (PCI-COMPLIANT MASKED METADATA) ---

/**
 * Fetches saved payment method references for a user
 * @param {string} userId
 * @returns {Promise<Array>} List of tokenized/masked payment cards
 */
export const getUserPaymentMethods = async (userId) => {
  if (!userId) return []

  try {
    const methodsRef = collection(firestore, 'users', userId, 'paymentMethods')
    const q = query(methodsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }))
  } catch (error) {
    console.error('[billingService] Error fetching payment methods:', error)
    return []
  }
}

/**
 * Adds a new tokenized payment method reference
 * NOTE: NEVER STORE RAW CARD NUMBERS OR CVV. Store only lastFour, brand, and expiration.
 * @param {string} userId
 * @param {Object} methodData
 * @returns {Promise<string>} Document ID
 */
export const addPaymentMethod = async (userId, methodData) => {
  if (!userId) throw new Error('userId is required')

  const lastFour = String(methodData.lastFour || '').slice(-4)
  if (!lastFour) throw new Error('lastFour digits are required')

  try {
    const methodsRef = collection(firestore, 'users', userId, 'paymentMethods')
    const methodDocRef = doc(methodsRef)

    // Check if it's the first method to make it default
    const existing = await getUserPaymentMethods(userId)
    const isFirst = existing.length === 0

    await setDoc(methodDocRef, {
      type: methodData.type || 'credit_card',
      brand: (methodData.brand || 'visa').toLowerCase(),
      lastFour,
      cardholderName: methodData.cardholderName?.trim() || '',
      expiryMonth: String(methodData.expiryMonth || '').padStart(2, '0'),
      expiryYear: String(methodData.expiryYear || ''),
      isDefault: isFirst || Boolean(methodData.isDefault),
      createdAt: serverTimestamp()
    })

    return methodDocRef.id
  } catch (error) {
    console.error('[billingService] Error adding payment method:', error)
    throw error
  }
}

/**
 * Deletes a saved payment method
 * @param {string} userId
 * @param {string} methodId
 * @returns {Promise<void>}
 */
export const deletePaymentMethod = async (userId, methodId) => {
  if (!userId || !methodId) return

  try {
    const methodRef = doc(firestore, 'users', userId, 'paymentMethods', methodId)
    await deleteDoc(methodRef)
  } catch (error) {
    console.error('[billingService] Error deleting payment method:', error)
    throw error
  }
}

/**
 * Sets a payment method as default, unsetting all others
 * @param {string} userId
 * @param {string} methodId
 * @returns {Promise<void>}
 */
export const setDefaultPaymentMethod = async (userId, methodId) => {
  if (!userId || !methodId) return

  try {
    const methodsRef = collection(firestore, 'users', userId, 'paymentMethods')
    const snapshot = await getDocs(methodsRef)

    const batch = writeBatch(firestore)

    snapshot.docs.forEach((docSnap) => {
      batch.update(docSnap.ref, {
        isDefault: docSnap.id === methodId
      })
    })

    await batch.commit()
  } catch (error) {
    console.error('[billingService] Error setting default payment method:', error)
    throw error
  }
}
