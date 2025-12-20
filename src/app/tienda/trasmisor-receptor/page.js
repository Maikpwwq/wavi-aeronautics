'use client'
import React, { Suspense, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ProductCard from '@/app/tienda/components/ProductCard'
import ProductSkeleton from '@/app/tienda/components/ProductSkeleton'
import { fetchTransmisorsProducts } from '@/store/states/shop'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@/modules/components/Typography'
import FiltroProducto from '@/app/tienda/components/FiltroProducto'
import withRoot from '@/modules/withRoot'
import { useTheme } from '@mui/material/styles'

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

// Helper to filter a list based on hook's filter state
const applyFilters = (products, filters) => {
  if (!products) return []
  return products.filter((product) => {
    // Brand Filter
    if (filters.marcas.length > 0 && !filters.marcas.includes(product.marca)) {
      return false
    }
    // Price Filter
    const price = typeof product.precio === 'number' ? product.precio : parseInt(product.precio.replace(/[^0-9]/g, ''), 10) || 0
    const min = filters.precio.min ? parseInt(filters.precio.min, 10) : 0
    const max = filters.precio.max ? parseInt(filters.precio.max, 10) : Infinity
    
    if (price < min) return false
    if (max !== Infinity && price > max) return false
    
    return true
  })
}

const TrasmisorReceptor = () => {
  const dispatch = useDispatch()
  const shopState = useSelector((store) => store?.shop)
  const transmisors = shopState?.transmisors || []
  const receptors = shopState?.receptors || []
  const loadedCategories = shopState?.loadedCategories || []
  
  // Combine for filter initialization (to get all brands)
  const allProducts = [...transmisors, ...receptors]
  
  // Use custom filter hook
  const {
    filters,
    availableMarcas,
    toggleMarca,
    setMinPrice,
    setMaxPrice,
    resetFilters
  } = useProductFilter(allProducts)

  // Apply filters to each list separately
  const filteredTransmisors = applyFilters(transmisors, filters)
  const filteredReceptors = applyFilters(receptors, filters)

  const theme = useTheme()
  const classes = styles(theme)

  // Lazy load transmisors/receptors when component mounts
  useEffect(() => {
    if (!loadedCategories.includes('transmisors')) {
      dispatch(fetchTransmisorsProducts())
    }
  }, [dispatch, loadedCategories])

  const showSkeleton = !loadedCategories.includes('transmisors') && transmisors.length === 0 && receptors.length === 0

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
          {/* Seccion de Transmisoras */}
          <Typography variant="h5" sx={classes.spacingTexts}>
            Transmisores para drone.
          </Typography>
          <Typography variant="body1" sx={classes.endingTexts}>
            Transmisores para cada necesidad en potencia y distacia de vuelo.
          </Typography>
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : filteredTransmisors.length > 0 ? (
              <Grid container spacing={2}>
                {filteredTransmisors.map((product, k) => (
                  <Grid item key={product.productID || k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                    <ProductCard
                      category="transmisors"
                      className="d-flex mb-2"
                      products={product}
                      productID={k}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" sx={{ m: 2 }}>
                No hay transmisores que coincidan con los filtros.
              </Typography>
            )}
          </Suspense>

          {/* Seccion de Receptoras */}
          <Typography variant="h5" sx={classes.spacingTexts}>
            Receptor para drone.
          </Typography>
          <Typography variant="body1" sx={classes.endingTexts}>
            Receptor para cada necesidad en potencia y distacia de vuelo.
          </Typography>
          <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : filteredReceptors.length > 0 ? (
              <Grid container spacing={2}>
                {filteredReceptors.map((product, k) => (
                  <Grid item key={product.productID || k} size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}>
                    <ProductCard
                      category="receptors"
                      className="d-flex mb-2"
                      products={product}
                      productID={k}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" sx={{ m: 2 }}>
                No hay receptores que coincidan con los filtros.
              </Typography>
            )}
          </Suspense>
        </Box>
      </Box>
    </>
  )
}

export default withRoot(TrasmisorReceptor)

