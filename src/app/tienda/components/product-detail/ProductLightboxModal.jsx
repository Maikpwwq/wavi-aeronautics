'use client'

import React, { useEffect, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import { motion, AnimatePresence } from 'framer-motion'
import { BRAND_COLORS } from '@/app/tienda/innerTheme'

/**
 * Fullscreen Interactive Lightbox Modal
 * Includes keyboard navigation (Escape, ArrowLeft, ArrowRight), side chevrons,
 * cursor-driven zoom toggle, and bottom thumbnail strip.
 */
export const ProductLightboxModal = ({
  open = false,
  images = [],
  activeImage = 0,
  onClose,
  onSelectImage,
  productName = 'Producto'
}) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 })

  const handlePrev = useCallback(() => {
    setIsZoomed(false)
    if (images.length === 0) return
    const prev = activeImage > 0 ? activeImage - 1 : images.length - 1
    onSelectImage?.(prev)
  }, [activeImage, images.length, onSelectImage])

  const handleNext = useCallback(() => {
    setIsZoomed(false)
    if (images.length === 0) return
    const next = activeImage < images.length - 1 ? activeImage + 1 : 0
    onSelectImage?.(next)
  }, [activeImage, images.length, onSelectImage])

  // Keyboard navigation & Escape key handler
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    // Prevent body scrolling while modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose, handlePrev, handleNext])

  // Reset zoom on image switch or modal close
  useEffect(() => {
    setIsZoomed(false)
  }, [activeImage, open])

  const handleMouseMove = (e) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setZoomCoords({ x, y })
  }

  if (!open || images.length === 0) return null

  return (
    <AnimatePresence>
      <Box
        role="dialog"
        aria-modal="true"
        aria-label="Vista completa de imagen"
        data-testid="product-lightbox-modal"
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 1400,
          bgcolor: 'rgba(0, 0, 0, 0.94)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: { xs: 1.5, sm: 3 }
        }}
      >
        {/* Top Bar: Title, Counter & Action Controls */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
            pt: 1,
            px: { xs: 1, sm: 2 }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#ffffff',
                fontWeight: 800,
                fontSize: { xs: '0.85rem', sm: '1rem' },
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                px: 2,
                py: 0.5,
                borderRadius: 2
              }}
              data-testid="lightbox-counter"
            >
              {activeImage + 1} / {images.length}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 600,
                display: { xs: 'none', md: 'block' },
                maxWidth: '400px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {productName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Zoom toggle button */}
            <IconButton
              onClick={() => setIsZoomed(!isZoomed)}
              aria-label={isZoomed ? 'Reducir zoom' : 'Aumentar zoom'}
              data-testid="lightbox-zoom-btn"
              sx={{
                color: '#ffffff',
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' }
              }}
            >
              {isZoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
            </IconButton>

            {/* Close button */}
            <IconButton
              onClick={onClose}
              aria-label="Cerrar vista completa"
              data-testid="lightbox-close-btn"
              sx={{
                color: '#ffffff',
                bgcolor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.8)' }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Center Display: Main High-Res Image & Side Nav Chevrons */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            my: 2
          }}
        >
          {/* Previous Button */}
          {images.length > 1 && (
            <IconButton
              onClick={handlePrev}
              aria-label="Imagen anterior"
              data-testid="lightbox-prev-btn"
              sx={{
                position: 'absolute',
                left: { xs: 8, sm: 24 },
                zIndex: 20,
                color: '#ffffff',
                bgcolor: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                width: { xs: 44, sm: 54 },
                height: { xs: 44, sm: 54 },
                '&:hover': {
                  bgcolor: BRAND_COLORS.accent || '#00aCe4',
                  borderColor: '#00aCe4'
                }
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />
            </IconButton>
          )}

          {/* Active Image Container */}
          <Box
            onClick={() => setIsZoomed(!isZoomed)}
            onMouseMove={handleMouseMove}
            data-testid="lightbox-image-container"
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isZoomed ? 'zoom-out' : 'zoom-in',
              overflow: 'hidden'
            }}
          >
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={images[activeImage]}
              alt={`${productName} - Vista completa`}
              style={{
                maxWidth: '90vw',
                maxHeight: '72vh',
                objectFit: 'contain',
                transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                transition: isZoomed ? 'transform 0.1s ease-out' : 'transform 0.25s ease-out',
                userSelect: 'none'
              }}
            />
          </Box>

          {/* Next Button */}
          {images.length > 1 && (
            <IconButton
              onClick={handleNext}
              aria-label="Siguiente imagen"
              data-testid="lightbox-next-btn"
              sx={{
                position: 'absolute',
                right: { xs: 8, sm: 24 },
                zIndex: 20,
                color: '#ffffff',
                bgcolor: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                width: { xs: 44, sm: 54 },
                height: { xs: 44, sm: 54 },
                '&:hover': {
                  bgcolor: BRAND_COLORS.accent || '#00aCe4',
                  borderColor: '#00aCe4'
                }
              }}
            >
              <ChevronRightIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />
            </IconButton>
          )}
        </Box>

        {/* Bottom Thumbnail Strip */}
        {images.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              overflowX: 'auto',
              maxWidth: '90vw',
              p: 1,
              zIndex: 10,
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' }
            }}
          >
            {images.map((img, idx) => {
              const isSelected = activeImage === idx
              return (
                <Box
                  key={idx}
                  onClick={() => {
                    setIsZoomed(false)
                    onSelectImage?.(idx)
                  }}
                  data-testid={`lightbox-thumb-${idx}`}
                  sx={{
                    position: 'relative',
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    bgcolor: '#ffffff',
                    flexShrink: 0,
                    border: isSelected
                      ? `2.5px solid ${BRAND_COLORS.accent || '#00aCe4'}`
                      : '1.5px solid rgba(255, 255, 255, 0.3)',
                    opacity: isSelected ? 1 : 0.6,
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    '&:hover': { opacity: 1 }
                  }}
                >
                  <Image
                    src={img}
                    alt=""
                    width={56}
                    height={56}
                    unoptimized
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px' }}
                  />
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
    </AnimatePresence>
  )
}

ProductLightboxModal.propTypes = {
  open: PropTypes.bool.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeImage: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  productName: PropTypes.string
}

export default ProductLightboxModal
