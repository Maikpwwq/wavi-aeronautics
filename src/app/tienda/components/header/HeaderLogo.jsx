'use client'

import React from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'

import ArticleIcon from '@mui/icons-material/Article'
import SchoolIcon from '@mui/icons-material/School'

import SearchBar from './SearchBar'
import SocialContactIcons from '@/modules/components/SocialContactIcons'
import PseBadge from '@/modules/components/PseBadge'

const WaviPixelLogo =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FWaviPixelLogo.png?alt=media&token=7edcec69-8b24-4b95-b970-6b9acfddbdeb'

const styles = {
  linkLogo: {
    textTransform: 'capitalize',
    flex: 1,
    textDecoration: 'none',
    alignItems: 'center',
    display: 'flex',
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#00aCe4'
  },
  image: {
    borderRadius: '50%',
    marginRight: '16px',
    height: 44,
    width: 44
  }
}

const HeaderLogo = () => {
  return (
    <AppBar color="primary" position="sticky" elevation={0} sx={{ zIndex: 1200 }}>
      <Toolbar sx={{ py: 1, px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: { xs: 1.5, md: 2 }
          }}
        >
          {/* Logo */}
          <Box sx={{ flexShrink: 0 }}>
            <Link
              href="/"
              variant="h6"
              underline="none"
              color="inherit"
              style={styles.linkLogo}
              sx={{
                '&:hover': {
                  color: 'common.white'
                }
              }}
            >
              <Box
                component="img"
                style={styles.image}
                src={WaviPixelLogo}
                alt="logo Wavi Aeronautics"
              />
              {'Wavi Aeronautics'}
            </Link>
          </Box>

          {/* Search Bar & PSE Badge - Expands across available desktop width */}
          <Box
            sx={{
              flexGrow: 1,
              width: '100%',
              mx: { md: 2, lg: 3 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 1, sm: 1.5 },
              minWidth: 0
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
              <SearchBar />
            </Box>
            <PseBadge />
          </Box>

          {/* Social Icons & Blog Button */}
          <Box
            sx={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-end' },
              gap: 0.5
            }}
          >
            {/* Social & Contact Icons */}
            <SocialContactIcons size="medium" />

            {/* Escuela Button */}
            <Button
              component={Link}
              href="/escuela"
              variant="outlined"
              startIcon={<SchoolIcon />}
              sx={{
                ml: 1,
                color: '#ff6f00',
                borderColor: 'rgba(255, 111, 0, 0.6)',
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 'bold',
                px: 2,
                py: 0.75,
                fontSize: '0.9rem',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  borderColor: '#ff6f00',
                  bgcolor: 'rgba(255, 111, 0, 0.15)',
                  color: '#ffffff',
                  boxShadow: '0 0 12px rgba(255, 111, 0, 0.3)',
                  transform: 'translateY(-1px)'
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
              startIcon={<ArticleIcon />}
              sx={{
                ml: 1,
                color: '#00aCe4',
                borderColor: 'rgba(0, 172, 228, 0.6)',
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 'bold',
                px: 2,
                py: 0.75,
                fontSize: '0.9rem',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  borderColor: '#00aCe4',
                  bgcolor: 'rgba(0, 172, 228, 0.15)',
                  color: '#ffffff',
                  boxShadow: '0 0 12px rgba(0, 172, 228, 0.3)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Blog
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default HeaderLogo
