'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Divider, 
  Stack, 
  Paper,
  CircularProgress,
  Rating
} from '@mui/material'
import { motion } from 'framer-motion'
import { 
  Speed,
  Straighten,
  MonitorWeight,
  BatteryChargingFull,
  SettingsInputAntenna,
  Security,
  Favorite,
  FavoriteBorder,
  Star,
  ForumOutlined,
  LocalShippingOutlined,
  VerifiedUserOutlined,
  QuestionAnswerOutlined,
  CheckCircleOutline
} from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import { useFavorites } from '@/app/providers/FavoritesProvider'

// Services & Utilities
import { getProductById } from '@/services/sharedServices'
import { sharingInformationService } from '@/services/sharing-information'
import { fetchProductReviews, fetchProductQuestions } from '@/services/productInteractionService'

// Local imports
import { BRAND_COLORS } from '@/app/tienda/innerTheme'
import AddProduct from './AddProduct'
import ProductFeedbackSection from './ProductFeedbackSection'
import PageNavigation from './PageNavigation'
import { useProductPrice } from '@/app/tienda/hooks/useProductPrice'
import { 
  ProductPackageList, 
  ProductSpecsList, 
  SpecItem,
  QuantitySelector,
  BuyNowButton,
  RecommendedUses,
  ShippingDetailsModal,
  ProductGallery,
  ProductVariations,
  extractVariationGroups,
  parsePackageItems, 
  parseSpecifications 
} from './product-detail'

// =============================================================================
// STYLES
// =============================================================================
const styles = {
  actionInfo: {
    p: { xs: 2, sm: 3, md: 4 }, 
    maxWidth: '560px !important',
  },
  actionBox: {
    p: 3, 
    borderRadius: 4, 
    bgcolor: 'white', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.04)', 
    border: `1px solid ${BRAND_COLORS.border.light || '#f0f0f0'}`
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
    bgcolor: color === 'success' ? 'rgba(76, 175, 80, 0.1)' : color === 'error' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(0,0,0,0.05)',
    color: color === 'success' ? BRAND_COLORS.success : color === 'error' ? '#d32f2f' : 'inherit',
    border: `1px solid ${color === 'success' ? BRAND_COLORS.success : color === 'error' ? '#d32f2f' : '#ddd'}`
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchId = searchParams.get('id')
  const category = searchParams.get('category')
  const marca = searchParams.get('marca')

  const reduxProduct = useSelector((state) => state.product)
  const user = useSelector((state) => state.user)
  const { isFavorite, toggleFavorite } = useFavorites()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [shippingModalOpen, setShippingModalOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  // Variation selection state (replaces legacy selectedOptionIndex)
  const [selectedVariationsMap, setSelectedVariationsMap] = useState({})
  const [variationsList, setVariationsList] = useState([])
  const [allRequiredSelected, setAllRequiredSelected] = useState(true)
  const [showVariationValidation, setShowVariationValidation] = useState(false)

  // Dynamic social proof metrics
  const [reviewsCount, setReviewsCount] = useState(0)
  const [questionsCount, setQuestionsCount] = useState(0)
  const [averageRating, setAverageRating] = useState(5.0)

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

  // Fetch live reviews and questions counters if not aggregated on product
  useEffect(() => {
    if (!product) return

    if (product.reviewsCount !== undefined) {
      setReviewsCount(product.reviewsCount)
    }
    if (product.questionsCount !== undefined) {
      setQuestionsCount(product.questionsCount)
    }
    if (product.rating !== undefined) {
      setAverageRating(product.rating)
    }

    const pId = product.productID || product.id
    if (pId) {
      Promise.all([fetchProductReviews(pId), fetchProductQuestions(pId)])
        .then(([revs, questions]) => {
          if (product.reviewsCount === undefined) {
            setReviewsCount(revs.length)
          }
          if (revs.length > 0 && product.rating === undefined) {
            const avg = revs.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / revs.length
            setAverageRating(Number(avg.toFixed(1)))
          }
          if (product.questionsCount === undefined) {
            setQuestionsCount(questions.length)
          }
        })
        .catch((err) => console.error('Error fetching social proof metrics:', err))
    }
  }, [product])

  // ---------------------------------------------------------------------------
  // Memoized values & Attributes
  // ---------------------------------------------------------------------------
  const images = useMemo(() => {
    const imgs = product?.images || []
    return imgs.map(img => typeof img === 'string' ? img : img.url || '')
  }, [product])

  const parsedPackageItems = useMemo(() => parsePackageItems(product?.includes), [product])
  const parsedSpecifications = useMemo(() => parseSpecifications(product?.specifications), [product])

  // Stock & Availability
  const stock = useMemo(() => {
    if (!product) return 0
    if (typeof product.stock === 'number') return product.stock
    return product.availability !== false ? 99 : 0
  }, [product])

  const isOutOfStock = stock <= 0 || product?.availability === false

  // Dynamic price computation via useProductPrice hook
  const { displayPrice, totalPriceDisplay } = useProductPrice(product, variationsList, quantity)

  // Variation groups (extracted from product)
  const variationGroups = useMemo(() => extractVariationGroups(product), [product])
  const hasVariations = variationGroups.length > 0

  // Variation change handler
  const handleVariationChange = (updatedMap, selectedList, allSelected) => {
    setSelectedVariationsMap(updatedMap)
    setVariationsList(selectedList)
    setAllRequiredSelected(allSelected)
    if (allSelected) setShowVariationValidation(false)
  }

  // Product SKU & Warranty
  const sku = product?.sku || product?.productID || 'N/A'
  const warrantyInfo = product?.warrantyInfo || '6 meses directa oficial Wavi'

  // WhatsApp Deep Link URL
  const whatsappUrl = useMemo(() => {
    if (!product) return ''
    const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
    const message = `Hola Wavi Aeronautics, estoy interesado en el producto: ${product.name} (SKU: ${sku}). Enlace: ${currentUrl}`
    return `https://wa.me/573245464166?text=${encodeURIComponent(message)}`
  }, [product, sku])

  // Smooth scroll helper
  const scrollToFeedback = () => {
    const element = document.getElementById('product-feedback')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (loading || !product) return <LoadingSpinner />

  return (
    <Box sx={{ bgcolor: BRAND_COLORS.background.page, minHeight: '100vh', pb: { xs: 16, lg: 10 } }}>
      <Container maxWidth="xl">
        {/* Navigation / Breadcrumbs */}
        <PageNavigation category={category} currentPage={product.name} />

        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Left Column (7 cols on lg): Vertical Thumbnails + Main Display Gallery */}
          <Grid item xs={12} lg={7}>
            <ProductGallery
              images={images}
              productName={product.name}
              videoUrl={product.video}
            />
          </Grid>

          {/* Right Column (5 cols on lg): Conversion & High-Impact Metadata */}
          <Grid item xs={12} lg={5} sx={styles.actionInfo}>
            <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              
              {/* 1. Brand & Title */}
              <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 2, color: BRAND_COLORS.primary }}>
                {product.brand || 'Aeronautics'}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: BRAND_COLORS.text.primary, fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' } }}>
                {product.name}
              </Typography>

              {/* 2. Social Proof Signals (Rating + Reviews + Q&A indicators) */}
              <Box
                onClick={scrollToFeedback}
                data-testid="social-proof-badges"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  mb: 2.5,
                  cursor: 'pointer',
                  p: 0.75,
                  borderRadius: 2,
                  width: 'fit-content',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(0, 172, 228, 0.08)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={averageRating} precision={0.5} readOnly size="small" sx={{ color: '#ffb300' }} />
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    {averageRating}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#00aCe4', fontWeight: 600 }}>
                    ({reviewsCount} {reviewsCount === 1 ? 'opinión' : 'opiniones'})
                  </Typography>
                </Box>

                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#cbd5e1' }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                  <QuestionAnswerOutlined sx={{ fontSize: 16, color: '#00aCe4' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#00aCe4' }}>
                    {questionsCount} {questionsCount === 1 ? 'pregunta técnica' : 'preguntas técnicas'}
                  </Typography>
                </Box>
              </Box>

              {/* Product Variations Selector (multi-group dynamic) */}
              {hasVariations && (
                <ProductVariations
                  product={product}
                  selectedVariations={selectedVariationsMap}
                  onVariationChange={handleVariationChange}
                  showValidation={showVariationValidation}
                />
              )}

              {/* 3. Price Summary + "Detalles" Shipping link */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="h4" sx={{ color: BRAND_COLORS.accent, fontWeight: 800, fontSize: { xs: '1.75rem', sm: '2rem' } }}>
                    {displayPrice}
                  </Typography>
                  {!isOutOfStock ? (
                    <Chip label="En Stock" color="success" />
                  ) : (
                    <Chip label="Agotado" color="error" />
                  )}
                </Box>

                <Button
                  size="small"
                  onClick={() => setShippingModalOpen(true)}
                  data-testid="shipping-details-link-btn"
                  sx={{
                    color: '#00aCe4',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    p: 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(0, 172, 228, 0.08)',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Detalles de envío
                </Button>
              </Box>

              {/* 4. Size Badge & Recommended Uses */}
              {product.size && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box
                    data-testid="product-size-badge"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      bgcolor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      fontSize: '0.8125rem',
                      fontWeight: 700
                    }}
                  >
                    <Straighten sx={{ fontSize: 16, color: '#00aCe4' }} />
                    <span>Tamaño: {product.size}</span>
                  </Box>
                </Box>
              )}

              <RecommendedUses uses={product.recommendedUses} />

              {/* 5. SKU & Warranty Data */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  py: 1.5,
                  my: 2,
                  borderTop: `1px solid ${BRAND_COLORS.border.light || '#f0f0f0'}`,
                  borderBottom: `1px solid ${BRAND_COLORS.border.light || '#f0f0f0'}`
                }}
              >
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                  <strong>SKU:</strong> {sku}
                </Typography>
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#cbd5e1' }} />
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                  <VerifiedUserOutlined sx={{ fontSize: 16, color: '#16a34a' }} />
                  <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 700 }}>
                    {warrantyInfo}
                  </Typography>
                </Box>
              </Box>

              {/* 6. Action Box: Quantity selector + Comprar Ahora / Agregar al Carrito / Heart */}
              <Box sx={styles.actionBox}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Recibe este producto en la puerta de tu casa con envío asegurado.
                </Typography>

                {/* Quantity and Favorite row */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                      Cantidad:
                    </Typography>
                    <QuantitySelector
                      quantity={quantity}
                      onQuantityChange={setQuantity}
                      maxStock={stock}
                      disabled={isOutOfStock}
                    />
                  </Box>

                  {/* Wishlist Heart Icon-Only Button with Tooltip */}
                  <Tooltip
                    title={isFavorite(product.productID || product.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    arrow
                  >
                    <IconButton
                      aria-label={isFavorite(product.productID || product.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                      data-testid="favorite-icon-button"
                      onClick={async () => {
                        if (!user?.uid) {
                          setSnackbar({
                            open: true,
                            message: 'Inicia sesión para guardar tus productos favoritos',
                            severity: 'warning'
                          })
                          return
                        }
                        try {
                          const currentlyFav = isFavorite(product.productID || product.id)
                          await toggleFavorite(product)
                          setSnackbar({
                            open: true,
                            message: currentlyFav ? 'Eliminado de tus favoritos' : '¡Guardado en tus favoritos!',
                            severity: 'success'
                          })
                        } catch (err) {
                          setSnackbar({
                            open: true,
                            message: 'Error al actualizar favoritos',
                            severity: 'error'
                          })
                        }
                      }}
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        border: '1.5px solid',
                        borderColor: isFavorite(product.productID || product.id)
                          ? '#d81b60'
                          : 'rgba(0, 172, 228, 0.4)',
                        bgcolor: isFavorite(product.productID || product.id)
                          ? 'rgba(216, 27, 96, 0.08)'
                          : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: isFavorite(product.productID || product.id)
                            ? 'rgba(216, 27, 96, 0.16)'
                            : 'rgba(0, 172, 228, 0.1)'
                        }
                      }}
                    >
                      {isFavorite(product.productID || product.id) ? (
                        <Favorite sx={{ color: '#d81b60', fontSize: 22 }} />
                      ) : (
                        <FavoriteBorder sx={{ color: '#00aCe4', fontSize: 22 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Primary Express CTA & Secondary Cart CTA */}
                <Stack spacing={1.5}>
                  <BuyNowButton
                    product={product}
                    selectedVariations={variationsList}
                    quantity={quantity}
                    disabled={isOutOfStock || (hasVariations && !allRequiredSelected)}
                    size="large"
                    fullWidth
                  />

                  <AddProduct
                    product={product}
                    selectedVariations={variationsList}
                    quantity={quantity}
                    variant="button"
                    disabled={isOutOfStock || (hasVariations && !allRequiredSelected)}
                  />
                </Stack>

                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: 'text.disabled' }}>
                  Pagos seguros vía MercadoPago & PSE
                </Typography>
              </Box>

              {/* 7. WhatsApp Sales Link, ENVÍOS 24 A 72H & National Shipping Benefit Card */}
              <Box sx={{ mt: 3 }}>
                <Stack direction="row" spacing={2.5} alignItems="center" flexWrap="wrap" sx={{ mb: 1.5 }}>
                  {/* Venta por WhatsApp matching reference icon */}
                  <Box
                    component="a"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="whatsapp-sales-link"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1.25,
                      textDecoration: 'none',
                      py: 0.5,
                      px: 1,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(0, 172, 228, 0.08)',
                        transform: 'translateX(2px)'
                      }
                    }}
                  >
                    <ForumOutlined sx={{ fontSize: 24, color: '#334155' }} />
                    <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0056b3' }}>
                      Venta por WhatsApp
                    </Typography>
                  </Box>

                  {/* Envíos a nivel nacional matching reference icon */}
                  <Box
                    onClick={() => setShippingModalOpen(true)}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      py: 0.5,
                      px: 1,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(0, 172, 228, 0.08)'
                      }
                    }}
                  >
                    <LocalShippingOutlined sx={{ fontSize: 24, color: '#334155' }} />
                    <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#0056b3' }}>
                      Envíos a nivel nacional
                    </Typography>
                  </Box>
                </Stack>

                {/* Benefit Box: Delivery Truck + ENVÍOS DE 24 A 72 HORAS */}
                <Paper
                  elevation={0}
                  data-testid="national-shipping-benefit-card"
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <LocalShippingOutlined sx={{ fontSize: 24, color: '#1e293b', flexShrink: 0, mt: 0.25 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.925rem', color: '#0f172a', lineHeight: 1.25 }}>
                        ENVÍOS DE 24 A 72 HORAS
                      </Typography>
                      <Typography sx={{ fontWeight: 400, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.35, mt: 0.25 }}>
                        Una vez confirmado el pago de su compra.
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    size="small"
                    onClick={() => setShippingModalOpen(true)}
                    sx={{
                      color: '#00aCe4',
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '0.85rem',
                      flexShrink: 0,
                      '&:hover': { bgcolor: 'rgba(0, 172, 228, 0.08)' }
                    }}
                  >
                    Detalles
                  </Button>
                </Paper>
              </Box>

              {/* Tags Section */}
              {product.tags && product.tags.length > 0 && (
                <Box sx={{ mt: 3, pt: 3, borderTop: `1px dashed ${BRAND_COLORS.border.light || '#e0e0e0'}` }}>
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

        {/* Section 3: Description & Technical Specs */}
        <Grid container spacing={6} sx={{ mt: 2 }}>
          <Grid item xs={12}>
             <Box component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 4 }}>
                  {product.description}
                </Typography>

                <Divider sx={{ mb: 4 }} />

                {/* Tech Specs */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Especificaciones Técnicas
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={6}>
                    <SpecItem icon={MonitorWeight} label="Peso" value={product.peso || 'N/A'} />
                    <SpecItem icon={Straighten} label="Dimensiones" value={product.dimensiones || product.size || 'N/A'} />
                    <SpecItem icon={Speed} label="Rendimiento" value="Alto" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <SpecItem icon={BatteryChargingFull} label="Batería" value="LiPo Ready" />
                    <SpecItem icon={SettingsInputAntenna} label="Frecuencia" value="2.4GHz / 5.8GHz" />
                    <SpecItem icon={Security} label="Garantía" value={warrantyInfo} />
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

        {/* Additional Details: Package list & specs */}
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

        {/* Customer Reviews & Technical Questions Section Anchor */}
        <Box id="product-feedback" sx={{ scrollMarginTop: '80px' }}>
          <ProductFeedbackSection
            productId={product.productID || product.id}
            productName={product.name}
          />
        </Box>
      </Container>

      {/* Mobile Sticky Bottom Action Bar (< lg) */}
      <Box
        data-testid="mobile-sticky-action-bar"
        sx={{
          display: { xs: 'flex', lg: 'none' },
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid #e2e8f0',
          py: 1.5,
          px: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          boxShadow: '0 -6px 24px rgba(0, 0, 0, 0.08)'
        }}
      >
        <Box sx={{ minWidth: 90 }}>
          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', lineHeight: 1.1, fontWeight: 600 }}>
            Precio
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: BRAND_COLORS.accent, lineHeight: 1.2 }}>
            {displayPrice}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            maxStock={stock}
            disabled={isOutOfStock}
          />
          <BuyNowButton
            product={product}
            selectedVariations={variationsList}
            quantity={quantity}
            disabled={isOutOfStock || (hasVariations && !allRequiredSelected)}
            size="medium"
            fullWidth={false}
          />
        </Box>
      </Box>

      {/* Interactive Shipping Details Modal */}
      <ShippingDetailsModal
        open={shippingModalOpen}
        onClose={() => setShippingModalOpen(false)}
        shippingOptions={product.shippingOptions}
      />

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ProductDetail
