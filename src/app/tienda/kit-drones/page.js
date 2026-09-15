'use client'
import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withRoot from '@/modules/withRoot'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import ProductCard from '@/app/tienda/components/ProductCard'
import ProductSkeleton from '@/app/tienda/components/ProductSkeleton'
import FiltroProducto from '@/app/tienda/components/FiltroProducto'
import UsedProductsShowcase from '@/app/tienda/components/UsedProductsShowcase'
import { useProductFilter } from '@/app/tienda/hooks/useProductFilter'
import CategoryHeader from '@/app/tienda/components/CategoryHeader'

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
  productShowcase: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start', // Align sidebar and content to top
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  }
})

const DroneProducts = () => {
  const shopState = useSelector((store) => store?.shop)
  const dronesKit = shopState?.dronesKit || []
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
  } = useProductFilter(dronesKit)

  // Show skeleton until drones category is loaded
  const showSkeleton = !loadedCategories.includes('drones') && dronesKit.length === 0

  const theme = useTheme()
  const classes = styles(theme)

  return (
    <>
      <Box sx={classes.productShowcase}>
        <FiltroProducto 
          filters={filters}
          availableBrands={availableBrands}
          toggleBrand={toggleBrand}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          resetFilters={resetFilters}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <Box sx={classes.presentationProducts}>
          <CategoryHeader
            title="Kits de Drones FPV"
            description="Kits integrales de iniciación y nivel avanzado con todo lo necesario para despegar en el vuelo en primera persona."
          />
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : filteredProducts.length > 0 ? (
              <Grid
                container
                spacing={2}
                sx={{ justifyContent: 'flex-start' }}
              >
                {filteredProducts.map((product, k) => (
                  <Grid item key={product.productID || k} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                    <ProductCard
                      sx='d-flex mb-2'
                      category='dronesKits'
                      products={product}
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
                No hay productos que coincidan con los filtros seleccionados.
              </Typography>
            )}
          </Suspense>

          {/* Second-Hand Used Products Section */}
          <UsedProductsShowcase categoryKey="dronesKits" categoryTitle="Kits de Dron" />
        </Box>
      </Box>
    </>
  )
}

export default withRoot(DroneProducts)

