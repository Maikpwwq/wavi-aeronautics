'use client'
import React, { Suspense, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withRoot from '@/modules/withRoot'
import { fetchAccesoriosProducts } from '@/store/states/shop'

import ProductCard from '@/app/tienda/components/ProductCard'
import ProductSkeleton from '@/app/tienda/components/ProductSkeleton'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import FiltroProducto from '@/app/tienda/components/FiltroProducto'
import { useProductFilter } from '@/app/tienda/hooks/useProductFilter'
import CategoryHeader from '@/app/tienda/components/CategoryHeader'
import { getCategoryBySlug } from '@/config/categories'

const categoryData = getCategoryBySlug('baterias')

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

const BateriasPage = () => {
  const dispatch = useDispatch()
  const shopState = useSelector((store) => store?.shop)
  const baterias = shopState?.baterias || []
  const loadedCategories = shopState?.loadedCategories || []

  // Use custom filter hook
  const {
    filters,
    filteredProducts,
    availableBrands,
    toggleBrand,
    toggleBatteryCell,
    setMinPrice,
    setMaxPrice,
    resetFilters,
    sortOrder,
    setSortOrder
  } = useProductFilter(baterias)

  const theme = useTheme()
  const classes = styles(theme)

  // Lazy load baterias products when component mounts
  useEffect(() => {
    if (!loadedCategories.includes('accesorios') && !loadedCategories.includes('baterias')) {
      dispatch(fetchAccesoriosProducts())
    }
  }, [dispatch, loadedCategories])

  const showSkeleton = (!loadedCategories.includes('accesorios') && !loadedCategories.includes('baterias')) && baterias.length === 0

  return (
    <>
      <Box sx={classes.productShowcase}>
        <FiltroProducto
          products={baterias}
          filters={filters}
          availableBrands={availableBrands}
          toggleBrand={toggleBrand}
          toggleBatteryCell={toggleBatteryCell}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          resetFilters={resetFilters}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          category="baterias"
        />
        <Box sx={classes.presentationProducts}>
          <CategoryHeader
            title={categoryData?.title || 'Baterías FPV'}
            description={categoryData?.description}
          />
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={2}>
                {filteredProducts.map((product, k) => (
                  <Grid
                    item
                    key={product.productID || product.id || k}
                    size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}
                  >
                    <ProductCard
                      className="d-flex mb-2"
                      products={product}
                      category="baterias"
                      productID={k}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  fontSize: '0.95rem',
                  py: 4,
                  textAlign: 'center'
                }}
              >
                No hay baterías que coincidan con los filtros seleccionados.
              </Typography>
            )}
          </Suspense>
        </Box>
      </Box>
    </>
  )
}

export default withRoot(BateriasPage)
