'use client'
import React, { Suspense, useState } from 'react'
import { useSelector, connect } from 'react-redux'
// import "sessionstorage-polyfill";
// import "localstorage-polyfill";
// global.sessionstorage;
// global.localStorage;

import ProductCard from '@/app/tienda/components/ProductCard'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@/modules/components/Typography'
import FiltroProducto from '@/app/tienda/components/FiltroProducto'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'
// import { styled } from '@mui/material/styles'

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

export const DigitalVTX = (props) => {
  // const { classes } = props;
  const shopState = useSelector((store) => store?.shop)
  const { digitalVTX } = shopState
  const classes = styles(theme)
  const [storeDigitalVTX] = useState(digitalVTX || [])

  return (
    <>
    <Box sx={classes.productShowcase}>
        <FiltroProducto />
      <Box sx={classes.presentationProducts}>
        <Typography variant="h5" sx={classes.spacingTexts}>
          Video transmisión digital HD - VTX.
        </Typography>
        {!!storeDigitalVTX && storeDigitalVTX.length > 0 && (
          <Suspense
              fallback={
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
              }
            >
              <Typography variant="body1" sx={classes.endingTexts}>
                Módulos de soporte para video transmisor digital HD - VTX.
              </Typography>
              <Grid container spacing={2}>
                {storeDigitalVTX.map((product, k) => {
                  // console.log(product, k);
                  // productID
                  return (
                    <Grid item key={k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                      <ProductCard
                        category="digitalVTX"
                        className="d-flex mb-2"
                        products={product}
                        productID={k}
                      ></ProductCard>
                    </Grid>
                  )
                })}
              </Grid>
          </Suspense>
        )}
      </Box>
      </Box>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    storeDigitalVTX: state.digitalVTX
  }
}

export default connect(mapStateToProps, null)(withRoot(DigitalVTX))
