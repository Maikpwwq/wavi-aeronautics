'use client'

import React, { Suspense, useMemo } from 'react'
import { useSelector } from 'react-redux'
import withRoot from '@/modules/withRoot'
import theme from '@/app/tienda/innerTheme'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import ProductItem from '@/app/tienda/components/ProductItem'
import ProductSkeleton from '@/app/tienda/components/ProductSkeleton'

const styles = (theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#eaeff1',
    overflow: 'hidden',
    width: 'auto',
    mx: -2,
    py: { xs: 4, sm: 6 }
  },
  container: {
    padding: `${theme.spacing(0)} ${theme.spacing(0)} !important`,
    margin: '0 auto',
    maxWidth: '100% !important',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%'
  },
  carouselTrack: {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: { xs: 2, sm: 2.5 },
    py: { xs: 2, sm: 2.5 },
    px: { xs: 2, sm: 4 },
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  item: {
    width: { xs: 290, sm: 310 },
    minWidth: { xs: 290, sm: 310 },
    maxWidth: { xs: 290, sm: 310 },
    flexShrink: 0,
    scrollSnapAlign: 'start',
    display: 'flex',
    flexDirection: 'column'
  }
})

function ProductosDestacados () {
  const classes = styles(theme)
  const shopState = useSelector((store) => store?.shop)
  const dronesRC = shopState?.dronesRC || []

  // Fallback to session storage if Redux is hydrating
  const featuredProducts = useMemo(() => {
    let list = [...dronesRC]
    if (list.length === 0 && typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('Productos_DronesRC')
        if (stored) list = JSON.parse(stored)
      } catch (e) {
        console.error(e)
      }
    }
    return list
  }, [dronesRC])

  return (
    <Box sx={classes.root} component="section" aria-label="Productos destacados"> 
      <Container sx={classes.container}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#0f172a',
            fontSize: { xs: '1.75rem', sm: '2.25rem' },
            letterSpacing: '0.02em',
            mb: 1
          }}
        >
          Productos Destacados
        </Typography>

        {/* Accent Bar */}
        <Box
          sx={{
            width: 44,
            height: 3.5,
            bgcolor: '#00aCe4',
            borderRadius: 2,
            mb: 2
          }}
        />

        <Typography
          variant="body1"
          sx={{
            color: '#475569',
            fontSize: { xs: '0.92rem', sm: '1.02rem' },
            mb: 3,
            px: 2,
            maxWidth: 700
          }}
        >
          Lleva tu Dron, destacamos los mejores kits de FPV listos para vuelo.
        </Typography>

        <Box sx={{ width: '100%', overflow: 'hidden' }}>
          {featuredProducts && featuredProducts.length > 0 ? (
            <Suspense fallback={<ProductSkeleton count={4} />}>
              <Box sx={classes.carouselTrack} data-testid="featured-products-track">
                {featuredProducts.map((product, k) => (
                  <Box
                    key={`${product.productID || product.id || k}-${k}`}
                    sx={classes.item}
                    data-testid="featured-product-card"
                  >
                    <ProductItem
                      category="drones"
                      products={product}
                      productID={k}
                    />
                  </Box>
                ))}
              </Box>
            </Suspense>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={36} sx={{ color: '#00aCe4' }} />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default withRoot(ProductosDestacados)
