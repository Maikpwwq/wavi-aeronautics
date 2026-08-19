'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

import FavoriteIcon from '@mui/icons-material/Favorite'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'
import withRoot from '@/modules/withRoot'
import { useFavorites } from '@/app/providers/FavoritesProvider'
import { calculateCopPrice } from '@/utilities/priceUtils'
import AddProduct from '@/app/tienda/components/AddProduct'

function FavoritosPage() {
  const user = useSelector((state) => state.user)
  const { favorites, toggleFavorite, loading } = useFavorites()
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  const handleRemoveFavorite = async (item) => {
    try {
      await toggleFavorite(item)
      setSnackbar({
        open: true,
        message: 'Producto eliminado de tus favoritos',
        severity: 'info'
      })
    } catch (err) {
      console.error('Error removing favorite:', err)
      setSnackbar({
        open: true,
        message: 'No se pudo eliminar de favoritos',
        severity: 'error'
      })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <AppAppBar />

      <Container maxWidth="lg" sx={{ mt: 5, mb: 8, flex: 1 }}>
        {/* Header Title */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: 'rgba(233, 30, 99, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e91e63'
              }}
            >
              <FavoriteIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Mis Favoritos
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Guarda los productos que más te gustan y cómpralos cuando quieras
              </Typography>
            </Box>
          </Box>

          {favorites.length > 0 && (
            <Chip
              label={`${favorites.length} ${favorites.length === 1 ? 'producto guardado' : 'productos guardados'}`}
              sx={{
                fontWeight: 700,
                bgcolor: 'rgba(0, 172, 228, 0.1)',
                color: '#00aCe4',
                border: '1px solid rgba(0, 172, 228, 0.3)'
              }}
            />
          )}
        </Box>

        {/* Not Logged In State */}
        {!user?.uid && !loading ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff'
            }}
          >
            <FavoriteIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Inicia sesión para ver tus favoritos
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 460, mx: 'auto', mb: 3 }}>
              Crea tu lista de deseos personalizada y accede a ella desde cualquier dispositivo.
            </Typography>
            <Button
              component={Link}
              href="/auth/sign-in"
              variant="contained"
              color="primary"
              sx={{ px: 4, py: 1.25, borderRadius: 2.5, fontWeight: 700, textTransform: 'none' }}
            >
              Iniciar Sesión
            </Button>
          </Paper>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#00aCe4' }} />
          </Box>
        ) : favorites.length === 0 ? (
          /* Empty State */
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              textAlign: 'center',
              borderRadius: 4,
              border: '1px dashed #cbd5e1',
              bgcolor: '#ffffff'
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'rgba(233, 30, 99, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                color: '#e91e63'
              }}
            >
              <FavoriteIcon sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Tu lista de favoritos está vacía
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 440, mx: 'auto', mb: 3 }}>
              Explora nuestra tienda y haz clic en el icono de corazón en cualquier dron o accesorio para guardarlo aquí.
            </Typography>
            <Button
              component={Link}
              href="/tienda/kit-drones"
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 3.5, py: 1.25, borderRadius: 2.5, fontWeight: 700, textTransform: 'none' }}
            >
              Explorar Tienda
            </Button>
          </Paper>
        ) : (
          /* Favorites Grid */
          <Grid container spacing={3}>
            {favorites.map((item) => {
              const productId = item.productId || item.id
              const displayPrice = item.price
                ? calculateCopPrice(item.price)
                : typeof item.precio === 'string'
                ? item.precio
                : item.precio
                ? `$ ${Number(item.precio).toLocaleString()}`
                : '$ 0'

              const detailUrl = `/tienda/producto?id=${encodeURIComponent(productId)}&category=${encodeURIComponent(
                item.category || 'tienda'
              )}&marca=${encodeURIComponent(item.brand || 'Aeronautics')}`

              return (
                <Grid item xs={12} sm={6} md={4} key={productId}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3.5,
                      border: '1px solid #e2e8f0',
                      bgcolor: '#ffffff',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                        borderColor: '#00aCe4'
                      }
                    }}
                  >
                    {/* Delete Favorite Action */}
                    <Tooltip title="Eliminar de favoritos" arrow>
                      <IconButton
                        onClick={() => handleRemoveFavorite(item)}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          zIndex: 3,
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          color: '#ef4444',
                          backdropFilter: 'blur(4px)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          '&:hover': {
                            bgcolor: '#ef4444',
                            color: '#ffffff'
                          }
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* Image Area */}
                    <Box
                      component={Link}
                      href={detailUrl}
                      sx={{
                        position: 'relative',
                        pt: '70%',
                        bgcolor: '#ffffff',
                        display: 'block',
                        overflow: 'hidden'
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={item.firstImage || (Array.isArray(item.images) ? item.images[0] : '') || '/static/img/Portada-DJI-Mavic-Air-2.png'}
                        alt={item.name}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          p: 2.5
                        }}
                      />
                    </Box>

                    {/* Card Content */}
                    <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#00aCe4',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5
                          }}
                        >
                          {item.brand || 'Wavi Aeronautics'}
                        </Typography>

                        <Typography
                          component={Link}
                          href={detailUrl}
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: '#1e293b',
                            textDecoration: 'none',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.3,
                            mt: 0.5,
                            mb: 1,
                            '&:hover': { color: '#00aCe4' }
                          }}
                        >
                          {item.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                            {displayPrice}
                          </Typography>
                          {item.availability === false && (
                            <Chip
                              label="Agotado"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                fontWeight: 800
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      {/* Card Actions */}
                      <Box sx={{ display: 'flex', gap: 1, pt: 1, borderTop: '1px solid #f1f5f9' }}>
                        <Button
                          component={Link}
                          href={detailUrl}
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                            borderColor: '#cbd5e1',
                            color: '#475569',
                            '&:hover': {
                              borderColor: '#00aCe4',
                              color: '#00aCe4',
                              bgcolor: 'rgba(0, 172, 228, 0.05)'
                            }
                          }}
                        >
                          Ver Detalle
                        </Button>

                        <Box sx={{ flex: 1 }}>
                          <AddProduct product={item} disabled={item.availability === false} variant="button" />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}
      </Container>

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

      <AppFooter />
    </Box>
  )
}

export default withRoot(FavoritosPage)
