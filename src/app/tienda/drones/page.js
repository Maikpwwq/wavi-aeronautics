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
import FiltroProducto from '@/app/tienda/components/FiltroProducto'
import { useProductFilter } from '@/app/tienda/hooks/useProductFilter'

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

const DroneProducts = () => {
  const shopState = useSelector((store) => store?.shop)
  const dronesRC = shopState?.dronesRC || []
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
  } = useProductFilter(dronesRC)
  
  // Show skeleton until drones category is loaded
  const showSkeleton = !loadedCategories.includes('drones') && dronesRC.length === 0

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
          <Typography variant='h5' sx={classes.spacingTexts}>
            Drones a control remoto BNF/PNP/RTF.{' '}
          </Typography>
          <Typography variant='body1'>
            Bind aNd Fly: Esta versión es la que viene con todo menos con el
            transmisor y el radio control.
          </Typography>
          <Typography variant='body1'>
            Plug aNd Play: Esta es la versión incluye todo menos el
            transmisor, el radio control, el receptor, batería y cargador.
          </Typography>
          <Typography variant='body1' sx={classes.endingTexts}>
            Ready To Fly: Esta es la versión completa, puede funcionar desde
            el momento que lo recibes.
          </Typography>
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={2}>
                {filteredProducts.map((product, k) => (
                  <Grid item key={product.productID || k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                    <ProductCard
                      className='d-flex mb-2'
                      category='dronesRC'
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

