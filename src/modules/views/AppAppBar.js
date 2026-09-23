'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import MenuIcon from '@mui/icons-material/Menu'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import AppBar from '@/modules/components/AppBar'
import theme from '@/modules/theme'
import withRoot from '@/modules/withRoot'
import UserDropdown from '@/app/components/UserDropdown'
import SearchBar from '@/app/tienda/components/header/SearchBar'
import SocialContactIcons from '@/modules/components/SocialContactIcons'
import PseBadge from '@/modules/components/PseBadge'
import CategoriesMenuDialog from '@/modules/components/CategoriesMenuDialog'

const WHATSAPP_CONSULT_URL =
  'https://api.whatsapp.com/send?phone=573204842897&text=Hola%20Wavi%20Aeronautics%2C%20deseo%20asesor%C3%ADa%20experta%20personalizada'

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

function AppAppBar({ isHome: propIsHome }) {
  const pathname = usePathname()
  const isHome = propIsHome !== undefined ? propIsHome : (pathname === '/' || pathname === '')
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        elevation={isHome ? 0 : 4}
        sx={{
          bgcolor: 'primary.main',
          zIndex: 1200,
          boxShadow: isHome ? '0 4px 20px rgba(0,0,0,0.08)' : undefined
        }}
      >
        {/* ── Top Contact & Expert Advice Bar (Home) ── */}
        {isHome && (
          <Box
            sx={{
              bgcolor: '#09121f',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              px: { xs: 1.5, sm: 2.5, md: 3 },
              minHeight: { xs: 34, sm: 38 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1
            }}
          >
            {/* Left: Reusable Social & Contact Icons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SocialContactIcons size="small" spacing={0.5} color="rgba(255, 255, 255, 0.85)" />
            </Box>

            {/* Right: Expert Advice Message & "Pregunta ahora" Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#f1f5f9',
                  fontWeight: 600,
                  fontSize: { xs: '0.74rem', sm: '0.82rem' },
                  letterSpacing: '0.2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#22c55e',
                    boxShadow: '0 0 6px #22c55e',
                    display: 'inline-block'
                  }}
                />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Asesoría experta personalizada
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  Asesoría experta
                </Box>
              </Typography>

              <Button
                component="a"
                href={WHATSAPP_CONSULT_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                variant="contained"
                sx={{
                  bgcolor: '#00aCe4',
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', sm: '0.78rem' },
                  px: { xs: 1.2, sm: 1.75 },
                  py: 0.25,
                  borderRadius: '14px',
                  boxShadow: '0 2px 8px rgba(0, 172, 228, 0.35)',
                  lineHeight: 1.3,
                  minWidth: 'auto',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    bgcolor: '#0284c7',
                    boxShadow: '0 4px 14px rgba(0, 172, 228, 0.55)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Pregunta ahora
              </Button>
            </Box>
          </Box>
        )}

        {/* ── Main Navigation Toolbar ── */}
        <StyledToolbar>
          {/* ── Left: Brand & Logo ── */}
          <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1.5 } }}>
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

            {/* ── Main Categories Menu Button ── */}
            <Button
              onClick={() => setCategoriesOpen(true)}
              aria-label="Abrir menú de categorías"
              aria-haspopup="dialog"
              aria-expanded={categoriesOpen}
              startIcon={<MenuIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
              endIcon={
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: { xs: 16, sm: 18 },
                    transition: 'transform 0.2s ease',
                    transform: categoriesOpen ? 'rotate(180deg)' : 'none'
                  }}
                />
              }
              sx={{
                bgcolor: '#00aCe4',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                px: { xs: 1.25, sm: 1.75 },
                py: { xs: 0.75, sm: 0.85 },
                borderRadius: '8px',
                boxShadow: '0 2px 6px rgba(0, 172, 228, 0.35)',
                minWidth: 'auto',
                lineHeight: 1.3,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#0284c7',
                  boxShadow: '0 4px 12px rgba(0, 172, 228, 0.5)',
                  transform: 'translateY(-1px)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                }
              }}
            >
              Menú
            </Button>
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

            {/* PSE Payment Badge - Transparent & Optimized */}
            <PseBadge />
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

            <StyledNavLink href="/escuela" sx={{ display: { xs: 'none', md: 'flex' } }}>
              Escuela
            </StyledNavLink>

            <StyledNavLink href="/blog" sx={{ display: { xs: 'none', md: 'flex' } }}>
              Blog
            </StyledNavLink>

            <Box sx={{ ml: { xs: 0.5, sm: 1 } }}>
              <UserDropdown showLoginLabel={false} />
            </Box>
          </Box>
        </StyledToolbar>

        {/* ── Sub-Bar: Envíos gratis (Home - Minimalist White) ── */}
        {isHome && (
          <Box
            sx={{
              bgcolor: '#ffffff',
              color: '#0f172a',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 4px 14px -2px rgba(0, 0, 0, 0.06)',
              py: { xs: 0.65, sm: 0.8 },
              px: { xs: 1.5, sm: 3 },
              minHeight: { xs: 34, sm: 38 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s ease'
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: { xs: 0.75, sm: 1.25 }
              }}
            >
              <LocalShippingIcon
                sx={{
                  color: '#00aCe4',
                  fontSize: { xs: 18, sm: 22 },
                  filter: 'drop-shadow(0 1px 2px rgba(0, 172, 228, 0.25))'
                }}
              />
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.86rem' },
                  fontWeight: 700,
                  color: '#0f172a',
                  letterSpacing: '0.2px'
                }}
              >
                Envíos gratis a toda Colombia
              </Typography>

              <Typography
                component="span"
                sx={{
                  fontSize: { xs: '0.74rem', sm: '0.82rem' },
                  fontWeight: 500,
                  color: '#64748b',
                  display: { xs: 'none', sm: 'inline' }
                }}
              >
                — en compras superiores a
              </Typography>

              <Box
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  alignItems: 'center',
                  bgcolor: 'rgba(0, 172, 228, 0.08)',
                  color: '#0284c7',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  px: 1,
                  py: 0.25,
                  borderRadius: '12px',
                  letterSpacing: '0.4px',
                  ml: 0.5
                }}
              >
                $80.000
              </Box>
            </Box>
          </Box>
        )}
      </AppBar>
      {/* Spacer to prevent layout shift beneath fixed AppBar */}
      <Box sx={{ height: isHome ? { xs: 132, sm: 146 } : { xs: 64, sm: 70 } }} />

      {/* ── Main Categories Modal ── */}
      <CategoriesMenuDialog open={categoriesOpen} onClose={() => setCategoriesOpen(false)} />
    </Box>
  )
}

export default withRoot(AppAppBar)

