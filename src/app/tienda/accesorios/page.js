'use client'
import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withRoot from '@/modules/withRoot'

import ProductCard from '@/app/tienda/components/ProductCard'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
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

const Accesorios = () => {
  const shopState = useSelector((store) => store?.shop)
  // Ensure baterias is always an array
  const baterias = shopState?.baterias || []
  
  const theme = useTheme()
  const classes = styles(theme)

  return (
    <>
      <Box sx={classes.productShowcase}>
        <FiltroProducto />
        <Box sx={classes.presentationProducts}>
          <Typography variant="h5" sx={classes.spacingTexts}>
            Baterias para drone.
          </Typography>
          <Suspense
            fallback={
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            }
          >
            <Typography variant="body1" sx={classes.endingTexts}>
              Baterias para cada necesidad en potencia y tiempo de vuelo.
            </Typography>
            <Grid container spacing={2}>
              {baterias.length > 0 ? (
                baterias.map((product, k) => (
                  <Grid
                    item
                    key={k}
                    size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}
                  >
                    <ProductCard
                      className="d-flex mb-2"
                      products={product}
                      category="baterias"
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
        </Box>
      </Box>
    </>
  )
}

export default withRoot(Accesorios)
