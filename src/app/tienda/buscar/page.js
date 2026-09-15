'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import withRoot from '@/modules/withRoot'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import ProductCard from '@/app/tienda/components/ProductCard'
import ProductSkeleton from '@/app/tienda/components/ProductSkeleton'
import FiltroProducto from '@/app/tienda/components/FiltroProducto'
import CategoryHeader from '@/app/tienda/components/CategoryHeader'
import { useProductFilter } from '@/app/tienda/hooks/useProductFilter'
import { searchProducts, searchByBrand } from '@/services/FirebaseSearchProducts'
import { matchesBrand } from '@/utilities/brandsConfig'
import { fetchAllProducts } from '@/store/states/shop'

const styles = (theme) => ({
  presentationProducts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`,
    padding: `${theme.spacing(0)} ${theme.spacing(2)} !important`,
    paddingLeft: `${theme.spacing(6)} !important`,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: `${theme.spacing(2)} !important`,
    },
  },
  spacingTexts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`,
  },
  endingTexts: {
    marginBottom: `${theme.spacing(2)} !important`,
  },
  productShowcase: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
})

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const brandParam = searchParams.get('marca')
  const queryParam = searchParams.get('q')
  const queryText = queryParam || brandParam || ''

  const dispatch = useDispatch()
  const shopState = useSelector((store) => store?.shop)

  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(true)

  const hasDispatched = useRef(false)

  // Ensure all shop categories are fetched into Redux if not all are loaded yet
  useEffect(() => {
    const requiredCategories = [
      'drones',
      'radioControl',
      'accesorios',
      'googles',
      'transmisors',
      'digitalVTX',
    ]
    const hasAll = requiredCategories.every((c) =>
      shopState?.loadedCategories?.includes(c)
    )

    if (!hasDispatched.current && !hasAll) {
      hasDispatched.current = true
      dispatch(fetchAllProducts())
    }
  }, [dispatch, shopState?.loadedCategories])

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    async function performSearch() {
      try {
        let found = []

        if (brandParam && !queryParam) {
          // Explicit brand search: filter strictly by brand and its aliases
          found = await searchByBrand(brandParam)
        } else if (queryParam && queryParam.trim()) {
          // Free-text query
          found = await searchProducts(queryParam.trim())
          if (brandParam) {
            found = found.filter((p) =>
              matchesBrand(p.brand || p.marca, brandParam)
            )
          }
        } else if (brandParam) {
          found = await searchByBrand(brandParam)
        }

        if (isMounted) {
          setSearchResults(found)
        }
      } catch (err) {
        console.error('Error executing search page query:', err)
        if (isMounted) setSearchResults([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    performSearch()

    return () => {
      isMounted = false
    }
  }, [brandParam, queryParam])

  const initialFilterConfig = React.useMemo(() => {
    return { brands: brandParam ? [brandParam] : [] }
  }, [brandParam])

  const {
    filters,
    filteredProducts,
    availableBrands,
    toggleBrand,
    setMinPrice,
    setMaxPrice,
    resetFilters,
    sortOrder,
    setSortOrder,
  } = useProductFilter(searchResults, initialFilterConfig)

  const theme = useTheme()
  const classes = styles(theme)

  return (
    <Box sx={classes.productShowcase}>
      {/* Brand & Price Filter Sidebar */}
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

      {/* Main Results View */}
      <Box sx={classes.presentationProducts}>
        <CategoryHeader
          title={
            brandParam && !queryParam
              ? `Productos de la marca "${brandParam}":`
              : `Resultados de búsqueda para "${queryText}":`
          }
          description={
            loading
              ? 'Buscando productos coincidentes en el catálogo...'
              : searchResults.length > 0
              ? `Se encontraron ${searchResults.length} productos coincidentes.`
              : 'No se encontraron productos que coincidan con tu término de búsqueda.'
          }
        />

        {loading ? (
          <ProductSkeleton count={6} />
        ) : filteredProducts.length > 0 ? (
          <Grid container spacing={2} sx={{ justifyContent: 'flex-start' }}>
            {filteredProducts.map((product, k) => (
              <Grid
                item
                key={product.productID || k}
                size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}
              >
                <ProductCard
                  sx="d-flex mb-2"
                  category={product.category || 'tienda'}
                  products={product}
                  productID={k}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ my: 4, p: 3, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Sin resultados
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Intenta buscar con palabras clave distintas (ej. &quot;FPV&quot;, &quot;DJI&quot;, &quot;Batería&quot;, &quot;Gafas&quot;).
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

function SearchPage() {
  return (
    <Suspense fallback={<ProductSkeleton count={6} />}>
      <SearchResultsContent />
    </Suspense>
  )
}

export default withRoot(SearchPage)
