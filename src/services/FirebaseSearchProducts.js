'use client'

import { firestore } from '@/firebase/firebaseClient'
import { collectionGroup, getDocs, query } from 'firebase/firestore'
import { calculateCopPrice } from '@/utilities/priceUtils'

let cachedAllItems = null

/**
 * Searches products by term across name, brand, category, and tags.
 * Uses collectionGroup('items') or cached products.
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
    // Try sessionStorage cache first
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('Wavi_All_Products_Search_Cache')
      if (cached) {
        try {
          pool = JSON.parse(cached)
        } catch (e) {
          pool = []
        }
      }
    }

    // If cache empty, fetch all items from Firestore collectionGroup 'items'
    if (!pool || pool.length === 0) {
      if (cachedAllItems) {
        pool = cachedAllItems
      } else {
        try {
          const q = query(collectionGroup(firestore, 'items'))
          const snapshot = await getDocs(q)
          pool = snapshot.docs.map((doc) => doc.data())
          cachedAllItems = pool

          if (typeof window !== 'undefined') {
            sessionStorage.setItem(
              'Wavi_All_Products_Search_Cache',
              JSON.stringify(pool)
            )
          }
        } catch (err) {
          console.error('Error querying Firestore for search:', err)
          pool = []
        }
      }
    }
  }

  // 2. Filter matching products
  const matches = pool.filter((product) => {
    if (!product) return false

    const name = String(product.name || '').toLowerCase()
    const brand = String(product.brand || product.marca || '').toLowerCase()
    const category = String(product.category || '').toLowerCase()
    
    let tagsString = ''
    if (Array.isArray(product.tags)) {
      tagsString = product.tags.join(' ').toLowerCase()
    } else if (product.tags && typeof product.tags === 'object') {
      tagsString = Object.values(product.tags).join(' ').toLowerCase()
    }

    return (
      name.includes(normalizedTerm) ||
      brand.includes(normalizedTerm) ||
      category.includes(normalizedTerm) ||
      tagsString.includes(normalizedTerm)
    )
  })

  // 3. Format and normalize price & image for display
  return matches.map((p) => {
    const images = p.images || []
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
      name: p.name || 'Sin Nombre',
      brand: p.brand || p.marca || 'Aeronautics',
      category: p.category || 'tienda',
      displayPrice,
      firstImage,
      isAgotado: p.availability === false,
    }
  })
}

export default searchProducts
