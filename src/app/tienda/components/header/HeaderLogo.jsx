'use client'
import React from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'

import SearchBar from './SearchBar'

const WaviPixelLogo =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FWaviPixelLogo.png?alt=media&token=7edcec69-8b24-4b95-b970-6b9acfddbdeb'

const styles = {
  linkLogo: {
    // fontSize: 24,
    textTransform: 'capitalize',
    flex: 1,
    textDecoration: 'none',
    alignItems: 'center',
    display: 'flex',
    fontSize: '2rem',
    color: '#00aCe4'
  },
  image: {
    borderRadius: '50%',
    marginRight: '20px',
    height: 48,
    width: 48
  }
}

const HeaderLogo = () => {
  return (
    <AppBar color="primary" position="sticky" elevation={0}>
      <Toolbar sx={{ py: 1 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} sm={4} md={4}>
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

          {/* Center Search Bar */}
          <Grid item xs={12} sm={8} md={6} lg={5}>
            <SearchBar />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default HeaderLogo
