'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Breadcrumbs, 
  Link, 
  Divider, 
  Stack, 
  Paper,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  NavigateBefore, 
  NavigateNext, 
  ChevronRight, 
  ArrowBack,
  Speed,
  Straighten,
  MonitorWeight,
  BatteryChargingFull,
  SettingsInputAntenna,
  Security
} from '@mui/icons-material'

import { getProductById } from '@/services/sharedServices'
import { sharingInformationService } from '@/services/sharing-information'
import AddProduct from './AddProduct'
import { calculateCopPrice } from '@/utilities/priceUtils'

const SpecItem = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box 
      sx={{ 
        p: 1, 
        borderRadius: 2, 
        bgcolor: 'rgba(0, 188, 212, 0.1)', 
        color: '#00bcd4',
        mr: 2,
        display: 'flex'
      }}
    >
      <Icon fontSize="small" />
    </Box>
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
        {value}
      </Typography>
    </Box>
  </Box>
)

const ProductDetail = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchId = searchParams.get('id')
  const category = searchParams.get('category')
  const marca = searchParams.get('marca')

  const reduxProduct = useSelector((state) => state.product)
  const [product, setProduct] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!searchId) return

    const subscription$ = getProductById(searchId, category, marca)
    
    // 1. Handle direct service response
    const productSub = subscription$.subscribe((response) => {
      if (response?.currentProduct?.[0]) {
        console.log('[ProductDetail] Loaded from direct service:', response.currentProduct[0]);
        setProduct(response.currentProduct[0]);
        setLoading(false);
      }
    })
    
    // 2. Handle shared information (for broadcast updates)
    const infoSub = sharingInformationService.getSubject().subscribe((data) => {
      // Handle naming inconsistency in project services (products vs productos)
      const dataProduct = data?.productos?.[0] || data?.products?.[0];
      if (dataProduct) {
        console.log('[ProductDetail] Loaded from sharing service:', dataProduct);
        setProduct(dataProduct)
        setLoading(false)
      }
    })

    return () => {
      productSub.unsubscribe()
      infoSub.unsubscribe()
    }
  }, [searchId, category, marca])

  // Fallback to Redux if direct fetch hasn't completed but Redux has it
  useEffect(() => {
    if (reduxProduct && reduxProduct.productID === searchId) {
      setProduct(reduxProduct)
      setLoading(false)
    }
  }, [reduxProduct, searchId])

  const images = useMemo(() => {
    if (!product?.imagenes) return []
    return product.imagenes.map(img => typeof img === 'string' ? img : img.url || '')
  }, [product])

  if (loading || !product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#fcfcfc', minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="lg">
        {/* Navigation / Breadcrumbs */}
        <Box sx={{ py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => router.back()}
            sx={{ textTransform: 'none', color: 'text.secondary' }}
          >
            Volver a la Tienda
          </Button>
          <Breadcrumbs separator={<ChevronRight fontSize="small" />} aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.875rem' }}>Inicio</Link>
            <Link underline="hover" color="inherit" href="/tienda" sx={{ fontSize: '0.875rem' }}>Tienda</Link>
            <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>{product.titulo}</Typography>
          </Breadcrumbs>
        </Box>

        <Grid container spacing={6}>
          {/* Left Column: Visuals */}
          <Grid item xs={12} md={7}>
            <Box sx={{ position: 'relative' }}>
              <Paper 
                elevation={0}
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden', 
                  bgcolor: 'white',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                  position: 'relative',
                  aspectRatio: '1/1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4
                }}
              >
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  src={images[activeImage]} 
                  alt={product.titulo}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%', 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                  }}
                />
              </Paper>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <Stack 
                  direction="row" 
                  spacing={2} 
                  sx={{ mt: 3, overflowX: 'auto', pb: 1 }}
                >
                  {images.map((img, idx) => (
                    <Box 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: 2, 
                        cursor: 'pointer',
                        border: activeImage === idx ? '2px solid #00bcd4' : '2px solid transparent',
                        overflow: 'hidden',
                        bgcolor: 'white',
                        flexShrink: 0,
                        transition: 'all 0.2s',
                        '&:hover': { opacity: 0.8 }
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>

          {/* Right Column: Data & Action */}
          <Grid item xs={12} md={5}>
            <Box 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="overline" color="secondary" sx={{ fontWeight: 'bold', letterSpacing: 2 }}>
                {product.marca || 'Aeronautics'}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#1a2744' }}>
                {product.titulo}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: '#00bcd4', fontWeight: 'bold', mr: 2 }}>
                  {calculateCopPrice(product.precio)}
                </Typography>
                <Chip label="En Stock" color="success" size="small" variant="outlined" sx={{ borderRadius: 1 }} />
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 4 }}>
                {product.descripcion}
              </Typography>

              <Divider sx={{ mb: 4 }} />

              {/* Tech Specs Instrumented Panel */}
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                Especificaciones Técnicas
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <SpecItem icon={MonitorWeight} label="Peso" value={product.peso || 'N/A'} />
                  <SpecItem icon={Straighten} label="Dimensiones" value={product.dimensiones || 'N/A'} />
                  <SpecItem icon={Speed} label="Rendimiento" value="Alto" />
                </Grid>
                <Grid item xs={6}>
                  <SpecItem icon={BatteryChargingFull} label="Batería" value="LiPo Ready" />
                  <SpecItem icon={SettingsInputAntenna} label="Frecuencia" value="2.4GHz / 5.8GHz" />
                  <SpecItem icon={Security} label="Garantía" value="Oficial Wavi" />
                </Grid>
              </Grid>

              {/* Action Area */}
              <Box sx={{ p: 4, borderRadius: 4, bgcolor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Recibe este producto en la puerta de tu casa con envío asegurado.
                </Typography>
                <AddProduct product={product} variant="button" />
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.disabled' }}>
                  Pagos seguros vía MercadoPago & PSE
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Detailed Info Tabs/Sections */}
        <Box sx={{ mt: 10 }}>
            <Divider sx={{ mb: 6 }} />
            <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>¿Qué Incluye?</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
                        {product.incluye || 'Consulta con soporte para más detalles sobre los componentes incluidos.'}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Detalles Adicionales</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
                        {product.especificaciones || 'No hay especificaciones adicionales listadas.'}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
      </Container>
    </Box>
  )
}

// Utility to match the Chip component used in the UI
const Chip = ({ label, color }) => (
    <Box sx={{ 
        px: 1.5, 
        py: 0.5, 
        borderRadius: 1, 
        fontSize: '0.75rem', 
        fontWeight: 'bold', 
        bgcolor: color === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0,0,0,0.05)',
        color: color === 'success' ? '#4caf50' : 'inherit',
        border: `1px solid ${color === 'success' ? '#4caf50' : '#ddd'}`
    }}>
        {label}
    </Box>
)

export default ProductDetail
