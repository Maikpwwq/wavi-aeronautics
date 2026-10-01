/**
 * categoryCrudService — Specialized CRUD operations for Store Categories
 * (Baterías, Hélices, Frames/Chasis, etc.)
 *
 * Enforces dual synchronization:
 *   1. Cloud Firestore: hierarchical path `products/{category}/brands/{brand}/items/{productID}`
 *   2. Client SessionStorage: immediate cache invalidation/mutation to minimize reads
 *      and keep PDP/storefront synchronized.
 */
import { firestore } from '@/firebase/firebaseClient'
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore'
import { parseProductPrices } from '@/utilities/priceUtils'

/**
 * Mapping between category identifiers and their respective sessionStorage cache keys
 */
export const CATEGORY_STORAGE_KEYS = {
  baterias: 'Productos_Baterias',
  accesorios: 'Productos_Baterias',
  helices: 'Productos_Helices',
  frames: 'Productos_Frames',
  chasis: 'Productos_Frames',
  dronesKit: 'Productos_Drones_Kits',
  dronesHD: 'Productos_DronesHD',
  dronesRC: 'Productos_DronesRC',
  googles: 'Productos_Googles',
  radioControl: 'Productos_RC',
  digitalVTX: 'Digital_VTX',
  transmisors: 'Productos_Transmisor',
  receptors: 'Productos_Receptor'
}

/**
 * Resolve cache key for a given category name or slug
 * @param {string} category 
 * @returns {string} sessionStorage key
 */
export const getCategoryCacheKey = (category) => {
  if (!category) return 'Productos_Catalog'
  const normalized = category.toLowerCase().trim()
  return CATEGORY_STORAGE_KEYS[normalized] || `Productos_${category}`
}

/**
 * Safely retrieve category products from sessionStorage
 * @param {string} category 
 * @returns {Array|null}
 */
export const getCategoryCache = (category) => {
  if (typeof window === 'undefined' || !window.sessionStorage) return null
  const key = getCategoryCacheKey(category)
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.warn(`[categoryCrudService] Error reading cache for ${key}:`, err)
    return null
  }
}

/**
 * Safely write category products to sessionStorage
 * @param {string} category 
 * @param {Array} products 
 */
export const setCategoryCache = (category, products) => {
  if (typeof window === 'undefined' || !window.sessionStorage) return
  const key = getCategoryCacheKey(category)
  try {
    sessionStorage.setItem(key, JSON.stringify(products))
  } catch (err) {
    console.warn(`[categoryCrudService] Error writing cache for ${key}:`, err)
  }
}

/**
 * Remove category cache from sessionStorage
 * @param {string} category 
 */
export const clearCategoryCache = (category) => {
  if (typeof window === 'undefined' || !window.sessionStorage) return
  const key = getCategoryCacheKey(category)
  try {
    sessionStorage.removeItem(key)
  } catch (err) {
    console.warn(`[categoryCrudService] Error clearing cache for ${key}:`, err)
  }
}

/**
 * READ: Fetch products for a specific category with zero-read sessionStorage hydration
 * @param {string} category - Category slug (e.g. 'helices', 'frames', 'baterias')
 * @param {object} [options]
 * @param {boolean} [options.forceRefresh=false]
 * @returns {Promise<Array>}
 */
export const fetchCategoryProducts = async (category, { forceRefresh = false } = {}) => {
  if (!category) return []

  // 1. SessionStorage fast path
  if (!forceRefresh) {
    const cached = getCategoryCache(category)
    if (cached && Array.isArray(cached) && cached.length > 0) {
      parseProductPrices(cached)
      return cached
    }
  }

  // 2. Cloud Firestore query
  try {
    // Support category aliases (e.g. frames & chasis)
    const categoryQueryValues =
      category === 'frames' || category === 'chasis'
        ? ['frames', 'chasis']
        : category === 'baterias' || category === 'accesorios'
        ? ['baterias', 'accesorios']
        : [category]

    const q =
      categoryQueryValues.length > 1
        ? query(collectionGroup(firestore, 'items'), where('category', 'in', categoryQueryValues))
        : query(collectionGroup(firestore, 'items'), where('category', '==', category))

    const snapshot = await getDocs(q)
    const products = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }))

    // Save to session cache
    setCategoryCache(category, products)
    parseProductPrices(products)

    return products
  } catch (error) {
    console.error(`[categoryCrudService] Error fetching products for category '${category}':`, error)
    return []
  }
}

/**
 * CREATE: Create a new product in Firestore and synchronize sessionStorage
 * @param {object} productData - New product payload
 * @returns {Promise<object>} Created product
 */
export const createCategoryProduct = async (productData) => {
  const { productID, category, brand, ...data } = productData || {}

  if (!productID) throw new Error('productID (SKU) es requerido')
  if (!category) throw new Error('category es requerida')
  if (!brand) throw new Error('brand es requerida')

  const docRef = doc(firestore, 'products', category, 'brands', brand, 'items', productID)

  const newDoc = {
    ...data,
    productID,
    category,
    brand,
    availability: productData.availability !== false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }

  await setDoc(docRef, newDoc)

  // Mutate sessionStorage cache
  const cached = getCategoryCache(category)
  if (Array.isArray(cached)) {
    const updated = [
      { id: productID, ...newDoc, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ...cached.filter((p) => p.productID !== productID && p.id !== productID)
    ]
    setCategoryCache(category, updated)
  }

  return { id: productID, ...newDoc }
}

/**
 * UPDATE: Update an existing product in Firestore and synchronize sessionStorage
 * @param {string} productID
 * @param {object} updateData
 * @param {string} [categoryHint]
 * @param {string} [brandHint]
 * @returns {Promise<object>}
 */
export const updateCategoryProduct = async (productID, updateData, categoryHint, brandHint) => {
  if (!productID) throw new Error('productID is required for update')

  const category = categoryHint || updateData.category || ''
  const brand = brandHint || updateData.brand || ''

  let targetRef = null

  // 1. Direct path attempt
  if (category && brand) {
    const directRef = doc(firestore, 'products', category, 'brands', brand, 'items', productID)
    const directSnap = await getDoc(directRef)
    if (directSnap.exists()) {
      targetRef = directRef
    }
  }

  // 2. Search via collectionGroup if direct path not found
  if (!targetRef) {
    const q = query(collectionGroup(firestore, 'items'), where('productID', '==', productID))
    const snap = await getDocs(q)
    if (!snap.empty) {
      targetRef = snap.docs[0].ref
    }
  }

  if (!targetRef) {
    throw new Error(`Product with ID ${productID} not found in Firestore`)
  }

  const payload = {
    ...updateData,
    updatedAt: serverTimestamp()
  }

  await updateDoc(targetRef, payload)

  // 3. Mutate sessionStorage cache
  const targetCategory = category || updateData.category
  if (targetCategory) {
    const cached = getCategoryCache(targetCategory)
    if (Array.isArray(cached)) {
      const updated = cached.map((p) => {
        if (p.productID === productID || p.id === productID) {
          return { ...p, ...updateData, updatedAt: new Date().toISOString() }
        }
        return p
      })
      setCategoryCache(targetCategory, updated)
    }
  }

  return { productID, ...updateData }
}

/**
 * DELETE: Delete a product from Firestore and synchronize sessionStorage
 * @param {string} productID
 * @param {string} [category]
 * @param {string} [brand]
 * @returns {Promise<{ success: boolean, productID: string }>}
 */
export const deleteCategoryProduct = async (productID, category, brand) => {
  if (!productID) throw new Error('productID is required for deletion')

  let targetRef = null

  // 1. Direct path attempt
  if (category && brand) {
    const directRef = doc(firestore, 'products', category, 'brands', brand, 'items', productID)
    const directSnap = await getDoc(directRef)
    if (directSnap.exists()) {
      targetRef = directRef
    }
  }

  // 2. Search fallback
  if (!targetRef) {
    const q = query(collectionGroup(firestore, 'items'), where('productID', '==', productID))
    const snap = await getDocs(q)
    if (!snap.empty) {
      targetRef = snap.docs[0].ref
    }
  }

  if (targetRef) {
    await deleteDoc(targetRef)
  }

  // 3. Remove from sessionStorage cache
  if (category) {
    const cached = getCategoryCache(category)
    if (Array.isArray(cached)) {
      const filtered = cached.filter((p) => p.productID !== productID && p.id !== productID)
      setCategoryCache(category, filtered)
    }
  }

  return { success: true, productID }
}
