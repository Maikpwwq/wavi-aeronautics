'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Divider, 
  Stack, 
  Paper,
  CircularProgress
} from '@mui/material'
import { motion } from 'framer-motion'
import { 
  Speed,
  Straighten,
  MonitorWeight,
  BatteryChargingFull,
  SettingsInputAntenna,
  Security
} from '@mui/icons-material'

// Services & Utilities
import { getProductById } from '@/services/sharedServices'
import { sharingInformationService } from '@/services/sharing-information'
import { calculateCopPrice } from '@/utilities/priceUtils'

// Local imports
import { BRAND_COLORS } from '../innerTheme'
import AddProduct from './AddProduct'
import PageNavigation from './PageNavigation'
import { 
  ProductPackageList, 
  ProductSpecsList, 
  SpecItem,
  parsePackageItems, 
  parseSpecifications 
} from './product-detail'

// =============================================================================
// STYLES
// =============================================================================
const styles = {
  mainImage: {
    borderRadius: 4, 
    overflow: 'hidden', 
    bgcolor: 'white',
    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
    position: 'relative',
    aspectRatio: '1/1',
    maxHeight: '639px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionInfo: {
    p: 4, 
    maxWidth: '500px !important',
  },
  thumbnail: (isActive) => ({
    width: 80, 
    height: 80, 
    borderRadius: 2, 
    cursor: 'pointer',
    border: isActive ? `2px solid ${BRAND_COLORS.accent}` : '2px solid transparent',
    overflow: 'hidden',
    bgcolor: 'white',
    flexShrink: 0,
    transition: 'all 0.2s',
    '&:hover': { opacity: 0.8 }
  }),
  actionBox: {
    p: 4, 
    borderRadius: 4, 
    bgcolor: 'white', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.04)', 
    border: `1px solid ${BRAND_COLORS.border.light}`
  }
}

// =============================================================================
// LOCAL COMPONENTS
// =============================================================================
const Chip = ({ label, color }) => (
  <Box sx={{ 
    px: 1.5, 
    py: 0.5, 
    borderRadius: 1, 
    fontSize: '0.75rem', 
    fontWeight: 'bold', 
    bgcolor: color === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0,0,0,0.05)',
    color: color === 'success' ? BRAND_COLORS.success : 'inherit',
    border: `1px solid ${color === 'success' ? BRAND_COLORS.success : '#ddd'}`
  }}>
    {label}
  </Box>
)

const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
    <CircularProgress />
  </Box>
)

// Helper for video URLs
const getEmbedUrl = (url) => {
  if (!url) return '';
  // Handle YouTube
  if (url.includes('youtube.com/watch')) {
    return url.replace('watch?v=', 'embed/');
  }
  if (url.includes('youtu.be')) {
    const id = url.split('/').pop();
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const ProductDetail = () => {
  const searchParams = useSearchParams()
  const searchId = searchParams.get('id')
  const category = searchParams.get('category')
  const marca = searchParams.get('marca')

  const reduxProduct = useSelector((state) => state.product)
  const [product, setProduct] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!searchId) return

    const subscription$ = getProductById(searchId, category, marca)
    
    const productSub = subscription$.subscribe((response) => {
      if (response?.currentProduct?.[0]) {
        setProduct(response.currentProduct[0])
        setLoading(false)
      }
    })
    
    const infoSub = sharingInformationService.getSubject().subscribe((data) => {
      const dataProduct = data?.productos?.[0] || data?.products?.[0]
      if (dataProduct) {
        setProduct(dataProduct)
        setLoading(false)
      }
    })

    return () => {
      productSub.unsubscribe()
      infoSub.unsubscribe()
    }
  }, [searchId, category, marca])

  // Redux fallback
  useEffect(() => {
    if (reduxProduct && reduxProduct.productID === searchId) {
      setProduct(reduxProduct)
      setLoading(false)
    }
  }, [reduxProduct, searchId])

  // ---------------------------------------------------------------------------
  // Memoized values
  // ---------------------------------------------------------------------------
  const images = useMemo(() => {
    const imgs = product?.images || product?.imagenes || []
    return imgs.map(img => typeof img === 'string' ? img : img.url || '')
  }, [product])

  const parsedPackageItems = useMemo(() => parsePackageItems(product?.includes || product?.incluye), [product])
  const parsedSpecifications = useMemo(() => parseSpecifications(product?.specifications || product?.especificaciones), [product])

  const displayPrice = useMemo(() => {
    if (!product) return '$ 0';
    if (product.price) return calculateCopPrice(product.price);
    if (product.precio) {
      return typeof product.precio === 'string' 
        ? product.precio 
        : `$ ${product.precio.toLocaleString()}`;
    }
    return '$ 0';
  }, [product]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (loading || !product) return <LoadingSpinner />

  return (
    <Box sx={{ bgcolor: BRAND_COLORS.background.page, minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="xl">
        {/* Navigation */}
        <PageNavigation category={category} currentPage={product.name || product.titulo} />

        <Grid container spacing={6}>
          {/* Left Column: Images */}
          <Grid item xs={12} md={7}>
            <Box sx={{ position: 'relative' }}>
              <Paper 
                elevation={0}
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                sx={styles.mainImage}
              >
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={images[activeImage]} 
                  alt={product.name || product.titulo}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                  }}
                />
              </Paper>

              {images.length > 1 && (
                <Stack direction="row" spacing={2} sx={{ mt: 3, overflowX: 'auto', pb: 1, maxWidth: '700px' }}>
                  {images.map((img, idx) => (
                    <Box key={idx} onClick={() => setActiveImage(idx)} sx={styles.thumbnail(activeImage === idx)}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>

          {/* Right Column: Product Info */}
          <Grid item xs={12} md={5} sx={styles.actionInfo}>
            <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Typography variant="overline" sx={{ fontWeight: 'bold', letterSpacing: 2, color: BRAND_COLORS.primary }}>
                {product.brand || product.marca || 'Aeronautics'}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: BRAND_COLORS.text.primary }}>
                {product.name || product.titulo}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: BRAND_COLORS.accent, fontWeight: 'bold', mr: 2 }}>
                  {displayPrice}
                </Typography>
                <Chip label="En Stock" color="success" />
              </Box>

              {/* Action Area */}
              <Box sx={styles.actionBox}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Recibe este producto en la puerta de tu casa con envío asegurado.
                </Typography>
                <AddProduct product={product} variant="button" />
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.disabled' }}>
                  Pagos seguros vía MercadoPago & PSE
                </Typography>
              </Box>

              {/* Tags Section */}
              {product.tags && product.tags.length > 0 && (
                <Box sx={{ mt: 3, pt: 3, borderTop: `1px dashed ${BRAND_COLORS.border.light}` }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
                    {product.tags.map((tag, i) => (
                      <Chip key={i} label={tag} />
                    ))}
                  </Stack>
                </Box>
              )}

            </Box>

          </Grid>
        </Grid>

        {/* Section 3: Description & Specs */}
        <Grid container spacing={6} sx={{ mt: 2 }}>
          <Grid item xs={12}>
             <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 4 }}>
                  {product.description || product.descripcion}
                </Typography>

                <Divider sx={{ mb: 4 }} />

                {/* Tech Specs */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Especificaciones Técnicas
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <SpecItem icon={MonitorWeight} label="Peso" value={product.peso || 'N/A'} />
                    <SpecItem icon={Straighten} label="Dimensiones" value={product.dimensiones || 'N/A'} />
                    <SpecItem icon={Speed} label="Rendimiento" value="Alto" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SpecItem icon={BatteryChargingFull} label="Batería" value="LiPo Ready" />
                    <SpecItem icon={SettingsInputAntenna} label="Frecuencia" value="2.4GHz / 5.8GHz" />
                    <SpecItem icon={Security} label="Garantía" value="Oficial Wavi" />
                  </Grid>
                </Grid>
             </Box>
          </Grid>
        </Grid>

        {/* Video Section */}
        {product.video && (
          <Box sx={{ mt: 8, mb: 8 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: BRAND_COLORS.text.primary }}>
              Video Reseña
            </Typography>
            <Paper 
              elevation={0}
              sx={{ 
                position: 'relative', 
                paddingBottom: '56.25%', // 16:9 
                height: 0, 
                overflow: 'hidden', 
                borderRadius: 4,
                bgcolor: 'black',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}
            >
              <iframe 
                src={getEmbedUrl(product.video)} 
                title={product.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            </Paper>
          </Box>
        )}




        {/* Additional Details */}
        <Box>
          <Divider sx={{ mb: 6 }} />
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: BRAND_COLORS.text.primary }}>
                ¿Qué Incluye?
              </Typography>
              <ProductPackageList items={parsedPackageItems} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: BRAND_COLORS.text.primary }}>
                Detalles Adicionales
              </Typography>
              <ProductSpecsList specs={parsedSpecifications} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default ProductDetail
