'use client'
import React, { Suspense, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withRoot from '@/modules/withRoot'
import { fetchFramesProducts } from '@/store/states/shop'

import ProductCard from '@/app/tienda/components/ProductCard'
import ProductSkeleton from '@/app/tienda/components/ProductSkeleton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import FiltroProducto from '@/app/tienda/components/FiltroProducto'
import { useProductFilter } from '@/app/tienda/hooks/useProductFilter'
import CategoryHeader from '@/app/tienda/components/CategoryHeader'
import { getCategoryBySlug } from '@/config/categories'

const categoryData = getCategoryBySlug('frames')

const styles = (theme) => ({
  presentationProducts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`,
    padding: `${theme.spacing(0)} ${theme.spacing(2)} !important`,
    paddingLeft: `${theme.spacing(6)} !important`,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    [theme.breakpoints.down('md')]: {
      paddingLeft: `${theme.spacing(2)} !important`
    }
  },
  productShowcase: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column'
    }
  }
})

const FramesPage = () => {
  const dispatch = useDispatch()
  const shopState = useSelector((store) => store?.shop)
  const frames = shopState?.frames || []
  const loadedCategories = shopState?.loadedCategories || []

  // Use custom filter hook
  const {
    filters,
    filteredProducts,
    availableBrands,
    toggleBrand,
    setMinPrice,
    setMaxPrice,
    resetFilters,
    sortOrder,
    setSortOrder
  } = useProductFilter(frames)

  const theme = useTheme()
  const classes = styles(theme)

  // Lazy load frames products when component mounts
  useEffect(() => {
    if (!loadedCategories.includes('frames')) {
      dispatch(fetchFramesProducts())
    }
  }, [dispatch, loadedCategories])

  const showSkeleton = !loadedCategories.includes('frames') && frames.length === 0

  return (
    <>
      <Box sx={classes.productShowcase}>
        <FiltroProducto
          products={frames}
          filters={filters}
          availableBrands={availableBrands}
          toggleBrand={toggleBrand}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          resetFilters={resetFilters}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          category="frames"
        />
        <Box sx={classes.presentationProducts}>
          <CategoryHeader
            title={categoryData?.title || 'Frames & Chasis de Carbono'}
            description={categoryData?.description}
          />
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={2}>
                {filteredProducts.map((product, k) => (
                  <Grid item key={product.productID || product.id || k} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                    <ProductCard
                      className="d-flex mb-2"
                      products={product}
                      category="frames"
                      productID={k}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  color: 'text.secondary',
                  py: 8,
                  fontSize: '1rem'
                }}
              >
                No se encontraron frames o chasis con los filtros seleccionados.
              </Typography>
            )}
          </Suspense>
        </Box>
      </Box>
    </>
  )
}

export default withRoot(FramesPage)
