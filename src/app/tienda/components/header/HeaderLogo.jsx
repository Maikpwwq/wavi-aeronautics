'use client'
import React from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'

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
    marginRight: '30px',
    height: 48,
    width: 48
  }
}

const HeaderLogo = () => {
  return (
    <AppBar color="primary" position="sticky" elevation={0}>
      <Toolbar>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
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
          <Grid item xs />
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default HeaderLogo
