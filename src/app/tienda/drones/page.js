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
import { useProductFilter } from '@/app/tienda/hooks/useProductFilter'
import CategoryHeader from '@/app/tienda/components/CategoryHeader'

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

const DroneProducts = () => {
  const shopState = useSelector((store) => store?.shop)
  const dronesRC = shopState?.dronesRC || []
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
          availableBrands={availableBrands}
          toggleBrand={toggleBrand}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
          resetFilters={resetFilters}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        <Box sx={classes.presentationProducts}>
          <CategoryHeader title="Drones RC (BNF / PNP / RTF)">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 0.5 }}>
              <Typography
                variant="body2"
                component="p"
                sx={{ color: '#475569', fontSize: { xs: '0.88rem', sm: '0.95rem' }, lineHeight: 1.6 }}
              >
                <Box component="strong" sx={{ color: '#0f172a', fontWeight: 700 }}>
                  BNF (Bind and Fly):
                </Box>{' '}
                Viene completamente ensamblado y probado con todo el hardware integrado; solo requiere vincular tu propio radio control y batería compatible.
              </Typography>
              <Typography
                variant="body2"
                component="p"
                sx={{ color: '#475569', fontSize: { xs: '0.88rem', sm: '0.95rem' }, lineHeight: 1.6 }}
              >
                <Box component="strong" sx={{ color: '#0f172a', fontWeight: 700 }}>
                  PNP (Plug and Play):
                </Box>{' '}
                Incluye chasis, motores, ESC y controladora de vuelo; ideal si ya dispones de receptor, emisora, batería y cargador.
              </Typography>
              <Typography
                variant="body2"
                component="p"
                sx={{ color: '#475569', fontSize: { xs: '0.88rem', sm: '0.95rem' }, lineHeight: 1.6 }}
              >
                <Box component="strong" sx={{ color: '#0f172a', fontWeight: 700 }}>
                  RTF (Ready to Fly):
                </Box>{' '}
                La versión integral y autónoma lista para despegar desde el primer instante en que la sacas de la caja.
              </Typography>
            </Box>
          </CategoryHeader>
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : filteredProducts.length > 0 ? (
              <Grid container spacing={2}>
                {filteredProducts.map((product, k) => (
                  <Grid item key={product.productID || k} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
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
        </Box>
      </Box>
    </>
  )
}

export default withRoot(DroneProducts)

