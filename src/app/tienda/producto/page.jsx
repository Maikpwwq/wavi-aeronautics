import ProductDetail from '@/app/tienda/components/ProductDetail'
import React, { Suspense } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

function PostPage () {
  return (
    <Suspense
      fallback={
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        }
      >
      <ProductDetail />
    </Suspense>
  )
}

export default PostPage
