/**
 * BannerImageColumn — Right column of the dynamic category banner.
 *
 * Displays a product image with crossfade transitions.
 * Uses opacity + scale transitions controlled by the parent's
 * `isTransitioning` flag from useBannerCycle.
 *
 * The image uses `object-fit: contain` to display products cleanly
 * against the dark banner background without cropping.
 */
'use client'

import React from 'react'
import Box from '@mui/material/Box'

/**
 * @param {object} props
 * @param {string} props.imageUrl - Product image URL
 * @param {string} props.productName - Alt text for the image
 * @param {boolean} props.isTransitioning - Controls crossfade animation
 */
export default function BannerImageColumn({
  imageUrl,
  productName,
  isTransitioning,
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 220, sm: 280, md: '100%' },
        minHeight: { md: 380 },
        overflow: 'hidden',
        borderRadius: { xs: 3, md: 0 },
        mx: { xs: 2, md: 0 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Product image with crossfade */}
      <Box
        component="img"
        src={imageUrl}
        alt={productName}
        loading="lazy"
        sx={{
          width: '85%',
          height: '85%',
          maxWidth: 420,
          objectFit: 'contain',
          objectPosition: 'center',
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'scale(0.92)' : 'scale(1)',
          transition: 'opacity 0.25s ease, transform 0.3s ease',
          filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4))',
        }}
      />

      {/* Subtle gradient overlay for left-edge blend with text column */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: {
            xs: 'linear-gradient(to top, rgba(15, 23, 42, 0.5) 0%, transparent 35%)',
            md: 'linear-gradient(to right, rgba(15, 23, 42, 0.25) 0%, transparent 20%)',
          },
          pointerEvents: 'none',
        }}
      />
    </Box>
  )
}
