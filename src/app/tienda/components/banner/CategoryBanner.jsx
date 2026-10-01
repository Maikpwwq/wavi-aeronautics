/**
 * CategoryBanner — Dynamic two-column category showcase banner for the Home page.
 *
 * Coordinates:
 *   - useBannerProducts: Passive sessionStorage hydration (zero Firebase reads)
 *   - useBannerCycle: Dual-timer (4s category cycle + dynamic sub-interval image cycle)
 *   - BannerTextColumn: Left column displaying active category details
 *   - BannerImageColumn: Right column crossfading product images
 *   - Interactive progress dots for manual or visual category tracking
 *   - IntersectionObserver: Automatically pauses timers when off-screen
 *
 * @module components/banner/CategoryBanner
 */
'use client'

import React, { useRef, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { useBannerProducts } from '@/app/tienda/hooks/useBannerProducts'
import { useBannerCycle } from '@/app/tienda/hooks/useBannerCycle'
import BannerTextColumn from './BannerTextColumn'
import BannerImageColumn from './BannerImageColumn'

export default function CategoryBanner() {
  const { bannerData, isHydrated } = useBannerProducts()
  const bannerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)

  // ── IntersectionObserver: Pause animation cycles when off-screen ──
  useEffect(() => {
    const el = bannerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const {
    categoryIndex,
    imageIndex,
    isCategoryTransitioning,
    isImageTransitioning,
    goToCategory,
  } = useBannerCycle({
    totalCategories: bannerData.length,
    productsPerCategory: bannerData.map((d) => d.products.length),
    paused: !isVisible || !isHydrated || bannerData.length <= 1,
  })

  // Do not render until hydrated or if no categories available
  if (!isHydrated || bannerData.length === 0) {
    return null
  }

  const currentData = bannerData[categoryIndex] || bannerData[0]
  if (!currentData) return null

  const { category, products } = currentData
  const activeProduct = products[imageIndex] || products[0]
  const currentImage = activeProduct?.firstImage || category.coverImage || ''
  const currentProductName = activeProduct?.name || category.title

  return (
    <Box
      ref={bannerRef}
      component="section"
      aria-label="Categorías destacadas"
      id="category-banner"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #090e17 0%, #0f172a 45%, #131d31 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        py: { xs: 4, sm: 5, md: 6 },
        minHeight: { xs: 520, sm: 460, md: 440 },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Decorative ambient background glows */}
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 172, 228, 0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -60,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 172, 228, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
          gap: { xs: 3, md: 5 },
          alignItems: 'center',
        }}
      >
        {/* ── Column 1: Category Details (Major 4s cycle) ── */}
        <BannerTextColumn
          title={category.title}
          description={category.description}
          href={category.href}
          iconName={category.iconName}
          isTransitioning={isCategoryTransitioning}
          totalCategories={bannerData.length}
          activeIndex={categoryIndex}
        />

        {/* ── Column 2: Product Hardware Gallery (Minor sub-interval cycle) ── */}
        <BannerImageColumn
          imageUrl={currentImage}
          productName={currentProductName}
          isTransitioning={isImageTransitioning}
        />
      </Container>

      {/* ── Interactive Progress Dots ── */}
      {bannerData.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 12, md: 16 },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            zIndex: 3,
            bgcolor: 'rgba(15, 23, 42, 0.65)',
            px: 1.5,
            py: 0.75,
            borderRadius: 4,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {bannerData.map((d, idx) => {
            const isActive = idx === categoryIndex
            return (
              <Box
                key={d.category.id || idx}
                component="button"
                type="button"
                aria-label={`Ver categoría ${d.category.title}`}
                onClick={() => goToCategory && goToCategory(idx)}
                sx={{
                  border: 'none',
                  p: 0,
                  cursor: 'pointer',
                  width: isActive ? 22 : 7,
                  height: 7,
                  borderRadius: 3.5,
                  bgcolor: isActive ? '#00aCe4' : 'rgba(255, 255, 255, 0.25)',
                  boxShadow: isActive ? '0 0 10px rgba(0, 172, 228, 0.6)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: isActive ? '#00aCe4' : 'rgba(255, 255, 255, 0.5)',
                  },
                }}
              />
            )
          })}
        </Box>
      )}
    </Box>
  )
}
