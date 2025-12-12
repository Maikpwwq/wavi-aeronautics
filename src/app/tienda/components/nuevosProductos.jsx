import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import withRoot from '@/modules/withRoot'
import theme from '@/app/tienda/innerTheme'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

import Typography from '@/modules/components/Typography'
import ProductItem from '@/app/tienda/components/ProductItem'
import ProductSkeleton from '@/app/tienda/components/ProductSkeleton'

const styles = (theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#eaeff1',
    overflow: 'hidden',
    width: '100%',
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
    width: '100%'
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

function NuevosProductos() {
  const classes = styles(theme)
  const shopState = useSelector((store) => store?.shop)
  const dronesHD = shopState?.dronesHD || []
  const loadedCategories = shopState?.loadedCategories || []
  
  // Use Redux state primarily, fallback to sessionStorage if Redux is empty
  let featuredProducts = dronesHD.length > 0 ? dronesHD : []

  // Fallback to sessionStorage if Redux is empty but category was loaded
  if (typeof window !== 'undefined' && featuredProducts.length === 0) {
    const stored = sessionStorage.getItem('Productos_DronesHD')
    if (stored) {
      try {
        featuredProducts = JSON.parse(stored)
      } catch (e) {
        console.error('Error parsing stored products:', e)
      }
    }
  }

  // Show skeleton if drones category hasn't been loaded yet
  const showSkeleton = !loadedCategories.includes('drones') && featuredProducts.length === 0

  return (
    <Box sx={classes.root}>
      <Container sx={classes.container}>
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
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : featuredProducts.length > 0 ? (
              <Grid sx={classes.productsWraper} container spacing={2}>
                {featuredProducts.map((product, k) => (
                  <Grid
                    item
                    key={product.productID || k}
                    size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}
                    sx={classes.logos}
                  >
                    <ProductItem
                      sx="d-flex mb-2"
                      category="drones"
                      products={product}
                      productID={k}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" sx={{ m: 2 }}>
                No hay productos disponibles.
              </Typography>
            )}
          </Suspense>
        </Grid>
      </Container>
    </Box>
  )
}

export default withRoot(NuevosProductos)

