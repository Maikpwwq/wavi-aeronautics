'use client'

import React, { useEffect, useState, use } from 'react'
import withRoot from '@/modules/withRoot'
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Button,
  Paper,
  Divider,
  Stack,
  Breadcrumbs,
  CircularProgress,
  Alert
} from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { fetchUsedListingById } from '@/services/usedProductsService'
import { formatCopCurrency, USED_CONDITIONS, USED_STATUS } from '@/utilities/usedProductsConfig'

function UsedProductDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const id = params?.id
  const router = useRouter()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      setLoading(true)
      fetchUsedListingById(id)
        .then((data) => {
          if (data) {
            setProduct(data)
          } else {
            setError('Publicación no encontrada o eliminada.')
          }
        })
        .catch((err) => {
          console.error(err)
          setError('Error al cargar la publicación.')
        })
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          {error || 'El equipo buscado no existe.'}
        </Alert>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => router.push('/tienda/kit-drones')}>
          Volver a la tienda
        </Button>
      </Container>
    )
  }

  const {
    title,
    priceCop,
    images,
    brand,
    condition,
    description,
    sellerName,
    sellerPhone,
    category,
    status
  } = product

  const conditionObj = USED_CONDITIONS.find((c) => c.key === condition)

  const getWhatsAppLink = () => {
    const cleanPhone = (sellerPhone || '').replace(/\D/g, '')
    const phoneWithCountry = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`
    const message = encodeURIComponent(
      `Hola ${sellerName}, vi tu anuncio de equipo usado "${title}" en Wavi Aeronautics por ${formatCopCurrency(priceCop)} y deseo obtener más detalles.`
    )
    return `https://api.whatsapp.com/send?phone=${phoneWithCountry}&text=${message}`
  }

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '90vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Inicio
          </Link>
          <Link href="/tienda/kit-drones" style={{ textDecoration: 'none', color: 'inherit' }}>
            Tienda
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          {/* Product Image Gallery */}
          <Grid item xs={12} md={7}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3, backgroundColor: '#fff' }}>
              <Box
                component="img"
                src={images?.[selectedImage] || '/static/images/drone-placeholder.jpg'}
                alt={title}
                sx={{
                  width: '100%',
                  height: { xs: 300, sm: 420 },
                  objectFit: 'contain',
                  borderRadius: 2
                }}
              />

              {/* Thumbnails */}
              {images?.length > 1 && (
                <Stack direction="row" spacing={2} sx={{ mt: 2, overflowX: 'auto', pb: 1 }}>
                  {images.map((imgUrl, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={imgUrl}
                      alt={`Thumbnail ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: selectedImage === index ? '3px solid #ff9800' : '1px solid #ddd',
                        opacity: selectedImage === index ? 1 : 0.7,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>

          {/* Product & Seller Details */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label="SEGUNDA MANO" color="warning" sx={{ fontWeight: 800, fontSize: '0.75rem' }} />
                {status === USED_STATUS.VERIFIED && (
                  <Chip icon={<VerifiedUserIcon />} label="Verificado por Wavi" color="success" sx={{ fontWeight: 700 }} />
                )}
              </Stack>

              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.2 }}>
                {title}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                Categoría: {category} | Marca: {brand || 'Genérica'}
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', my: 2 }}>
                {formatCopCurrency(priceCop)}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">Estado del equipo:</Typography>
                <Chip
                  label={conditionObj?.label || condition}
                  variant="outlined"
                  sx={{ mt: 0.5, fontWeight: 700, borderColor: '#ff9800', color: '#e65100' }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Seller Info Box */}
              <Box sx={{ p: 2, backgroundColor: '#f0f7ff', borderRadius: 2, mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Información del Vendedor
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {sellerName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Contacto directo vía WhatsApp
                </Typography>
              </Box>

              {/* WhatsApp CTA */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<WhatsAppIcon sx={{ fontSize: 28 }} />}
                component="a"
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  backgroundColor: '#25D366',
                  color: '#fff',
                  fontWeight: 800,
                  py: 1.8,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: '#1ebd59'
                  }
                }}
              >
                Contactar al Vendedor
              </Button>
            </Paper>
          </Grid>

          {/* Description Section */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3, mt: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Descripción del Producto
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                {description}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default withRoot(UsedProductDetailPage)
