'use client'

import React from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import ArticleIcon from '@mui/icons-material/Article'

import SearchBar from './SearchBar'

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
    <AppBar color="primary" position="sticky" elevation={0}>
      <Toolbar sx={{ py: 1, px: { xs: 1, sm: 2 } }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Grid item xs={12} sm={4} md={3} lg={3}>
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
          </Grid>

          {/* Search Bar */}
          <Grid item xs={12} sm={8} md={5} lg={6}>
            <SearchBar />
          </Grid>

          {/* Social Icons & Blog Button */}
          <Grid
            item
            xs={12}
            md={4}
            lg={3}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-end' },
              gap: 1
            }}
          >
            {/* WhatsApp */}
            <Tooltip title="Contacto WhatsApp">
              <IconButton
                component="a"
                href="https://api.whatsapp.com/send?phone=573204842897"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    color: '#25D366',
                    transform: 'translateY(-2px) scale(1.1)',
                    bgcolor: 'rgba(37, 211, 102, 0.15)'
                  }
                }}
              >
                <WhatsAppIcon />
              </IconButton>
            </Tooltip>

            {/* Instagram */}
            <Tooltip title="Instagram @wavi.aeronautics">
              <IconButton
                component="a"
                href="https://www.instagram.com/wavi.aeronautics/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    color: '#E1306C',
                    transform: 'translateY(-2px) scale(1.1)',
                    bgcolor: 'rgba(225, 48, 108, 0.15)'
                  }
                }}
              >
                <InstagramIcon />
              </IconButton>
            </Tooltip>

            {/* Facebook */}
            <Tooltip title="Facebook @wavi.aeronautics">
              <IconButton
                component="a"
                href="https://www.facebook.com/wavi.aeronautics/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    color: '#1877F2',
                    transform: 'translateY(-2px) scale(1.1)',
                    bgcolor: 'rgba(24, 119, 242, 0.15)'
                  }
                }}
              >
                <FacebookIcon />
              </IconButton>
            </Tooltip>

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
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default HeaderLogo
