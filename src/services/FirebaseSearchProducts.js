'use client'

import { calculateCopPrice } from '@/utilities/priceUtils'
import { matchesBrand } from '@/utilities/brandsConfig'
import FirebaseDroneProducts from '@/services/FirebaseDroneProducts'
import FirebaseRadioControlProducts from '@/services/FirebaseRadioControlProducts'
import FirebaseAccesoriosProducts from '@/services/FirebaseAccesoriosProducts'
import FirebaseGooglesProducts from '@/services/FirebaseGooglesProducts'
import FirebaseTrasmisorReceptorProducts from '@/services/FirebaseTrasmisorReceptorProducts'
import FirebaseDigitalVTXProducts from '@/services/FirebaseDigitalVTXProducts'

let cachedAllItems = null

/**
 * Reads all cached products across category keys in sessionStorage if present.
 * @returns {Array|null}
 */
const getCategoryCachesFromSession = () => {
  if (typeof window === 'undefined') return null

  try {
    const rawRC = sessionStorage.getItem('Productos_RC')
    const rawDronesKits = sessionStorage.getItem('Productos_Drones_Kits')
    const rawDronesRC = sessionStorage.getItem('Productos_DronesRC')
    const rawDronesHD = sessionStorage.getItem('Productos_DronesHD')
    const rawGoogles = sessionStorage.getItem('Productos_Googles')
    const rawBaterias = sessionStorage.getItem('Productos_Baterias')
    const rawReceptor = sessionStorage.getItem('Productos_Receptor')
    const rawTransmisor = sessionStorage.getItem('Productos_Transmisor')
    const rawDigitalVTX = sessionStorage.getItem('Productos_DigitalVTX')

    const hasAnyCache =
      rawRC ||
      rawDronesKits ||
      rawDronesRC ||
      rawDronesHD ||
      rawGoogles ||
      rawBaterias ||
      rawReceptor ||
      rawTransmisor ||
      rawDigitalVTX

    if (!hasAnyCache) return null

    const pool = [
      ...(rawRC ? JSON.parse(rawRC) : []),
      ...(rawDronesKits ? JSON.parse(rawDronesKits) : []),
      ...(rawDronesRC ? JSON.parse(rawDronesRC) : []),
      ...(rawDronesHD ? JSON.parse(rawDronesHD) : []),
      ...(rawGoogles ? JSON.parse(rawGoogles) : []),
      ...(rawBaterias ? JSON.parse(rawBaterias) : []),
      ...(rawReceptor ? JSON.parse(rawReceptor) : []),
      ...(rawTransmisor ? JSON.parse(rawTransmisor) : []),
      ...(rawDigitalVTX ? JSON.parse(rawDigitalVTX) : []),
    ]

    return pool.length > 0 ? pool : null
  } catch (e) {
    return null
  }
}

/**
 * Fetches all products across all store categories reliably via category services.
 * @returns {Promise<Array>}
 */
export async function fetchAllStoreProducts() {
  if (cachedAllItems && cachedAllItems.length > 0) {
    return cachedAllItems
  }

  // 1. Try search cache in sessionStorage
  if (typeof window !== 'undefined') {
    const cachedSearch = sessionStorage.getItem('Wavi_All_Products_Search_Cache')
    if (cachedSearch) {
      try {
        const parsed = JSON.parse(cachedSearch)
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedAllItems = parsed
          return parsed
        }
      } catch (e) {
        // ignore JSON parse error
      }
    }
  }

  // 2. Try gathering from category sessionStorage keys
  const sessionCatPool = getCategoryCachesFromSession()
  if (sessionCatPool && sessionCatPool.length > 0) {
    cachedAllItems = sessionCatPool
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(
          'Wavi_All_Products_Search_Cache',
          JSON.stringify(sessionCatPool)
        )
      } catch (e) {}
    }
    return sessionCatPool
  }

  // 3. Parallel fetch via standard category services (uses indexed queries with category where clauses)
  try {
    const [
      dronesData,
      radiosData,
      bateriasData,
      googlesData,
      trRxData,
      vtxData,
    ] = await Promise.all([
      FirebaseDroneProducts(),
      FirebaseRadioControlProducts(),
      FirebaseAccesoriosProducts(),
      FirebaseGooglesProducts(),
      FirebaseTrasmisorReceptorProducts(),
      FirebaseDigitalVTXProducts(),
    ])

    const pool = [
      ...(dronesData?.storeProductsKits || []),
      ...(dronesData?.storeProductsRC || []),
      ...(dronesData?.storeProductsHD || []),
      ...(radiosData?.storeProductsRC || []),
      ...(bateriasData?.productsBaterias || []),
      ...(googlesData?.productsGoogles || []),
      ...(trRxData?.storeProductsReceptor || []),
      ...(trRxData?.storeProductsTransmisor || []),
      ...(vtxData?.storeDigitalVTX || []),
    ]

    cachedAllItems = pool
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(
          'Wavi_All_Products_Search_Cache',
          JSON.stringify(pool)
        )
      } catch (e) {}
    }

    return pool
  } catch (err) {
    console.error('Error in fetchAllStoreProducts:', err)
    return []
  }
}

/**
 * Searches products by term across name/title, brand/marca (with alias resolution), category, and tags.
 *
 * @param {string} searchTerm - Search term entered by user
 * @param {Array} [localProducts] - Optional pre-loaded products array to search locally first
 * @returns {Promise<Array>} Array of matched product objects with normalized fields
 */
export async function searchProducts(searchTerm, localProducts = []) {
  if (!searchTerm || typeof searchTerm !== 'string' || !searchTerm.trim()) {
    return []
  }

  const normalizedTerm = searchTerm.trim().toLowerCase()

  // 1. Gather all potential products
  let pool = []

  if (Array.isArray(localProducts) && localProducts.length > 0) {
    pool = localProducts
  } else {
    pool = await fetchAllStoreProducts()
  }

  // 2. Filter matching products
  const matches = pool.filter((product) => {
    if (!product) return false

    const name = String(product.name || product.titulo || '').toLowerCase()
    const rawBrand = String(product.brand || product.marca || '')
    const category = String(product.category || product.categoria || '').toLowerCase()
    const description = String(product.description || product.descripcion || '').toLowerCase()

    let tagsString = ''
    if (Array.isArray(product.tags)) {
      tagsString = product.tags.join(' ').toLowerCase()
    } else if (product.tags && typeof product.tags === 'object') {
      tagsString = Object.values(product.tags).join(' ').toLowerCase()
    }

    const brandMatched =
      matchesBrand(rawBrand, normalizedTerm) ||
      rawBrand.toLowerCase().includes(normalizedTerm)
    const nameMatched = name.includes(normalizedTerm)
    const categoryMatched = category.includes(normalizedTerm)
    const tagsMatched = tagsString.includes(normalizedTerm)
    const descMatched = description.includes(normalizedTerm)

    return (
      brandMatched ||
      nameMatched ||
      categoryMatched ||
      tagsMatched ||
      descMatched
    )
  })

  // 3. Format and normalize price & image for display
  return matches.map((p) => {
    const images = p.images || p.imagenes || []
    const firstImage =
      images.length > 0
        ? typeof images[0] === 'string'
          ? images[0]
          : images[0]?.url || ''
        : ''

    let displayPrice = '$ 0'
    if (p.price) {
      displayPrice = calculateCopPrice(p.price)
    } else if (p.precio) {
      displayPrice =
        typeof p.precio === 'string'
          ? p.precio
          : `$ ${p.precio.toLocaleString()}`
    }

    return {
      ...p,
      productID: p.productID || p.id || '',
      name: p.name || p.titulo || 'Sin Nombre',
      brand: p.brand || p.marca || 'Aeronautics',
      category: p.category || p.categoria || 'tienda',
      displayPrice,
      firstImage,
      isAgotado: p.availability === false,
    }
  })
}

export default searchProducts
