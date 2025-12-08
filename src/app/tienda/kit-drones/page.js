'use client'
import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withRoot from '@/modules/withRoot'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@/modules/components/Typography'

import ProductCard from '@/app/tienda/components/ProductCard'
import CircularProgress from '@mui/material/CircularProgress'
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

const DroneProducts = () => {
  const shopState = useSelector((store) => store?.shop)
  // Ensure dronesKit is always an array
  const dronesKit = shopState?.dronesKit || []

  const theme = useTheme()
  const classes = styles(theme)

  return (
    <>
      <Box sx={classes.productShowcase}>
        <FiltroProducto />
        <Box sx={classes.presentationProducts}>
          <Typography variant='h5' sx={classes.spacingTexts}>
            Kits de Dron FPV:
          </Typography>
          <>
            <Typography variant='body1' sx={classes.endingTexts}>
              Descubre los mejores kits de Dron FPV listos para vuelo.
            </Typography>
            <Suspense
              fallback={
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
              }
            >
              <Grid
                container
                spacing={2}
                sx={{ justifyContent: 'space-around' }}
              >
                {dronesKit.length > 0 ? (
                  dronesKit.map((product, k) => (
                    <Grid item key={k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                      <ProductCard
                        sx='d-flex mb-2'
                        category='dronesKits'
                        products={product}
                        productID={k}
                      />
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ m: 2 }}>
                    Cargando productos...
                  </Typography>
                )}
              </Grid>
            </Suspense>
            <br />
            <br />
          </>
        </Box>
      </Box>
    </>
  )
}

export default withRoot(DroneProducts)
