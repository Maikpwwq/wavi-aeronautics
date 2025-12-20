'use client'
import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withRoot from '@/modules/withRoot'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@/modules/components/Typography'

import ProductCard from '@/app/tienda/components/ProductCard'
import ProductSkeleton from '@/app/tienda/components/ProductSkeleton'
import { useProductFilter } from '@/app/tienda/hooks/useProductFilter'

const DroneProducts = () => {
  const shopState = useSelector((store) => store?.shop)
  const dronesHD = shopState?.dronesHD || []
  const loadedCategories = shopState?.loadedCategories || []
  
  // Use custom filter hook
  const {
    filters,
    filteredProducts,
    availableMarcas,
    toggleMarca,
    setMinPrice,
    setMaxPrice,
    resetFilters
  } = useProductFilter(dronesHD)

  // Show skeleton until drones category is loaded
  const showSkeleton = !loadedCategories.includes('drones') && dronesHD.length === 0

  const theme = useTheme()
  const classes = styles(theme)

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
        />
        <Box sx={classes.presentationProducts}>
          <Typography variant="h5" sx={classes.spacingTexts}>
            Drones FPV digital HD:
          </Typography>
          <Typography variant="body1" sx={classes.endingTexts}>
            Descubre los mejores Drones FPV con transmisión digital de video en HD y preparate para filmar.
          </Typography>
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : filteredProducts.length > 0 ? (
              <Grid
                container
                spacing={2}
                sx={{ justifyContent: 'space-around' }}
              >
                {filteredProducts.map((product, k) => (
                  <Grid item key={k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                    <ProductCard
                      sx="d-flex mb-2"
                      category="dronesHD"
                      products={product}
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

export default withRoot(DroneProducts)

