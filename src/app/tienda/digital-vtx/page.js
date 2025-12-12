'use client'
import React, { Suspense, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withRoot from '@/modules/withRoot'
import { fetchDigitalVTXProducts } from '@/store/states/shop'

import ProductCard from '@/app/tienda/components/ProductCard'
import ProductSkeleton from '@/app/tienda/components/ProductSkeleton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@/modules/components/Typography'
import FiltroProducto from '@/app/tienda/components/FiltroProducto'

const styles = (theme) => ({
  presentationProducts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`,
    padding: `${theme.spacing(0)} ${theme.spacing(2)} !important`,
    paddingLeft: `${theme.spacing(6)} !important`,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: `${theme.spacing(2)} !important`
    }
  },
  spacingTexts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`
  },
  endingTexts: {
    marginBottom: `${theme.spacing(2)} !important`
  },
  productShowcase: {
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  }
})

export const DigitalVTX = () => {
  const dispatch = useDispatch()
  const shopState = useSelector((store) => store?.shop)
  const digitalVTX = shopState?.digitalVTX || []
  const loadedCategories = shopState?.loadedCategories || []

  
  const theme = useTheme()
  const classes = styles(theme)

  // Lazy load digital VTX products when component mounts
  useEffect(() => {
    if (!loadedCategories.includes('digitalVTX')) {
      dispatch(fetchDigitalVTXProducts())
    }
  }, [dispatch, loadedCategories])

  const showSkeleton = !loadedCategories.includes('digitalVTX') && digitalVTX.length === 0

  return (
    <>
      <Box sx={classes.productShowcase}>
        <FiltroProducto />
        <Box sx={classes.presentationProducts}>
          <Typography variant="h5" sx={classes.spacingTexts}>
            Video transmisión digital HD - VTX.
          </Typography>
          <Typography variant="body1" sx={classes.endingTexts}>
            Módulos de soporte para video transmisor digital HD - VTX.
          </Typography>
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : digitalVTX.length > 0 ? (
              <Grid container spacing={2}>
                {digitalVTX.map((product, k) => (
                  <Grid item key={product.productID || k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                    <ProductCard
                      category="digitalVTX"
                      className="d-flex mb-2"
                      products={product}
                      productID={k}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" sx={{ m: 2 }}>
                No hay productos disponibles en esta categoría.
              </Typography>
            )}
          </Suspense>
        </Box>
      </Box>
    </>
  )
}

export default withRoot(DigitalVTX)

