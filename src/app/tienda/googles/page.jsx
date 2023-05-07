'use client'
import React, { Suspense, useState } from 'react'
import { useSelector, connect } from 'react-redux'
// import "sessionstorage-polyfill";
// import "localstorage-polyfill";
// global.sessionstorage;
// global.localStorage;

import ProductCard from '../components/ProductCard'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@/modules/components/Typography'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'
// import { styled } from '@mui/material/styles'

const styles = (theme) => ({
  presentationProducts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`,
    padding: `${theme.spacing(0)} ${theme.spacing(2)} !important`,
    display: 'flex',
    flexDirection: 'column'
  },
  spacingTexts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`
  },
  endingTexts: {
    marginBottom: `${theme.spacing(2)} !important`
  }
})

const Googles = (props) => {
  // const { classes } = props;
  const shopState = useSelector((store) => store.shop)
  const { googles } = shopState

  const classes = styles(theme)

  // setStoreProductsGoogles
  const [storeProductsGoogles] = useState(
    googles || []
  )

  return (
    <>
      <Box sx={classes.presentationProducts}>
        <Typography variant="h5" sx={classes.spacingTexts}>
          Googles para drone.
        </Typography>
        {!!storeProductsGoogles && storeProductsGoogles.length > 0 && (
          <Suspense
              fallback={
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
              }
          >
            <Typography variant="body1" sx={classes.endingTexts}>
              Googles para cada necesidad en potencia y tiempo de vuelo.
            </Typography>
            <Grid container spacing={2}>
              {storeProductsGoogles.map((product, k) => {
                // console.log(product, k);
                // productID
                return (
                  <Grid item key={k} sm={12} xs={12} md={5} lg={4} xl={3}>
                    <ProductCard
                      className="d-flex mb-2"
                      products={product}
                      category="Googles"
                      productID={k}
                    ></ProductCard>
                  </Grid>
                )
              })}
            </Grid>
          </Suspense>
        )}
      </Box>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    storeProductsGoogles: state.googles
  }
}

export default connect(mapStateToProps, null)(withRoot(Googles))
