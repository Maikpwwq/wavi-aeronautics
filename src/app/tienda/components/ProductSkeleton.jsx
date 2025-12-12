'use client'
import React from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'

const styles = {
  card: {
    height: '100%',
    minHeight: 420
  },
  image: {
    height: 330
  },
  content: {
    padding: '16px'
  }
}

/**
 * Skeleton loader for product cards
 * Shows animated placeholder while products are loading
 */
const ProductSkeleton = ({ count = 4 }) => {
  return (
    <Box 
      sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 2,
        width: '100%'
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={styles.card}>
          {/* Image skeleton */}
          <Skeleton 
            variant="rectangular" 
            sx={styles.image}
            animation="wave"
          />
          {/* Content skeleton */}
          <Box sx={styles.content}>
            {/* Title skeleton */}
            <Skeleton 
              variant="text" 
              sx={{ fontSize: '1.25rem', mb: 1 }}
              animation="wave"
            />
            {/* Subtitle skeleton */}
            <Skeleton 
              variant="text" 
              sx={{ fontSize: '0.875rem', width: '60%' }}
              animation="wave"
            />
            {/* Price skeleton */}
            <Skeleton 
              variant="text" 
              sx={{ fontSize: '1rem', width: '40%', mt: 1 }}
              animation="wave"
            />
          </Box>
        </Card>
      ))}
    </Box>
  )
}

export default ProductSkeleton
