'use client'
import React, { Suspense, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '@/app/tienda/components/ProductCard'
import ProductSkeleton from '@/app/tienda/components/ProductSkeleton'
import { fetchTransmisorsProducts } from '@/store/states/shop'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@/modules/components/Typography'
import FiltroProducto from '@/app/tienda/components/FiltroProducto'
import withRoot from '@/modules/withRoot'
import { useTheme } from '@mui/material/styles'

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

const TrasmisorReceptor = () => {
  const dispatch = useDispatch()
  const shopState = useSelector((store) => store?.shop)
  const transmisors = shopState?.transmisors || []
  const receptors = shopState?.receptors || []
  const loadedCategories = shopState?.loadedCategories || []
  const isLoading = shopState?.loading ?? false

  const theme = useTheme()
  const classes = styles(theme)

  // Lazy load transmisors/receptors when component mounts
  useEffect(() => {
    if (!loadedCategories.includes('transmisors')) {
      dispatch(fetchTransmisorsProducts())
    }
  }, [dispatch, loadedCategories])

  const showSkeleton = isLoading || (transmisors.length === 0 && receptors.length === 0 && !loadedCategories.includes('transmisors'))

  return (
    <>
      <Box sx={classes.productShowcase}>
        <FiltroProducto />
        <Box sx={classes.presentationProducts}>
          {/* Seccion de Transmisoras */}
          <Typography variant="h5" sx={classes.spacingTexts}>
            Transmisores para drone.
          </Typography>
          <Typography variant="body1" sx={classes.endingTexts}>
            Transmisores para cada necesidad en potencia y distacia de vuelo.
          </Typography>
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : transmisors.length > 0 ? (
              <Grid container spacing={2}>
                {transmisors.map((product, k) => (
                  <Grid item key={product.productID || k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                    <ProductCard
                      category="transmisors"
                      className="d-flex mb-2"
                      products={product}
                      productID={k}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" sx={{ m: 2 }}>
                No hay transmisores disponibles.
              </Typography>
            )}
          </Suspense>

          {/* Seccion de Receptoras */}
          <Typography variant="h5" sx={classes.spacingTexts}>
            Receptor para drone.
          </Typography>
          <Typography variant="body1" sx={classes.endingTexts}>
            Receptor para cada necesidad en potencia y distacia de vuelo.
          </Typography>
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : receptors.length > 0 ? (
              <Grid container spacing={2}>
                {receptors.map((product, k) => (
                  <Grid item key={product.productID || k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                    <ProductCard
                      category="receptors"
                      className="d-flex mb-2"
                      products={product}
                      productID={k}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" sx={{ m: 2 }}>
                No hay receptores disponibles.
              </Typography>
            )}
          </Suspense>
        </Box>
      </Box>
    </>
  )
}

export default withRoot(TrasmisorReceptor)

