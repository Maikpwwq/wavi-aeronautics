'use client'
import React, { Suspense, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withRoot from '@/modules/withRoot'
// import theme from '../innerTheme'

// import "sessionstorage-polyfill";
// import "localstorage-polyfill";
// global.sessionstorage;
// global.localStorage;

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
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
  const { dronesHD } = shopState // , dronesRC

  const theme = useTheme()
  const classes = styles(theme)
  // const user = auth.currentUser || {};
  // const userID = user.uid || null;

  // const dispatch = useDispatch();
  // const state = useSelector((state))
  // const { store } = useContext(ReactReduxContext);

  const [storeProductsHD] = useState(dronesHD) // setStoreProducts
  // const [storeProductsRC] = useState(dronesRC) // setStoreProductsRC

  // console.log('DroneProducts', drones, dronesRC)

  return (
    <>
      <Box sx={classes.productShowcase}>
        <FiltroProducto />
        <Box sx={classes.presentationProducts}>
          <Typography variant="h5" sx={classes.spacingTexts}>
            Drones FPV digital HD:
          </Typography>
          <>
                <Typography variant="body1" sx={classes.endingTexts}>
                  Descubre los mejores Drones FPV con transmisión digital de video en HD y preparate para filmar.
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
                  {storeProductsHD.length > 1 && storeProductsHD.map((product, k) => {
                    return (
                      <Grid item key={k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                        <ProductCard
                          sx="d-flex mb-2"
                          category="dronesHD"
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
                {/* <Typography variant="h5" sx={classes.spacingTexts}>
                  Drones a control remoto BNF/PNP/RTF.{' '}
                </Typography>
                <Typography variant="body1">
                  Bind aNd Fly: Esta versión es la que viene con todo menos con
                  el transmisor y el radio control.
                </Typography>
                <Typography variant="body1">
                  Plug aNd Play: Esta es la versión incluye todo menos el
                  transmisor, el radio control, el receptor, batería y cargador.
                </Typography>
                <Typography variant="body1" sx={classes.endingTexts}>
                  Ready To Fly: Esta es la versión completa, puede funcionar
                  desde el momento que lo recibes.
                </Typography>
                <Suspense
                fallback={
                  <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                  </Box>
                }
              >
                <Grid container spacing={2}>
                  {storeProductsRC.length > 1 && storeProductsRC.map((product, k) => {
                    return (
                      <Grid item key={k} sm={12} xs={12} md={5} lg={4} xl={3}>
                        <ProductCard
                          className="d-flex mb-2"
                          category="dronesRC"
                          products={product}
                          productID={k}
                        ></ProductCard>
                      </Grid>
                    )
                  })}
                </Grid>
              </Suspense> */}
          </>
        </Box>
      </Box>
    </>
  )
}

const mapStateToProps = (state) => {
  // console.log("state", state);
  return {
    storeProductsHD: state.dronesHD
    // storeProductsRC: state.dronesRC
  }
}

export default connect(mapStateToProps, null)(withRoot(DroneProducts))
