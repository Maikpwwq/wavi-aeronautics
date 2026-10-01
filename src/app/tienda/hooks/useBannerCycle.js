/**
 * useBannerCycle — Dual-timer architecture for the dynamic category banner.
 *
 * Manages two synchronized intervals:
 *   - MAJOR cycle (4s): rotates through slides/categories (text column or cover)
 *   - MINOR cycle (dynamic): rotates product images within the active category
 *
 * The minor interval is calculated as `majorInterval / numProducts` to ensure
 * all product images cycle exactly once before the next slide transition.
 *
 * Supports pausing via IntersectionObserver and mouse hover.
 *
 * @module hooks/useBannerCycle
 */
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const MAJOR_MS = 4_500
const MINOR_MS = 1_333 // Default fallback (~3 rotations per 4s window)
const CATEGORY_TRANSITION_MS = 300
const IMAGE_TRANSITION_MS = 250

/**
 * @typedef CycleConfig
 * @property {number} [totalCategories] - Total categories to rotate through
 * @property {number} [totalSlides] - Total slides including general cover
 * @property {number[]} [productsPerCategory] - Array of product counts per category index
 * @property {number[]} [productsPerSlide] - Array of product counts per slide index
 * @property {number} [majorInterval=4500] - ms between slide changes
 * @property {number} [minorInterval=1333] - fallback ms between image changes
 * @property {boolean} [paused=false] - Freeze both cycles (e.g., off-screen or hovered)
 */

/**
 * @typedef CycleState
 * @property {number} categoryIndex - Current active category/slide index
 * @property {number} slideIndex - Alias for categoryIndex
 * @property {number} imageIndex - Current active image index within the category
 * @property {boolean} isCategoryTransitioning - true during slide fade transition
 * @property {boolean} isSlideTransitioning - Alias for isCategoryTransitioning
 * @property {boolean} isImageTransitioning - true during image crossfade
 * @property {(index: number) => void} goToCategory - Manually switch to a category index
 * @property {(index: number) => void} goToSlide - Alias for goToCategory
 */

/**
 * Dual-timer hook for the dynamic banner rotation.
 *
 * @param {CycleConfig} config
 * @returns {CycleState}
 */
export function useBannerCycle({
  totalCategories,
  totalSlides,
  productsPerCategory,
  productsPerSlide,
  majorInterval = MAJOR_MS,
  minorInterval = MINOR_MS,
  paused = false,
}) {
  const total = totalSlides ?? totalCategories ?? 0
  const productCounts = productsPerSlide ?? productsPerCategory ?? []

  const [categoryIndex, setCategoryIndex] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)
  const [isCategoryTransitioning, setIsCategoryTransitioning] = useState(false)
  const [isImageTransitioning, setIsImageTransitioning] = useState(false)

  const minorRef = useRef(null)
  const majorRef = useRef(null)

  // Current category/slide product count
  const currentProductCount = productCounts[categoryIndex] || 1

  // Dynamic minor interval: divide the major window equally among products
  const dynamicMinor =
    currentProductCount > 1
      ? Math.floor(majorInterval / currentProductCount)
      : majorInterval

  // ── Cleanup helpers ──
  const clearMinor = useCallback(() => {
    if (minorRef.current) {
      clearInterval(minorRef.current)
      minorRef.current = null
    }
  }, [])

  const clearMajor = useCallback(() => {
    if (majorRef.current) {
      clearInterval(majorRef.current)
      majorRef.current = null
    }
  }, [])

  // ── Manual slide selection ──
  const goToCategory = useCallback((index) => {
    if (index === categoryIndex) return
    setIsCategoryTransitioning(true)
    setTimeout(() => {
      setCategoryIndex(index)
      setImageIndex(0)
      setIsCategoryTransitioning(false)
    }, CATEGORY_TRANSITION_MS)
  }, [categoryIndex])

  // ── Minor cycle (image rotation) ──
  useEffect(() => {
    if (paused || total === 0) return
    clearMinor()

    if (currentProductCount <= 1) return // No rotation needed for single image or general cover

    minorRef.current = setInterval(() => {
      setIsImageTransitioning(true)

      setTimeout(() => {
        setImageIndex((prev) => (prev + 1) % currentProductCount)
        setIsImageTransitioning(false)
      }, IMAGE_TRANSITION_MS)
    }, dynamicMinor)

    return clearMinor
  }, [categoryIndex, currentProductCount, dynamicMinor, paused, total, clearMinor])

  // ── Major cycle (slide rotation) ──
  useEffect(() => {
    if (paused || total <= 1) return
    clearMajor()

    majorRef.current = setInterval(() => {
      setIsCategoryTransitioning(true)

      setTimeout(() => {
        setCategoryIndex((prev) => (prev + 1) % total)
        setImageIndex(0) // Reset minor cycle
        setIsCategoryTransitioning(false)
      }, CATEGORY_TRANSITION_MS)
    }, majorInterval)

    return clearMajor
  }, [total, majorInterval, paused, clearMajor])

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      clearMinor()
      clearMajor()
    }
  }, [clearMinor, clearMajor])

  return {
    categoryIndex,
    slideIndex: categoryIndex,
    imageIndex,
    isCategoryTransitioning,
    isSlideTransitioning: isCategoryTransitioning,
    isImageTransitioning,
    goToCategory,
    goToSlide: goToCategory,
  }
}
