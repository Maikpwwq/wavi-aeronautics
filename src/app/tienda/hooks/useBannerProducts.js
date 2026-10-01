/**
 * useBannerProducts — Hydrates banner category data exclusively from sessionStorage.
 *
 * Reads cached product data written by Firebase service modules
 * (FirebaseDroneProducts, FirebaseGooglesProducts, etc.) and extracts
 * the first N products per category for the dynamic banner rotation.
 *
 * Zero Firebase reads — passive hydration only.
 * If a category has no cached products yet, falls back to the category's
 * static cover image so the banner remains fully functional without extra network calls.
 *
 * @module hooks/useBannerProducts
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { BANNER_CATEGORIES } from '@/config/categories'

/**
 * @typedef {import('@/config/categories').CategoryConfig} CategoryConfig
 */

/**
 * @typedef BannerProduct
 * @property {string} productID
 * @property {string} name
 * @property {string[]} images
 * @property {string} firstImage
 */

/**
 * @typedef BannerCategoryData
 * @property {CategoryConfig} category
 * @property {BannerProduct[]} products
 */

const MAX_PRODUCTS_PER_CATEGORY = 4

/**
 * Extract product images from sessionStorage for a set of cache keys.
 * Falls back to category cover image if cache is not yet populated.
 *
 * @param {string[]} cacheKeys - sessionStorage keys to read
 * @param {string} [fallbackImage] - Category cover image fallback
 * @param {string} [fallbackTitle] - Category title fallback
 * @param {string} [categoryId] - Category ID
 * @returns {BannerProduct[]}
 */
function readCachedProducts(cacheKeys, fallbackImage, fallbackTitle, categoryId) {
  if (typeof window === 'undefined') {
    if (fallbackImage) {
      return [{
        productID: categoryId || 'cover',
        name: fallbackTitle || '',
        images: [fallbackImage],
        firstImage: fallbackImage,
      }]
    }
    return []
  }

  const products = []

  // 1. Read category-specific sessionStorage cache
  for (const key of cacheKeys) {
    try {
      const raw = sessionStorage.getItem(key)
      if (!raw) continue

      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) continue

      for (const p of parsed) {
        const images = p.images || p.imagenes || []
        const firstImage = images[0] || p.firstImage || ''
        if (!firstImage) continue // No image → useless for the banner

        products.push({
          productID: p.productID || p.id || '',
          name: p.name || p.titulo || '',
          images,
          firstImage,
        })

        if (products.length >= MAX_PRODUCTS_PER_CATEGORY) break
      }

      if (products.length >= MAX_PRODUCTS_PER_CATEGORY) break
    } catch {
      // Corrupted sessionStorage entry → skip silently
    }
  }

  // 2. Also check Wavi_All_Products_Search_Cache if category keys were empty
  if (products.length === 0) {
    try {
      const rawSearch = sessionStorage.getItem('Wavi_All_Products_Search_Cache')
      if (rawSearch) {
        const parsedSearch = JSON.parse(rawSearch)
        if (Array.isArray(parsedSearch)) {
          for (const p of parsedSearch) {
            const pCat = p.category || p.categoria
            if (pCat === categoryId) {
              const images = p.images || p.imagenes || []
              const firstImage = images[0] || p.firstImage || ''
              if (firstImage) {
                products.push({
                  productID: p.productID || p.id || '',
                  name: p.name || p.titulo || '',
                  images,
                  firstImage,
                })
                if (products.length >= MAX_PRODUCTS_PER_CATEGORY) break
              }
            }
          }
        }
      }
    } catch {
      // Silent error ignore
    }
  }

  // 3. Fallback to category cover image if no products cached yet
  if (products.length === 0 && fallbackImage) {
    products.push({
      productID: categoryId || 'cover',
      name: fallbackTitle || '',
      images: [fallbackImage],
      firstImage: fallbackImage,
    })
  }

  return products
}

/**
 * Hook that reads product data from sessionStorage for all banner-enabled categories.
 *
 * @returns {{ bannerData: BannerCategoryData[], isHydrated: boolean }}
 */
export function useBannerProducts() {
  const [data, setData] = useState([])
  const [isHydrated, setIsHydrated] = useState(false)

  const hydrate = useCallback(() => {
    const result = []

    for (const cat of BANNER_CATEGORIES) {
      const products = readCachedProducts(cat.cacheKeys, cat.coverImage, cat.title, cat.id)
      if (products.length > 0) {
        result.push({ category: cat, products })
      }
    }

    setData(result)
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    // Initial hydration
    hydrate()

    // Re-hydrate when another tab/component updates sessionStorage
    const onStorage = (e) => {
      if (e.storageArea === sessionStorage) hydrate()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [hydrate])

  return { bannerData: data, isHydrated }
}
