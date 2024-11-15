import React, { Suspense, useState } from 'react'
import {
  connect,
  useSelector
} from 'react-redux'
// import PropTypes from 'prop-types'
import withRoot from '@/modules/withRoot'
import theme from '@/app/tienda/innerTheme'
import Grid from '@mui/material/Grid2'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'

import Typography from '@/modules/components/Typography'
import ProductItem from '@/app/tienda/components/ProductItem'

const styles = (theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#eaeff1',
    // backgroundImage: `url(${})`,
    overflow: 'hidden',
    with: '100%',
    justifyContent: 'center'
  },
  container: {
    padding: `${theme.spacing(3)} ${theme.spacing(0)} !important`,
    margin: 0,
    maxWidth: 'fit-content !important',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    with: '100%'
  },
  productsWraper: {
    flexWrap: 'nowrap',
    overflow: 'auto'
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5)
  },
  title: {
    paddingBottom: theme.spacing(6)
  },
  image: {
    marginBottom: theme.spacing(2),
    width: 100,
    display: 'block',
    maxWidth: 150,
    overflow: 'hidden'
  },
  logos: {
    paddingLeft: '0 !important',
    marginTop: theme.spacing(2)
  },
  logosContainer: {
    overflow: 'hidden',
    flexWrap: 'nowrap',
    flexDirection: 'column',
    marginBottom: `${theme.spacing(4)} !important`
  },
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

function NuevosProductos (props) {
  // const { classes } = props;
  const classes = styles(theme)
  const shopState = useSelector((store) => store.shop)
  const { drones } = shopState

  const [featuredProducts] = useState(drones || []) // setStoreProducts

  return (
    <Box sx={classes.root}>
      <Container fluid sx={classes.container}>
        <Typography
          variant="h4"
          marked="center"
          sx={classes.title}
          component="h2"
        >
          Nuevos Productos
        </Typography>
        <Typography variant="body1" sx={classes.endingTexts}>
          Descubre lo ultimo en Drones y productos recién llegados.
        </Typography>
          <Grid container spacing={3} sx={classes.logosContainer}>
          {!!featuredProducts && featuredProducts.length > 0 && (
            <Suspense
              fallback={
                <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                </Box>
              }
            >
              <Grid sx={classes.productsWraper} container spacing={2}>
                {featuredProducts.map((product, k) => {
                  return (
                    <Grid
                      item
                      key={k}
                      size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}
                      sx={classes.logos}>
                      <ProductItem
                        sx="d-flex mb-2"
                        category="drones"
                        products={product}
                        productID={k}
                      ></ProductItem>
                    </Grid>
                  )
                })}
              </Grid>
            </Suspense>
          )}
          </Grid>
      </Container>
    </Box>
  )
}

NuevosProductos.propTypes = {
  // classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  // console.log("state", state);
  return {
    featuredProducts: state.drones
  }
}

export default connect(mapStateToProps, null)(withRoot(NuevosProductos))
