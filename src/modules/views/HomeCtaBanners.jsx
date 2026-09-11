'use client'

import React, { useContext } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

import { useFavorites } from '@/app/providers/FavoritesProvider'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import { formatCurrency } from '@/utilities/priceUtils'

const DEFAULT_FALLBACK_DRONE =
  'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80'

export default function HomeCtaBanners() {
  const { favorites } = useFavorites()
  const { shoppingCart } = useContext(ShowCartContext)

  const hasFavorites = Array.isArray(favorites) && favorites.length > 0
  const cartProducts = shoppingCart?.productos || []
  const cartItemCount = Number(shoppingCart?.items) || cartProducts.length
  const cartTotal = Number(shoppingCart?.suma) || 0
  const hasCart = cartItemCount > 0

  // If neither condition is met, render nothing (zero DOM footprint)
  if (!hasFavorites && !hasCart) {
    return null
  }

  // Determine if single module is active for 100% full-width fallback
  const isBothActive = hasFavorites && hasCart

  // Resolve visual asset for Favorites module
  const favoriteSample = hasFavorites ? favorites[0] : null
  const favoriteImage =
    favoriteSample?.firstImage ||
    (Array.isArray(favoriteSample?.images) ? favoriteSample.images[0] : null) ||
    DEFAULT_FALLBACK_DRONE

  // Resolve visual asset for Cart module
  const cartSample = hasCart ? cartProducts[0] : null
  const cartImage =
    cartSample?.firstImage ||
    (Array.isArray(cartSample?.images) ? cartSample.images[0] : null) ||
    DEFAULT_FALLBACK_DRONE

  return (
    <Box
      component="section"
      aria-label="Acciones rápidas de usuario"
      sx={{
        py: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3, md: 4 },
        maxWidth: 1360,
        mx: 'auto',
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: isBothActive ? 'repeat(2, 1fr)' : '1fr'
          },
          gap: { xs: 2.5, sm: 3 }
        }}
      >
        {/* ── MODULE 1: Llévate tu favorito ── */}
        {hasFavorites && (
          <Box
            sx={{
              position: 'relative',
              borderRadius: { xs: 3, sm: 4 },
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #16192b 0%, #0f172a 100%)',
              border: '1px solid rgba(233, 30, 99, 0.25)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: isBothActive ? 'column' : 'row',
                md: isBothActive ? 'row' : 'row'
              },
              alignItems: 'stretch',
              '&:hover': {
                transform: 'translateY(-3px)',
                borderColor: 'rgba(233, 30, 99, 0.5)',
                boxShadow: '0 12px 36px rgba(233, 30, 99, 0.2)'
              }
            }}
          >
            {/* Left/Main Content Block */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 3, sm: 3.5, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                zIndex: 2
              }}
            >
              <Box>
                {/* Header Badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Chip
                    icon={<FavoriteIcon sx={{ fontSize: '1rem !important', color: '#ff4081' }} />}
                    label={`${favorites.length} ${
                      favorites.length === 1 ? 'producto guardado' : 'productos guardados'
                    }`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(233, 30, 99, 0.15)',
                      color: '#ff80ab',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      letterSpacing: '0.3px',
                      border: '1px solid rgba(233, 30, 99, 0.3)'
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    Tu lista de deseos
                  </Typography>
                </Box>

                {/* Headline */}
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    color: '#ffffff',
                    fontSize: { xs: '1.25rem', sm: '1.45rem', md: '1.6rem' },
                    lineHeight: 1.25,
                    mb: 1
                  }}
                >
                  ¡Llévate tu favorito!
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#cbd5e1',
                    fontSize: { xs: '0.85rem', sm: '0.92rem' },
                    lineHeight: 1.5,
                    mb: 3,
                    maxWidth: 460
                  }}
                >
                  Tienes artículos de alto rendimiento reservados en tu lista. Cómpralos antes de
                  que se agoten las existencias.
                </Typography>
              </Box>

              {/* Action Button */}
              <Box sx={{ pt: 1 }}>
                <Button
                  component={Link}
                  href="/favoritos"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#e91e63',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    borderRadius: 2.5,
                    px: 3,
                    py: 1,
                    boxShadow: '0 4px 16px rgba(233, 30, 99, 0.4)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      bgcolor: '#d81b60',
                      boxShadow: '0 6px 20px rgba(233, 30, 99, 0.6)',
                      transform: 'translateX(2px)'
                    }
                  }}
                >
                  Ver mis favoritos
                </Button>
              </Box>
            </Box>

            {/* Visual Asset Block */}
            <Box
              sx={{
                width: {
                  xs: '100%',
                  sm: isBothActive ? '100%' : '35%',
                  md: isBothActive ? '38%' : '35%'
                },
                minHeight: { xs: 160, sm: isBothActive ? 160 : 'auto' },
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.35)'
              }}
            >
              <Box
                component="img"
                src={favoriteImage}
                alt={favoriteSample?.name || 'Producto favorito'}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.9)',
                  transition: 'transform 0.4s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: {
                    xs: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 60%)',
                    md: 'linear-gradient(to right, rgba(15, 23, 42, 0.7) 0%, transparent 50%)'
                  }
                }}
              />
            </Box>
          </Box>
        )}

        {/* ── MODULE 2: Compra tu carrito ── */}
        {hasCart && (
          <Box
            sx={{
              position: 'relative',
              borderRadius: { xs: 3, sm: 4 },
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #091a2e 0%, #0f172a 100%)',
              border: '1px solid rgba(0, 172, 228, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: isBothActive ? 'column' : 'row',
                md: isBothActive ? 'row' : 'row'
              },
              alignItems: 'stretch',
              '&:hover': {
                transform: 'translateY(-3px)',
                borderColor: 'rgba(0, 172, 228, 0.6)',
                boxShadow: '0 12px 36px rgba(0, 172, 228, 0.25)'
              }
            }}
          >
            {/* Left/Main Content Block */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 3, sm: 3.5, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                zIndex: 2
              }}
            >
              <Box>
                {/* Header Badges */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                  <Chip
                    icon={<ShoppingCartIcon sx={{ fontSize: '1rem !important', color: '#00aCe4' }} />}
                    label={`${cartItemCount} ${cartItemCount === 1 ? 'producto listo' : 'productos listos'}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0, 172, 228, 0.15)',
                      color: '#38bdf8',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      letterSpacing: '0.3px',
                      border: '1px solid rgba(0, 172, 228, 0.35)'
                    }}
                  />
                  {cartTotal > 0 && (
                    <Chip
                      label={`${formatCurrency(cartTotal)} COP`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                        color: '#f8fafc',
                        fontWeight: 700,
                        fontSize: '0.75rem'
                      }}
                    />
                  )}
                </Box>

                {/* Headline */}
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 800,
                    color: '#ffffff',
                    fontSize: { xs: '1.25rem', sm: '1.45rem', md: '1.6rem' },
                    lineHeight: 1.25,
                    mb: 1
                  }}
                >
                  Compra tu carrito
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#cbd5e1',
                    fontSize: { xs: '0.85rem', sm: '0.92rem' },
                    lineHeight: 1.5,
                    mb: 3,
                    maxWidth: 460
                  }}
                >
                  Tus equipos y accesorios seleccionados están listos para despachar con envíos
                  asegurados a toda Colombia.
                </Typography>
              </Box>

              {/* Action Button & Perks */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  pt: 1
                }}
              >
                <Button
                  component={Link}
                  href="/tienda/ver-carrito"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: '#00aCe4',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    borderRadius: 2.5,
                    px: 3,
                    py: 1,
                    boxShadow: '0 4px 16px rgba(0, 172, 228, 0.4)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      bgcolor: '#0284c7',
                      boxShadow: '0 6px 20px rgba(0, 172, 228, 0.6)',
                      transform: 'translateX(2px)'
                    }
                  }}
                >
                  Ir al carrito
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#94a3b8' }}>
                  <LocalShippingIcon sx={{ fontSize: 18, color: '#00aCe4' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.78rem' }}>
                    Envíos asegurados
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Visual Asset Block */}
            <Box
              sx={{
                width: {
                  xs: '100%',
                  sm: isBothActive ? '100%' : '35%',
                  md: isBothActive ? '38%' : '35%'
                },
                minHeight: { xs: 160, sm: isBothActive ? 160 : 'auto' },
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.35)'
              }}
            >
              <Box
                component="img"
                src={cartImage}
                alt={cartSample?.name || cartSample?.titulo || 'Producto en carrito'}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.9)',
                  transition: 'transform 0.4s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: {
                    xs: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 60%)',
                    md: 'linear-gradient(to right, rgba(15, 23, 42, 0.7) 0%, transparent 50%)'
                  }
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
