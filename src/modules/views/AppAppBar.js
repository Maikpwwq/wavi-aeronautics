'use client'

import React from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

import AppBar from '@/modules/components/AppBar'
import theme from '@/modules/theme'
import withRoot from '@/modules/withRoot'
import UserDropdown from '@/app/components/UserDropdown'
import SearchBar from '@/app/tienda/components/header/SearchBar'

const WaviPixelLogo =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FWaviPixelLogo.png?alt=media&token=7edcec69-8b24-4b95-b970-6b9acfddbdeb'

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  [theme.breakpoints.up('sm')]: {
    minHeight: 70,
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    gap: theme.spacing(2)
  }
}))

const StyledNavLink = styled(Link)(({ theme }) => ({
  fontSize: 15,
  fontWeight: 600,
  color: theme.palette.common.white,
  marginLeft: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  transition: 'color 0.2s ease, transform 0.2s ease',
  '&:hover': {
    color: theme.palette.secondary.main,
    transform: 'translateY(-1px)'
  }
}))

function AppAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={4} sx={{ bgcolor: 'primary.main', zIndex: 1200 }}>
        <StyledToolbar>
          {/* ── Left: Brand & Logo ── */}
          <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Box
                component="img"
                src={WaviPixelLogo}
                alt="Wavi Aeronautics"
                sx={{
                  height: { xs: 38, sm: 46 },
                  width: { xs: 38, sm: 46 },
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  transition: 'transform 0.25s ease',
                  '&:hover': {
                    transform: 'scale(1.06)'
                  }
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.35rem' },
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.5px',
                  display: { xs: 'none', md: 'block' },
                  whiteSpace: 'nowrap'
                }}
              >
                Wavi Aeronautics
              </Typography>
            </Link>
          </Box>

          {/* ── Center: SearchBar & PSE Logo ── */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 1, sm: 1.5 },
              maxWidth: { xs: '100%', sm: 520, md: 680, lg: 820 },
              mx: { xs: 0.5, sm: 1, md: 1.5 },
              minWidth: 0
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <SearchBar />
            </Box>

            {/* PSE Payment Badge - Enlarged and Seamless */}
            <Tooltip title="Pagos 100% Seguros con PSE y Mercado Pago" arrow placement="bottom">
              <Box
                component="div"
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#ffffff',
                  borderRadius: '10px',
                  px: 1.2,
                  py: 0.25,
                  height: 42,
                  width: { sm: 56, md: 66 },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.22)',
                  border: '1.5px solid rgba(255,255,255,0.6)',
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'scale(1.08)',
                    boxShadow: '0 4px 14px rgba(0, 172, 228, 0.45)',
                    borderColor: '#00aCe4'
                  }
                }}
              >
                <Box
                  component="img"
                  src="/logos/pse-logo.png"
                  alt="PSE Pagos Seguros en Línea"
                  sx={{
                    height: 34,
                    width: '100%',
                    display: 'block',
                    objectFit: 'contain'
                  }}
                />
              </Box>
            </Tooltip>
          </Box>

          {/* ── Right: Navigation Links & User ── */}
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: { xs: 0.5, sm: 1 }
            }}
          >
            <StyledNavLink href="/tienda/kit-drones">
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Tienda</Box>
              <ShoppingCartIcon sx={{ ml: { xs: 0, sm: 0.75 }, fontSize: { xs: 22, sm: 20 } }} />
            </StyledNavLink>

            <StyledNavLink href="/blog" sx={{ display: { xs: 'none', md: 'flex' } }}>
              Blog
            </StyledNavLink>

            <Box sx={{ ml: { xs: 0.5, sm: 1 } }}>
              <UserDropdown showLoginLabel={false} />
            </Box>
          </Box>
        </StyledToolbar>
      </AppBar>
      {/* Spacer to prevent layout shift beneath fixed AppBar */}
      <Box sx={{ height: { xs: 64, sm: 70 } }} />
    </Box>
  )
}

export default withRoot(AppAppBar)

