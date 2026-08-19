import { firestore } from '@/firebase/firebaseClient'
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'

/**
 * Service to manage User Favorites (Wishlist) in Cloud Firestore
 * Stored under subcollection: users/{userId}/favorites/{productId}
 */

/**
 * Fetches all favorite items for a specific user
 * @param {string} userId
 * @returns {Promise<Array>} List of favorite product items
 */
export const fetchUserFavorites = async (userId) => {
  if (!userId) return []

  try {
    const favRef = collection(firestore, 'users', userId, 'favorites')
    const q = query(favRef, orderBy('addedAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }))
  } catch (error) {
    console.error('[favoritesService] Error fetching favorites:', error)
    return []
  }
}

/**
 * Adds or updates a product in user's favorites
 * @param {string} userId
 * @param {Object} product
 * @returns {Promise<void>}
 */
export const addFavorite = async (userId, product) => {
  if (!userId || !product) throw new Error('userId and product are required')

  const productId = String(product.productID || product.id || '')
  if (!productId) throw new Error('Product must have an id or productID')

  try {
    const favDocRef = doc(firestore, 'users', userId, 'favorites', productId)
    
    // Normalize images & price
    const images = Array.isArray(product.images)
      ? product.images
      : typeof product.images === 'string'
      ? [product.images]
      : []

    const firstImage = product.firstImage || images[0] || ''

    await setDoc(favDocRef, {
      productId,
      name: product.name || 'Producto sin nombre',
      brand: product.brand || 'Wavi Aeronautics',
      category: product.category || 'tienda',
      price: Number(product.price) || 0,
      precio: product.precio || null,
      images,
      firstImage,
      availability: product.availability !== false,
      addedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('[favoritesService] Error adding favorite:', error)
    throw error
  }
}

/**
 * Removes a product from user's favorites
 * @param {string} userId
 * @param {string} productId
 * @returns {Promise<void>}
 */
export const removeFavorite = async (userId, productId) => {
  if (!userId || !productId) return

  try {
    const favDocRef = doc(firestore, 'users', userId, 'favorites', String(productId))
    await deleteDoc(favDocRef)
  } catch (error) {
    console.error('[favoritesService] Error removing favorite:', error)
    throw error
  }
}

/**
 * Checks if a specific product is marked as favorite
 * @param {string} userId
 * @param {string} productId
 * @returns {Promise<boolean>}
 */
export const isProductFavorite = async (userId, productId) => {
  if (!userId || !productId) return false

  try {
    const favDocRef = doc(firestore, 'users', userId, 'favorites', String(productId))
    const docSnap = await getDoc(favDocRef)
    return docSnap.exists()
  } catch (error) {
    console.error('[favoritesService] Error checking favorite status:', error)
    return false
  }
}

/**
 * Subscribes to real-time updates of user favorites
 * @param {string} userId
 * @param {Function} callback Callback receiving array of favorite items
 * @returns {Function} Unsubscribe function
 */
export const subscribeUserFavorites = (userId, callback) => {
  if (!userId || typeof callback !== 'function') {
    return () => {}
  }

  try {
    const favRef = collection(firestore, 'users', userId, 'favorites')
    const q = query(favRef, orderBy('addedAt', 'desc'))

    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
        callback(items)
      },
      (error) => {
        console.error('[favoritesService] Snapshot error:', error)
        callback([])
      }
    )
  } catch (error) {
    console.error('[favoritesService] Error setting up favorites subscription:', error)
    return () => {}
  }
}
