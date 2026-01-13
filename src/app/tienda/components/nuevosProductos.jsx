
import React, { Suspense, useMemo } from 'react'
import { useSelector } from 'react-redux'
import withRoot from '@/modules/withRoot'
import theme from '@/app/tienda/innerTheme'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@/modules/components/Typography'
import ProductItem from '@/app/tienda/components/ProductItem'
import ProductSkeleton from '@/app/tienda/components/ProductSkeleton'

// Keyframes for infinite scroll
const marqueeKeyframes = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
`

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
    maxWidth: '100% !important', // Full width for carousel
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    overflow: 'hidden' // Hide scrollbar
  },
  // Carousel Track
  carouselTrack: {
    display: 'flex',
    width: 'max-content', // Allow content to determine width
    animation: 'marquee 55s linear infinite', // Adjust speed here
    '&:hover': {
      animationPlayState: 'paused' // Pause on hover (Desktop)
    }
  },
  item: {
    padding: theme.spacing(0, 2),
    width: 300, // Fixed width for consistent scrolling
    flexShrink: 0
  },
  title: {
    paddingBottom: theme.spacing(4)
  },
  endingTexts: {
    marginBottom: `${theme.spacing(4)} !important`
  },
  dateText: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1)
  }
})

function NuevosProductos() {
  const classes = styles(theme)
  const shopState = useSelector((store) => store?.shop)
  const dronesHD = shopState?.dronesHD || []
  const loadedCategories = shopState?.loadedCategories || []

  // Sort by Recent Date (updatedAt or createdAt)
  const sortedProducts = useMemo(() => {
    let list = [...dronesHD]
    if (list.length === 0 && typeof window !== 'undefined') {
       // Fallback to session
       try {
         const stored = sessionStorage.getItem('Productos_DronesHD')
         if (stored) list = JSON.parse(stored)
       } catch (e) {
         console.error(e)
       }
    }

    return list.sort((a, b) => {
      // Handle Firestore Timestamp { seconds, nanoseconds } or Date object or ISO string
      const getTime = (p) => {
         const ts = p.updatedAt || p.createdAt
         if (!ts) return 0
         if (ts.seconds) return ts.seconds * 1000
         if (ts instanceof Date) return ts.getTime()
         return new Date(ts).getTime()
      }
      return getTime(b) - getTime(a)
    })
  }, [dronesHD])

  // Duplicate list for infinite seamless scroll (if enough items)
  // If items < 5, duplicate more times to fill screen
  const carouselItems = useMemo(() => {
    if (sortedProducts.length === 0) return []
    if (sortedProducts.length < 5) {
       return [...sortedProducts, ...sortedProducts, ...sortedProducts, ...sortedProducts] 
    }
    return [...sortedProducts, ...sortedProducts]
  }, [sortedProducts])

  // Date Formatter
  const formatDate = (product) => {
    const ts = product.updatedAt || product.createdAt
    if (!ts) return ''
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts)
    
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
      timeZoneName: 'short'
    }).format(date)
  }

  const showSkeleton = !loadedCategories.includes('drones') && sortedProducts.length === 0

  return (
    <Box sx={classes.root}>
      {/* Inject Keyframes */}
      <style>{marqueeKeyframes}</style>
      
      <Container sx={classes.container}>
        <Typography variant="h4" marked="center" sx={classes.title} component="h2">
          Nuevos Productos
        </Typography>
        <Typography variant="body1" sx={classes.endingTexts}>
          Descubre lo último en Drones y productos recién llegados.
        </Typography>
        
        <Box sx={{ width: '100%', overflow: 'hidden' }}> {/* Mask */}
           <Suspense fallback={<ProductSkeleton count={4} />}>
            {showSkeleton ? (
              <ProductSkeleton count={4} />
            ) : carouselItems.length > 0 ? (
              <Box sx={classes.carouselTrack}>
                {carouselItems.map((product, k) => (
                  <Box key={`${product.productID || k}-${k}`} sx={classes.item}>
                    <ProductItem
                      category="drones"
                      products={product}
                      productID={k}
                    />
                    <Typography sx={classes.dateText}>
                      {formatDate(product)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ m: 2 }}>
                No hay productos disponibles.
              </Typography>
            )}
          </Suspense>
        </Box>
      </Container>
    </Box>
  )
}

export default withRoot(NuevosProductos)

