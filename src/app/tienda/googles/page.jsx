'use client'
import React, { Suspense, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withRoot from '@/modules/withRoot'
import { fetchGooglesProducts } from '@/store/states/shop'

import ProductCard from '@/app/tienda/components/ProductCard'
import ProductSkeleton from '@/app/tienda/components/ProductSkeleton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@/modules/components/Typography'
import FiltroProducto from '@/app/tienda/components/FiltroProducto'
import { useProductFilter } from '@/app/tienda/hooks/useProductFilter'

const styles = (theme) => ({
  presentationProducts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`,
    padding: `${theme.spacing(0)} ${theme.spacing(2)} !important`,
    paddingLeft: `${theme.spacing(6)} !important`,
    display: 'flex',
    flexDirection: 'column',
    flex: 1, // Take remaining space
    minWidth: 0, // Prevent flex item from overflowing
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
    alignItems: 'flex-start', // Align sidebar and content to top
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  }
})

const Googles = () => {
  const dispatch = useDispatch()
  const shopState = useSelector((store) => store?.shop)
  const googles = shopState?.googles || []
  const loadedCategories = shopState?.loadedCategories || []
  
  // Use custom filter hook
  const {
    filters,
    filteredProducts,
    availableMarcas,
    toggleMarca,
    setMinPrice,
    setMaxPrice,
    resetFilters,
    sortOrder,
    setSortOrder
  } = useProductFilter(googles)
  
  const theme = useTheme()
  const classes = styles(theme)

  // Lazy load googles when component mounts if not already loaded
  useEffect(() => {
    if (!loadedCategories.includes('googles')) {
      dispatch(fetchGooglesProducts())
    }
  }, [dispatch, loadedCategories])

  const showSkeleton = !loadedCategories.includes('googles') && googles.length === 0

  return (
    <>
      <Box sx={classes.productShowcase}>
        <FiltroProducto 
          filters={filters}
          availableMarcas={availableMarcas}
          toggleMarca={toggleMarca}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          resetFilters={resetFilters}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <Box sx={classes.presentationProducts}>
          <Typography variant="h5" sx={classes.spacingTexts}>
            Googles para drone.
          </Typography>
          <Typography variant="body1" sx={classes.endingTexts}>
            Googles para cada necesidad en potencia y tiempo de vuelo.
          </Typography>
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={2}>
                {filteredProducts.map((product, k) => (
                  <Grid item key={product.productID || k} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                    <ProductCard
                      className="d-flex mb-2"
                      products={product}
                      category="googles"
                      productID={k}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" sx={{ m: 2 }}>
                No hay productos que coincidan con los filtros seleccionados.
              </Typography>
            )}
          </Suspense>
        </Box>
      </Box>
    </>
  )
}

export default withRoot(Googles)

