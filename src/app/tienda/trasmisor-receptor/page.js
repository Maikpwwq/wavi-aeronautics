'use client'
import React, { Suspense, useState } from 'react'
import { useSelector, connect } from 'react-redux'
import ProductCard from '@/app/tienda/components/ProductCard'

// import "sessionstorage-polyfill";
// import "localstorage-polyfill";
// global.sessionstorage;
// global.localStorage;

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@/modules/components/Typography'
import FiltroProducto from '@/app/tienda/components/FiltroProducto'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'

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

const TrasmisorReceptor = (props) => {
  // const { classes } = props;
  const shopState = useSelector((store) => store?.shop)
  const { transmisors, receptors } = shopState

  const classes = styles(theme)
  const [storeProductsTransmisor] = useState(transmisors)
  const [storeProductsReceptor] = useState(receptors) 
  console.log('TrasmisorReceptor', storeProductsTransmisor, storeProductsReceptor)

  return (
    <>
    {/* {!!storeProductsTransmisor && storeProductsTransmisor.length > 0 && ()}
    {!!storeProductsReceptor && storeProductsReceptor.length > 0 && ()} */}
    <Box sx={classes.productShowcase}>
        <FiltroProducto />
      <Box sx={classes.presentationProducts}>
        {/* Seccion de Transmisoras */}
        <Typography variant="h5" sx={classes.spacingTexts}>
          Transmisores para drone.
        </Typography>        
          <Suspense
            fallback={
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            }
          >
            <Typography variant="body1" sx={classes.endingTexts}>
              Transmisores para cada necesidad en potencia y distacia de vuelo.
            </Typography>
            <Grid container spacing={2}>
              {!!storeProductsTransmisor && storeProductsTransmisor.length > 0 && storeProductsTransmisor.map((product, k) => {
                // console.log(product, k);
                // productID
                return (
                  <Grid item key={k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                    <ProductCard
                      category="transmisors"
                      className="d-flex mb-2"
                      products={product}
                      productID={k}
                    ></ProductCard>
                  </Grid>
                )
              })}
            </Grid>
          </Suspense>
        {/* Seccion de Receptoras */}
        <Typography variant="h5" sx={classes.spacingTexts}>
          Receptor para drone.
        </Typography>        
          <Suspense
            fallback={
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            }
          >
            <Typography variant="body1" sx={classes.endingTexts}>
              Receptor para cada necesidad en potencia y distacia de vuelo.
            </Typography>
            <Grid container spacing={2}>
              {!!storeProductsReceptor && storeProductsReceptor.length > 0 && storeProductsReceptor.map((product, k) => {
                // console.log(product, k);
                // productID
                return (
                  <Grid item key={k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                    <ProductCard
                      category="receptors"
                      className="d-flex mb-2"
                      products={product}
                      productID={k}
                    ></ProductCard>
                  </Grid>
                )
              })}
            </Grid>
          </Suspense>        
      </Box>
      </Box>
    </>
  )
}

const mapStateToProps = (state) => {
  return { 
    storeProductsReceptor: state.receptors,
    storeProductsTransmisor: state.transmisors
  }
}

export default connect(mapStateToProps, null)(withRoot(TrasmisorReceptor))
