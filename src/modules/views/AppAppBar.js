import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import React from 'react'
import Link from 'next/link'
import AppBar from '../components/AppBar'
import theme from '../theme'
import withRoot from '../withRoot'
import UserDropdown from '@/app/components/UserDropdown'
import Typography from '@mui/material/Typography'

const WaviPixelLogo =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FWaviPixelLogo.png?alt=media&token=7edcec69-8b24-4b95-b970-6b9acfddbdeb'

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  height: 64,
  justifyContent: 'space-between',
  [theme.breakpoints.up('sm')]: {
    height: 70
  }
}))

const StyledNavLink = styled(Link)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.common.white,
  marginRight: '1em',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.secondary.main
  }
}))

const styles = (theme) => ({
  root: {
    // flexGrow: 1
  },
  left: {
    flex: 1
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  link: {
    fontSize: '21px',
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px'
    }
  },
  placeholder: {
    height: 64,
    [theme.breakpoints.up('sm')]: {
      height: 70
    }
  }
})

function AppAppBar(props) {
  const classes = styles(theme)
  
  return (
    <Box sx={classes.root}>
      <AppBar position="fixed">
        <StyledToolbar>
          <Box sx={classes.left}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <Box
                component="img"
                src={WaviPixelLogo}
                alt="Wavi Aeronautics"
                sx={{ height: 48, width: 48, marginRight: 2, borderRadius: '50%' }}
              />
              <Typography variant="h6" sx={classes.link}>
                Wavi Aeronautics
              </Typography>
            </Link>
          </Box>

          <Box sx={classes.right}>
            <StyledNavLink href="/tienda/kit-drones">
              Tienda <ShoppingCartIcon sx={{ ml: 1 }} />
            </StyledNavLink>
            <StyledNavLink href="/blog">
              Blog
            </StyledNavLink>

            <UserDropdown />
          </Box>
        </StyledToolbar>
      </AppBar>
      <Box sx={classes.placeholder} />
    </Box>
  )
}

AppAppBar.propTypes = {}

export default withRoot(AppAppBar)
