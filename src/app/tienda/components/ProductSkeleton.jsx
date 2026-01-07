'use client'
import React from 'react'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'

const styles = {
  card: {
    height: '100%',
    minWidth: 358
  },
  image: {
    height: 330,
    width: '100%'
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
    <Grid container spacing={2} sx={{ justifyContent: 'flex-start', width: '100%' }}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
          <Card sx={styles.card}>
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
        </Grid>
      ))}
    </Grid>
  )
}

export default ProductSkeleton
