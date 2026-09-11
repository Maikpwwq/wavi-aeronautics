'use client'

import { calculateCopPrice } from '@/utilities/priceUtils'
import { matchesBrand, FEATURED_BRANDS } from '@/utilities/brandsConfig'
import FirebaseDroneProducts from '@/services/FirebaseDroneProducts'
import FirebaseRadioControlProducts from '@/services/FirebaseRadioControlProducts'
import FirebaseAccesoriosProducts from '@/services/FirebaseAccesoriosProducts'
import FirebaseGooglesProducts from '@/services/FirebaseGooglesProducts'
import FirebaseTrasmisorReceptorProducts from '@/services/FirebaseTrasmisorReceptorProducts'
import FirebaseDigitalVTXProducts from '@/services/FirebaseDigitalVTXProducts'

let cachedAllItems = null

/**
 * Normalizes products for UI presentation (prices, images, isAgotado, legacy fields).
 * @param {Array} products
 * @returns {Array}
 */
export function normalizeProductsForDisplay(products = []) {
  if (!Array.isArray(products)) return []

  return products.map((p) => {
    if (!p) return p
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

/**
 * Fetches all products across all store categories reliably via category services.
 * Uses in-memory and sessionStorage caches once populated.
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

  // 2. Parallel fetch across all category services.
  // Each category service automatically checks its own sessionStorage key
  // and falls back to Firestore only if missing.
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
 * Filters the catalog strictly by brand, supporting aliases (e.g. 'tbs' ↔ 'team-blacksheep').
 * Does not match competitor products that simply mention the brand in descriptions.
 *
 * @param {string} brandTerm
 * @param {Array} [localProducts]
 * @returns {Promise<Array>}
 */
export async function searchByBrand(brandTerm, localProducts = []) {
  if (!brandTerm || typeof brandTerm !== 'string' || !brandTerm.trim()) {
    return []
  }

  const cleanBrand = brandTerm.trim()

  let pool = []
  if (Array.isArray(localProducts) && localProducts.length > 0) {
    pool = localProducts
  } else {
    pool = await fetchAllStoreProducts()
  }

  const matches = pool.filter((product) => {
    if (!product) return false
    const rawBrand = product.brand || product.marca
    return matchesBrand(rawBrand, cleanBrand)
  })

  return normalizeProductsForDisplay(matches)
}

/**
 * Searches products by term across name/title, brand/marca (with alias resolution), category, and tags.
 * Ranks brand and title matches above generic description matches.
 * Excludes description matches for brand queries to prevent false positives from competitor products.
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

  // 2. Check if search term matches a known brand or brand alias
  const isKnownBrandSearch = FEATURED_BRANDS.some(
    (b) =>
      matchesBrand(b.slug, normalizedTerm) || matchesBrand(b.name, normalizedTerm)
  )

  // 3. Filter and score matches
  const scoredMatches = []

  for (const product of pool) {
    if (!product) continue

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

    const brandIsMatch =
      matchesBrand(rawBrand, normalizedTerm) ||
      rawBrand.toLowerCase().includes(normalizedTerm)
    const nameIsMatch = name.includes(normalizedTerm)
    const categoryIsMatch = category.includes(normalizedTerm)
    const tagsIsMatch = tagsString.includes(normalizedTerm)

    // For brand queries: NEVER match on description of competitor brands
    // For generic queries: match description only as whole word
    let descIsMatch = false
    if (!isKnownBrandSearch) {
      const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const wordRegex = new RegExp(`\\b${escaped}\\b`, 'i')
      descIsMatch = wordRegex.test(description)
    }

    if (brandIsMatch || nameIsMatch || categoryIsMatch || tagsIsMatch || descIsMatch) {
      let score = 0
      if (brandIsMatch) score += 100
      if (name.startsWith(normalizedTerm)) score += 50
      else if (nameIsMatch) score += 30
      if (tagsIsMatch) score += 20
      if (categoryIsMatch) score += 10
      if (descIsMatch) score += 5

      scoredMatches.push({ product, score })
    }
  }

  // Sort by highest relevance score first
  scoredMatches.sort((a, b) => b.score - a.score)

  const matches = scoredMatches.map((item) => item.product)
  return normalizeProductsForDisplay(matches)
}

export default searchProducts
