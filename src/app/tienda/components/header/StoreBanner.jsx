'use client'
import React, { useContext } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import SchoolIcon from '@mui/icons-material/School'
import ArticleIcon from '@mui/icons-material/Article'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import { formatCurrency } from '@/utilities/priceUtils'
import ShoppingCart from '@/app/tienda/components/ShoppingCart'
import UserDropdown from '@/app/components/UserDropdown'

const styles = {
  secondaryBar: {
    zIndex: 10,
    position: 'relative'
  }
}

const StoreBanner = () => {
  const { shoppingCart, updateShowCart } = useContext(ShowCartContext)
  const cartItemCount = shoppingCart?.items || 0
  const cartTotal = shoppingCart?.suma || 0

  return (
    <AppBar
      component="div"
      style={styles.secondaryBar}
      color="primary"
      position="static"
      elevation={0}
    >
      <Toolbar
        sx={{
          px: { xs: 1.25, sm: 2, md: 3 },
          minHeight: { xs: 46, sm: 52, md: 60 },
          py: { xs: 0.4, md: 0.8 }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: { xs: 0.75, sm: 1.5 }
          }}
        >
          {/* Desktop Left: Promotional Shipping Message */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography
              color="inherit"
              variant="h5"
              component="h1"
              sx={{ fontSize: { sm: '1.15rem', md: '1.35rem' } }}
            >
              <span style={{ fontWeight: 'bold' }}>Para lo mejor en equipos FPV y Drones</span>
            </Typography>
            <Typography
              color="inherit"
              variant="body1"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontSize: { sm: '0.85rem', md: '0.95rem' }
              }}
            >
              <LocalShippingIcon sx={{ marginRight: '0.75rem', fontSize: { sm: '1.1rem', md: '1.35rem' } }} /> Envíos gratis a toda Colombia!
            </Typography>
          </Box>

          {/* Mobile Left: Escuela & Blog Buttons (Unified on the same row as Cart/User summary) */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: { xs: 0.75, sm: 1 },
              flexShrink: 0
            }}
          >
            {/* Escuela Button */}
            <Button
              component={Link}
              href="/escuela"
              variant="outlined"
              size="small"
              startIcon={<SchoolIcon sx={{ fontSize: { xs: 15, sm: 17 } }} />}
              sx={{
                color: '#ff6f00',
                borderColor: 'rgba(255, 111, 0, 0.6)',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                px: { xs: 1, sm: 1.5 },
                py: { xs: 0.35, sm: 0.5 },
                fontSize: { xs: '0.75rem', sm: '0.82rem' },
                lineHeight: 1.2,
                minWidth: 'auto',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#ff6f00',
                  bgcolor: 'rgba(255, 111, 0, 0.15)',
                  color: '#ffffff'
                }
              }}
            >
              Escuela
            </Button>

            {/* Blog Button */}
            <Button
              component={Link}
              href="/blog"
              variant="outlined"
              size="small"
              startIcon={<ArticleIcon sx={{ fontSize: { xs: 15, sm: 17 } }} />}
              sx={{
                color: '#00aCe4',
                borderColor: 'rgba(0, 172, 228, 0.6)',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                px: { xs: 1, sm: 1.5 },
                py: { xs: 0.35, sm: 0.5 },
                fontSize: { xs: '0.75rem', sm: '0.82rem' },
                lineHeight: 1.2,
                minWidth: 'auto',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#00aCe4',
                  bgcolor: 'rgba(0, 172, 228, 0.15)',
                  color: '#ffffff'
                }
              }}
            >
              Blog
            </Button>
          </Box>

          {/* Right: Cart Summary ($ COP + Icon) & User Login */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.75, sm: 1.25 },
              flexShrink: 0
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'inherit',
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.875rem' }
              }}
            >
              {formatCurrency(cartTotal)} COP
            </Typography>

            <Tooltip title="Carrito de compras">
              <IconButton
                onClick={() => updateShowCart(!shoppingCart.show)}
                aria-label="Abrir carrito de compras"
                sx={{
                  color: '#00aCe4',
                  position: 'relative',
                  p: { xs: 0.5, sm: 0.75, md: 1 },
                  '&:hover': {
                    bgcolor: 'rgba(0, 172, 228, 0.12)'
                  }
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: { xs: 34, sm: 38, md: 44 } }} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '41%',
                    left: '53%',
                    transform: 'translate(-50%, -50%)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: { xs: '0.65rem', sm: '0.72rem', md: '0.75rem' },
                    lineHeight: 1,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.6)'
                  }}
                >
                  {cartItemCount}
                </Box>
              </IconButton>
            </Tooltip>

            <UserDropdown showLoginLabel={false} />
          </Box>
        </Box>
        <ShoppingCart />
      </Toolbar>
    </AppBar>
  )
}

export default StoreBanner
