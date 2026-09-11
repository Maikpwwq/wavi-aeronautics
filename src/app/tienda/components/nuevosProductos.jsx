
import React, { Suspense, useMemo } from 'react'
import { useSelector } from 'react-redux'
import withRoot from '@/modules/withRoot'
import theme from '@/app/tienda/innerTheme'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
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
    position: 'relative',
    background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #ffffff 100%)',
    overflow: 'hidden',
    width: '100%',
    justifyContent: 'center',
    py: { xs: 5, sm: 7, md: 8 }
  },
  container: {
    padding: `${theme.spacing(0)} ${theme.spacing(0)} !important`,
    margin: 0,
    maxWidth: '100% !important', // Full width for carousel
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    zIndex: 1
  },
  // Carousel Track
  carouselTrack: {
    display: 'flex',
    width: 'max-content', // Allow content to determine width
    animation: 'marquee 70s linear infinite', // Adjust speed here
    '&:hover': {
      animationPlayState: 'paused' // Pause on hover (Desktop)
    }
  },
  item: {
    padding: theme.spacing(2, 1.5), // Vertical headroom prevents hover zoom/shadow from being clipped
    width: 310, // Fixed width for consistent scrolling
    flexShrink: 0
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


  const showSkeleton = !loadedCategories.includes('drones') && sortedProducts.length === 0

  return (
    <Box sx={classes.root} component="section" aria-label="Nuevos productos en tienda">
      {/* Inject Keyframes */}
      <style>{marqueeKeyframes}</style>

      {/* Decorative high-tech ambient background glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '260px',
          background:
            'radial-gradient(ellipse at center, rgba(0, 172, 228, 0.08) 0%, rgba(0, 172, 228, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      
      <Container sx={classes.container}>
        {/* Header & Badging matching FeaturedBrands & recent home sections */}
        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 5 }, px: 2 }}>
          <Chip
            icon={
              <RocketLaunchIcon
                sx={{
                  fontSize: '15px !important',
                  color: '#00aCe4 !important',
                }}
              />
            }
            label="NOVEDADES & LANZAMIENTOS RECIENTES"
            size="small"
            sx={{
              mb: 1.5,
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(0, 172, 228, 0.08)',
              color: '#0284c7',
              border: '1px solid rgba(0, 172, 228, 0.25)',
              px: 1,
            }}
          />

          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
              letterSpacing: '-0.02em',
              color: '#0f172a',
              mb: 1.5,
              textTransform: 'none',
            }}
          >
            Nuevos Productos
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 640,
              mx: 'auto',
              color: '#64748b',
              fontSize: { xs: '0.92rem', sm: '1.02rem' },
              lineHeight: 1.6,
            }}
          >
            Descubre lo último en drones, sistemas autónomos y componentes recién llegados a nuestro catálogo.
          </Typography>
        </Box>
        
        {/* Mask with vertical padding so zoom & shadow have ample clearance */}
        <Box sx={{ width: '100%', overflow: 'hidden', py: { xs: 1.5, sm: 2 } }}>
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
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ m: 2, color: '#64748b' }}>
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

