'use client'

import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { BRAND_COLORS } from '@/app/tienda/innerTheme'

/**
 * GalleryThumbnails Component
 * Renders vertical thumbnails on desktop (Amazon PDP style) and horizontal on mobile.
 * Supports active highlight ring, video badge, and +N counter.
 */
export const GalleryThumbnails = ({
  images = [],
  activeImage = 0,
  onSelectImage,
  videoUrl = null,
  onSelectVideo = null,
  isVideoActive = false,
  maxVisible = 6
}) => {
  if (!images || images.length === 0) return null

  const hasExtraImages = images.length > maxVisible
  const visibleImages = hasExtraImages ? images.slice(0, maxVisible) : images
  const remainingCount = images.length - maxVisible

  return (
    <Box
      data-testid="gallery-thumbnails"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', lg: 'column' },
        gap: 1.5,
        width: { xs: '100%', lg: '76px' },
        maxHeight: { xs: 'auto', lg: '560px' },
        overflowX: { xs: 'auto', lg: 'hidden' },
        overflowY: { xs: 'hidden', lg: 'auto' },
        py: { xs: 1, lg: 0.5 },
        px: { xs: 0.5, lg: 0.5 },
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: 4,
          height: 4
        },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'rgba(0,0,0,0.15)',
          borderRadius: 2
        }
      }}
    >
      {visibleImages.map((img, idx) => {
        const isActive = !isVideoActive && activeImage === idx
        const isLastAndExtra = hasExtraImages && idx === maxVisible - 1

        return (
          <Box
            key={idx}
            onClick={() => onSelectImage?.(idx)}
            data-testid={`gallery-thumbnail-${idx}`}
            aria-label={`Ver imagen ${idx + 1}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelectImage?.(idx)
              }
            }}
            sx={{
              position: 'relative',
              width: { xs: 64, sm: 70, lg: 68 },
              height: { xs: 64, sm: 70, lg: 68 },
              borderRadius: 2.5,
              cursor: 'pointer',
              overflow: 'hidden',
              bgcolor: '#ffffff',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isActive
                ? `2.5px solid ${BRAND_COLORS.accent || '#00aCe4'}`
                : '1.5px solid #e2e8f0',
              boxShadow: isActive
                ? '0 0 0 2px rgba(0, 172, 228, 0.35)'
                : 'none',
              transform: isActive ? 'scale(1.04)' : 'scale(1)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderColor: '#00aCe4',
                opacity: 1,
                transform: 'scale(1.04)'
              }
            }}
          >
            <Image
              src={img}
              alt=""
              width={68}
              height={68}
              unoptimized
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '4px'
              }}
            />

            {/* +N Overlay on the last thumbnail when extra images exist */}
            {isLastAndExtra && remainingCount > 0 && (
              <Box
                data-testid="thumbnail-extra-count"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(0, 0, 0, 0.68)',
                  backdropFilter: 'blur(2px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}
              >
                +{remainingCount}
              </Box>
            )}
          </Box>
        )
      })}

      {/* Video Thumbnail (if product has a video) */}
      {videoUrl && (
        <Box
          onClick={() => onSelectVideo ? onSelectVideo() : onSelectImage?.(0)}
          data-testid="gallery-thumbnail-video"
          aria-label="Ver video del producto"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelectVideo ? onSelectVideo() : onSelectImage?.(0)
            }
          }}
          sx={{
            position: 'relative',
            width: { xs: 64, sm: 70, lg: 68 },
            height: { xs: 64, sm: 70, lg: 68 },
            borderRadius: 2.5,
            cursor: 'pointer',
            overflow: 'hidden',
            bgcolor: isVideoActive ? 'rgba(0, 172, 228, 0.1)' : '#f8fafc',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: isVideoActive
              ? `2.5px solid ${BRAND_COLORS.accent || '#00aCe4'}`
              : '1.5px solid #e2e8f0',
            boxShadow: isVideoActive
              ? '0 0 0 2px rgba(0, 172, 228, 0.35)'
              : 'none',
            transform: isVideoActive ? 'scale(1.04)' : 'scale(1)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: '#00aCe4',
              transform: 'scale(1.04)'
            }
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              mb: 0.25
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 800,
              color: '#475569',
              letterSpacing: 0.5
            }}
          >
            VIDEO
          </Typography>
        </Box>
      )}
    </Box>
  )
}

GalleryThumbnails.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeImage: PropTypes.number,
  onSelectImage: PropTypes.func.isRequired,
  videoUrl: PropTypes.string,
  onSelectVideo: PropTypes.func,
  isVideoActive: PropTypes.bool,
  maxVisible: PropTypes.number
}

export default GalleryThumbnails
