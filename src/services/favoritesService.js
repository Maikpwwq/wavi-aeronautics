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

/**
 * Transforms an array of favorite items into cart-ready items with `selected: true` and `cantidad: 1`.
 * @param {Array} favoritesList
 * @returns {Array} Cart items ready for insertion into shopping cart
 */
export const formatFavoritesForCart = (favoritesList = []) => {
  if (!Array.isArray(favoritesList)) return []
  return favoritesList
    .filter((item) => item && (item.productId || item.id || item.productID))
    .map((item) => {
      const productID = String(item.productID || item.productId || item.id)
      return {
        ...item,
        productID,
        cantidad: Number(item.cantidad) || 1,
        selected: true
      }
    })
}

/**
 * Merges favorite items into existing cart products ensuring each is selected for checkout.
 * If an item is already in the cart, preserves its existing quantity and marks `selected: true`.
 * If new, appends with `cantidad: 1` and `selected: true`.
 * @param {Array} currentCartProducts
 * @param {Array} favoritesList
 * @returns {Array} Updated cart products list
 */
export const mergeFavoritesIntoCart = (currentCartProducts = [], favoritesList = []) => {
  const currentList = Array.isArray(currentCartProducts) ? currentCartProducts : []
  const favList = Array.isArray(favoritesList) ? favoritesList : []

  const cartMap = new Map()
  currentList.forEach((item) => {
    if (item && item.productID) {
      cartMap.set(String(item.productID), { ...item })
    }
  })

  favList.forEach((fav) => {
    const pId = String(fav?.productID || fav?.productId || fav?.id || '')
    if (!pId) return

    if (cartMap.has(pId)) {
      const existing = cartMap.get(pId)
      cartMap.set(pId, {
        ...existing,
        selected: true
      })
    } else {
      cartMap.set(pId, {
        ...fav,
        productID: pId,
        cantidad: Number(fav.cantidad) || 1,
        selected: true
      })
    }
  })

  return Array.from(cartMap.values())
}
