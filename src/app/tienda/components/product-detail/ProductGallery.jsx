'use client'

import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import { motion } from 'framer-motion'
import { BRAND_COLORS } from '@/app/tienda/innerTheme'
import GalleryThumbnails from './GalleryThumbnails'
import ProductLightboxModal from './ProductLightboxModal'

/**
 * ProductGallery Component
 * Implements Amazon-style left-aligned vertical thumbnails on desktop,
 * interactive hover zoom magnifying engine, and fullscreen lightbox modal.
 */
export const ProductGallery = ({
  images = [],
  productName = 'Producto',
  videoUrl = null
}) => {
  const [activeImage, setActiveImage] = useState(0)
  const [isVideoActive, setIsVideoActive] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isHoverZooming, setIsHoverZooming] = useState(false)
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 })

  const validImages = useMemo(() => {
    if (!images || images.length === 0) return ['/placeholder.png']
    return images.map(img => typeof img === 'string' ? img : img.url || '')
  }, [images])

  const handleMouseMove = (e) => {
    if (isVideoActive) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setZoomCoords({ x, y })
  }

  const handleSelectImage = (index) => {
    setIsVideoActive(false)
    setActiveImage(index)
  }

  const handleSelectVideo = () => {
    setIsVideoActive(true)
  }

  const handleOpenLightbox = () => {
    if (!isVideoActive) {
      setIsLightboxOpen(true)
    }
  }

  // Embed URL helper for YouTube/Vimeo
  const embedVideoUrl = useMemo(() => {
    if (!videoUrl) return ''
    if (videoUrl.includes('youtube.com/watch')) {
      return videoUrl.replace('watch?v=', 'embed/')
    }
    if (videoUrl.includes('youtu.be')) {
      const id = videoUrl.split('/').pop()
      return `https://www.youtube.com/embed/${id}`
    }
    return videoUrl
  }, [videoUrl])

  return (
    <Box data-testid="product-gallery" sx={{ width: '100%' }}>
      {/* 2-Column Responsive Layout: Thumbnails (Left on lg) + Main Display (Right on lg) */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', lg: 'row' },
          gap: { xs: 2, lg: 2.5 },
          alignItems: { xs: 'center', lg: 'flex-start' },
          width: '100%'
        }}
      >
        {/* Left Column on Desktop: Vertical Thumbnails Strip */}
        <Box sx={{ flexShrink: 0 }}>
          <GalleryThumbnails
            images={validImages}
            activeImage={activeImage}
            onSelectImage={handleSelectImage}
            videoUrl={videoUrl}
            onSelectVideo={handleSelectVideo}
            isVideoActive={isVideoActive}
            maxVisible={6}
          />
        </Box>

        {/* Right Column on Desktop: Main Display Container */}
        <Box sx={{ flex: 1, width: '100%', minWidth: 0 }}>
          <Paper
            elevation={0}
            data-testid="main-image-paper"
            sx={{
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              bgcolor: '#ffffff',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
              aspectRatio: '1/1',
              maxHeight: { xs: '450px', sm: '520px', lg: '560px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isVideoActive ? 'default' : 'zoom-in',
              border: `1px solid ${BRAND_COLORS.border.light || '#f0f0f0'}`
            }}
            onClick={handleOpenLightbox}
            onMouseEnter={() => !isVideoActive && setIsHoverZooming(true)}
            onMouseLeave={() => setIsHoverZooming(false)}
            onMouseMove={handleMouseMove}
          >
            {isVideoActive ? (
              <Box sx={{ width: '100%', height: '100%', bgcolor: '#000000' }}>
                <iframe
                  src={embedVideoUrl}
                  title={`${productName} - Video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 0
                }}
              >
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={validImages[activeImage]}
                  alt={productName}
                  data-testid="main-product-image"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                    transform: isHoverZooming ? 'scale(2.0)' : 'scale(1)',
                    transition: isHoverZooming ? 'transform 0.08s ease-out' : 'transform 0.25s ease-out',
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.08))'
                  }}
                />
              </Box>
            )}
          </Paper>

          {/* Centered Helper Callout Banner directly beneath the main image */}
          <Box
            onClick={handleOpenLightbox}
            data-testid="lightbox-helper-banner"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.75,
              mt: 1.5,
              cursor: 'pointer',
              py: 0.5,
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 172, 228, 0.06)',
                '& .helper-text': {
                  color: '#00aCe4',
                  textDecoration: 'underline'
                }
              }
            }}
          >
            <ZoomInIcon sx={{ fontSize: 18, color: '#00aCe4' }} />
            <Typography
              className="helper-text"
              variant="caption"
              sx={{
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.85rem',
                letterSpacing: 0.2,
                transition: 'color 0.2s ease'
              }}
            >
              Haz clic para una vista completa
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Fullscreen Interactive Lightbox Modal */}
      <ProductLightboxModal
        open={isLightboxOpen}
        images={validImages}
        activeImage={activeImage}
        onClose={() => setIsLightboxOpen(false)}
        onSelectImage={setActiveImage}
        productName={productName}
      />
    </Box>
  )
}

ProductGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  productName: PropTypes.string,
  videoUrl: PropTypes.string
}

export default ProductGallery
