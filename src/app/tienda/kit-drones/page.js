'use client'
import React, { Suspense, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withRoot from '@/modules/withRoot'
// import theme from '../innerTheme'

// import 'sessionstorage-polyfill'
// import 'localstorage-polyfill'
// global.sessionstorage
// global.localStorage

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

const DroneProducts = (props) => {
  const shopState = useSelector((store) => store?.shop)
  const { dronesKit } = shopState

  const theme = useTheme()
  const classes = styles(theme)
  // const user = auth.currentUser || {}
  // const userID = user.uid || null

  // const dispatch = useDispatch()
  // const state = useSelector((state))
  // const { store } = useContext(ReactReduxContext)

  let productosDronesKit = []
  if (typeof window !== 'undefined') {
    productosDronesKit = JSON.parse(sessionStorage.getItem('Productos_Drones_Kits'))
  }

  const [storeProductsKits] = useState(dronesKit || productosDronesKit || []) // setStoreProducts

  // console.log('DroneKitss', drones)

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
                {storeProductsKits.length > 1 &&
                  storeProductsKits.map((product, k) => {
                    return (
                      <Grid item key={k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                        <ProductCard
                          sx='d-flex mb-2'
                          category='dronesKits'
                          products={product}
                          productID={k}
                        ></ProductCard>
                      </Grid>
                    )
                  })}
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

const mapStateToProps = (state) => {
  // console.log('state', state)
  return {
    storeProductsKits: state.dronesKit
  }
}

export default connect(mapStateToProps, null)(withRoot(DroneProducts))
