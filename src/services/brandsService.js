'use client'

import { STORE_BRANDS, matchesBrand, cleanBrandString } from '@/utilities/brandsConfig'
import { fetchAllStoreProducts } from '@/services/FirebaseSearchProducts'

/**
 * Returns a deduplicated, canonical list of store brands, enriched with product counts.
 * 
 * @param {Array} [localProducts] - Optional array of products to compute brands from without network calls.
 * @returns {Promise<Array>} Array of Brand objects with { id, name, slug, logoUrl, tagline, itemCount }
 */
export async function getCatalogBrands(localProducts = null) {
  let products = localProducts
  if (!products) {
    try {
      products = await fetchAllStoreProducts()
    } catch (err) {
      console.error('Error fetching products in getCatalogBrands:', err)
      products = []
    }
  }

  // Initialize map from canonical STORE_BRANDS
  const brandMap = new Map()
  STORE_BRANDS.forEach((brand) => {
    brandMap.set(brand.id, {
      ...brand,
      itemCount: 0,
    })
  })

  // Count items matching canonical brands and register any untracked brands dynamically
  if (Array.isArray(products) && products.length > 0) {
    products.forEach((product) => {
      if (!product) return
      const rawBrand = product.brand || product.marca
      if (!rawBrand || rawBrand === 'default') return

      let matched = false
      for (const [, brandEntry] of brandMap.entries()) {
        if (matchesBrand(rawBrand, brandEntry.id) || matchesBrand(rawBrand, brandEntry.slug)) {
          brandEntry.itemCount += 1
          matched = true
          break
        }
      }

      // If a product brand doesn't match any canonical brand, dynamically add it
      if (!matched) {
        const clean = cleanBrandString(rawBrand)
        if (!brandMap.has(clean)) {
          const capitalized = rawBrand.charAt(0).toUpperCase() + rawBrand.slice(1)
          brandMap.set(clean, {
            id: clean,
            name: capitalized,
            slug: clean,
            aliases: [rawBrand.toLowerCase().trim()],
            logoUrl: null,
            tagline: `Equipos y componentes de ${capitalized}`,
            itemCount: 1,
          })
        } else {
          brandMap.get(clean).itemCount += 1
        }
      }
    })
  }

  // Convert map to array and sort alphabetically by name
  const brandsList = Array.from(brandMap.values())
  brandsList.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))

  return brandsList
}

/**
 * Synchronous fallback providing all configured store brands sorted alphabetically.
 * @returns {Array}
 */
export function getFallbackBrands() {
  return [...STORE_BRANDS].sort((a, b) =>
    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
  )
}
