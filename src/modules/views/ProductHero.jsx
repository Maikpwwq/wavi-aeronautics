'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import withRoot from '@/modules/withRoot'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const productHeroWonder = '/static/themes/productHeroWonder.png'
const productHeroArrowDown = '/static/themes/productHeroArrowDown.png'

import { useBannerProducts } from '@/app/tienda/hooks/useBannerProducts'
import { useBannerCycle } from '@/app/tienda/hooks/useBannerCycle'
import BannerTextColumn from '@/app/tienda/components/banner/BannerTextColumn'
import BannerImageColumn from '@/app/tienda/components/banner/BannerImageColumn'

const MavicAir = '/static/img/Portada-DJI-Mavic-Air-2.png'

function ProductHero() {
  const { bannerData, isHydrated } = useBannerProducts()
  const heroRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // ── IntersectionObserver: Pause animation cycles when off-screen ──
  useEffect(() => {
    const el = heroRef.current
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

  // Slide 0: General Cover, Slides 1..N: Category Showcases
  const totalSlides = 1 + bannerData.length
  const productsPerSlide = [1, ...bannerData.map((d) => d.products.length)]

  const {
    slideIndex,
    imageIndex,
    isSlideTransitioning,
    isImageTransitioning,
    goToSlide,
  } = useBannerCycle({
    totalSlides,
    productsPerSlide,
    majorInterval: 4800,
    paused: !isVisible || isHovered || !isHydrated || bannerData.length === 0,
  })

  const isGeneralSlide = slideIndex === 0
  const activeCategoryData = !isGeneralSlide ? bannerData[slideIndex - 1] : null
  const activeCategory = activeCategoryData?.category
  const activeProducts = activeCategoryData?.products || []
  const activeProduct = activeProducts[imageIndex] || activeProducts[0]

  const currentProductImage =
    activeProduct?.firstImage || activeCategory?.coverImage || ''
  const currentProductName = activeProduct?.name || activeCategory?.title || ''

  return (
    <Box
      ref={heroRef}
      component="section"
      aria-label="Portada y categorías destacadas"
      id="product-hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        color: '#ffffff',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        overflow: 'hidden',
        minHeight: { xs: 560, sm: 520, md: 560 },
        height: { sm: '80vh' },
        maxHeight: { sm: 1300 },
      }}
    >
      {/* ── Background 1: General Hero Image (Mavic Air 2) ── */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("${MavicAir}")`,
          backgroundColor: '#0f172a',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: isGeneralSlide ? 1 : 0,
          transform: isGeneralSlide ? 'scale(1)' : 'scale(1.04)',
          transition: 'opacity 0.7s ease-in-out, transform 0.8s ease-in-out',
          zIndex: -3,
        }}
      />

      {/* ── Background 2: Dynamic Category Gradient ── */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #090e17 0%, #0f172a 45%, #131d31 100%)',
          opacity: isGeneralSlide ? 0 : 1,
          transition: 'opacity 0.7s ease-in-out',
          zIndex: -3,
        }}
      />

      {/* Ambient glows for Category mode */}
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 440,
          height: 440,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 172, 228, 0.16) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          opacity: isGeneralSlide ? 0 : 1,
          transition: 'opacity 0.7s ease-in-out',
          zIndex: -2,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -60,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 172, 228, 0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          opacity: isGeneralSlide ? 0 : 1,
          transition: 'opacity 0.7s ease-in-out',
          zIndex: -2,
        }}
      />

      {/* Backdrop darkening overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          opacity: isGeneralSlide ? 0.45 : 0.25,
          transition: 'opacity 0.7s ease-in-out',
          zIndex: -2,
        }}
      />

      {/* Preload network priority image */}
      <Image
        style={{ display: 'none' }}
        src={MavicAir}
        alt="increase priority"
        width={1300}
        height={650}
        priority
      />

      {/* ── Slide 0: General Hero Content ── */}
      {isGeneralSlide && (
        <Container
          maxWidth="md"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            opacity: isSlideTransitioning ? 0 : 1,
            transform: isSlideTransitioning ? 'translateY(14px)' : 'translateY(0)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            zIndex: 2,
            mt: { xs: 2, sm: 3 },
            mb: { xs: 7, sm: 8 },
          }}
        >
          {/* MAVIC AIR 2 Watermark logo */}
          <Image
            src={productHeroWonder}
            alt="maravilloso"
            width={147}
            height={80}
            priority
          />

          {/* Badge Chip */}
          <Chip
            icon={
              <FlightTakeoffIcon
                sx={{
                  fontSize: '15px !important',
                  color: 'rgba(255,255,255,0.9) !important',
                }}
              />
            }
            label="TIENDA OFICIAL DE TECNOLOGÍA AÉREA"
            size="small"
            sx={{
              mb: 2.5,
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(8px)',
              px: 1,
            }}
          />

          {/* Title */}
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: { xs: '1.95rem', sm: '2.75rem', md: '3.25rem' },
              letterSpacing: '-0.02em',
              textTransform: 'none',
              mb: 1,
              textShadow: '0 2px 16px rgba(0,0,0,0.3)',
            }}
          >
            Encuentra tu Dron
          </Typography>

          {/* Accent bar */}
          <Box
            sx={{
              width: 60,
              height: 4,
              backgroundColor: '#00aCe4',
              borderRadius: 2,
              margin: '0 auto 20px',
            }}
          />

          {/* Subtitle */}
          <Typography
            variant="h5"
            component="p"
            align="center"
            sx={{
              color: 'rgba(255, 255, 255, 0.88)',
              fontWeight: 400,
              fontSize: { xs: '0.92rem', sm: '1.08rem', md: '1.2rem' },
              lineHeight: 1.7,
              maxWidth: 560,
              mx: 'auto',
              mb: { xs: 3, sm: 4 },
              textShadow: '0 1px 8px rgba(0,0,0,0.25)',
            }}
          >
            Tienda de drones, equipos FPV y tecnología VToL.
            <br />
            Todo lo que necesitas para tus proyectos.
          </Typography>

          {/* CTA Button */}
          <Button
            component={Link}
            href="/tienda/"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              minWidth: 220,
              py: 1.5,
              px: 4,
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              bgcolor: '#00aCe4',
              color: '#ffffff',
              boxShadow: '0 4px 20px rgba(0, 172, 228, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#0090c0',
                boxShadow: '0 6px 28px rgba(0, 172, 228, 0.5)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Ver Equipos
          </Button>

          {/* Tagline */}
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.82rem',
              fontWeight: 500,
              letterSpacing: '0.04em',
              mt: 3,
            }}
          >
            Tecnología aérea, drones y accesorios
          </Typography>
        </Container>
      )}

      {/* ── Slides 1..N: Category Showcase (2 Columns) ── */}
      {!isGeneralSlide && activeCategory && (
        <Container
          maxWidth="lg"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
            gap: { xs: 3, md: 5 },
            alignItems: 'center',
            zIndex: 2,
            mb: { xs: 7, sm: 8 },
            py: { xs: 2, md: 0 },
          }}
        >
          {/* Column 1: Category Details */}
          <BannerTextColumn
            title={activeCategory.title}
            description={activeCategory.description}
            href={activeCategory.href}
            iconName={activeCategory.iconName}
            isTransitioning={isSlideTransitioning}
            totalCategories={bannerData.length}
            activeIndex={slideIndex - 1}
          />

          {/* Column 2: Product Image Gallery */}
          <BannerImageColumn
            imageUrl={currentProductImage}
            productName={currentProductName}
            isTransitioning={isImageTransitioning}
          />
        </Container>
      )}

      {/* ── Slide Navigation Dots ── */}
      {totalSlides > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 16, sm: 20 },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            zIndex: 4,
            bgcolor: 'rgba(15, 23, 42, 0.75)',
            px: 1.75,
            py: 0.8,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)',
          }}
        >
          {Array.from({ length: totalSlides }).map((_, idx) => {
            const isActive = idx === slideIndex
            const label =
              idx === 0
                ? 'Portada Principal'
                : `Ver ${bannerData[idx - 1]?.category.title}`
            return (
              <Box
                key={idx}
                component="button"
                type="button"
                aria-label={label}
                onClick={() => goToSlide(idx)}
                sx={{
                  border: 'none',
                  p: 0,
                  cursor: 'pointer',
                  width: isActive ? 22 : 7,
                  height: 7,
                  borderRadius: 3.5,
                  bgcolor: isActive ? '#00aCe4' : 'rgba(255, 255, 255, 0.3)',
                  boxShadow: isActive ? '0 0 10px rgba(0, 172, 228, 0.7)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: isActive ? '#00aCe4' : 'rgba(255, 255, 255, 0.65)',
                  },
                }}
              />
            )
          })}
        </Box>
      )}

      {/* Arrow Down Indicator on General Slide */}
      {isGeneralSlide && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 44, sm: 52 },
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            opacity: 0.75,
            pointerEvents: 'none',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Image
            src={productHeroArrowDown}
            alt="Desliza para ver más"
            width={15}
            height={21}
          />
        </Box>
      )}
    </Box>
  )
}

ProductHero.propTypes = {}

export default withRoot(ProductHero)
