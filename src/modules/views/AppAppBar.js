import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { signOut } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { sharingInformationService } from '@/services/sharing-information'
// let displayName = user.displayName
// let email = user.email
// var emailVerified = user.emailVerified
// var uid = user.uid
import { auth } from '@/firebase/firebaseClient' // currentUser
import AppBar from '../components/AppBar'
import theme from '../theme'
import withRoot from '../withRoot'
// import clsx from 'clsx'
// import WaviPixelLogo from "public/static/img/WaviPixelLogo.png";
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
  marginRight: '1em'
}))

const styles = (theme) => ({
  title: {
    fontSize: 24,
    flex: 1
  },
  image: {
    marginRight: '1em',
    height: 48,
    width: 48,
    borderRadius: '50%'
  },
  placeholder: {
    height: 64,
    [theme.breakpoints.up('sm')]: {
      height: 70
    }
  },
  left: {
    flex: 1
  },
  leftLinkActive: {
    color: theme.palette.common.white // "#00aCe4",
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    maxWidth: '360px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      justifyContent: 'center'
    }
  },
  link: {
    fontSize: '21px',
    textDecoration: 'none',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px !important'
    }
  },
  linkSecondary: {
    color: theme.palette.secondary.main // "#00aCe4",
  }
})

function AppAppBar (props) {
  // const { theme } = props;
  const classes = styles(theme)
  let user = {}
  const currentUser = sharingInformationService.getSubject()
  useEffect(() => {
    currentUser.subscribe((data) => {
      if (data) {
        const { currentUser } = data
        console.log('currentUser', currentUser, data)
        if (currentUser) {
          user = currentUser
        }
      }
    })
  }, [])
  // const user = auth.currentUser || currentUser || {};
  const userID = user.uid || null
  const [userAuth, setUserAuth] = useState(false)
  console.log('isUserAuth?', currentUser, user)
  useEffect(() => {
    if (user && userID) {
      setUserAuth(true)
      console.log('userAuth', user, userAuth)
    }
    console.log('noUserAuth', user, userAuth)
  }, [user])

  const handleSignOut = (e) => {
    e.preventDefault()
    signOut(auth)
      .then(() => {
        setUserAuth(false)
        localStorage.clear()
        alert('Cerro su sesión de manera exitosa!')
        console.log(auth.currentUser)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <Box>
      <AppBar
        position="fixed"
        className="main-bar navlink"
        style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
      >
        <StyledToolbar>
          <Box sx={classes.left}>
            <Link
              href="/"
              variant="h6"
              underline="none"
              color="inherit"
              sx={classes.link}
              style={{
                alignItems: 'center',
                display: 'flex',
                fontSize: '1.6rem',
                color: 'white',
                textDecoration: 'none'
              }}
              // activeClassName="active"
            >
              <Box
                component="img"
                sx={classes.image}
                src={WaviPixelLogo}
                alt="logo Wavi Aeronautics"
              />
              {'Wavi Aeronautics'}
            </Link>
          </Box>
        </StyledToolbar>
        <Box sx={classes.right} sm={12} xs={12}>
          <StyledNavLink
            sx={classes.link}
            color="inherit"
            variant="h6"
            underline="none"
            href="/tienda/kit-drones"
          >
            {'Tienda'} <ShoppingCartIcon fontSize="large" />
          </StyledNavLink>
          <StyledNavLink
            sx={classes.link}
            color="inherit"
            variant="h6"
            underline="none"
            href="/blog"
          >
            {'Blog'}
          </StyledNavLink>
          {userAuth
            ? (
            <>
              <StyledNavLink
                sx={classes.link}
                variant="h6"
                underline="none"
                style={classes.linkSecondary}
                onClick={(e) => handleSignOut(e)}
                href="/"
              >
                {'Cerrar Sesión'} <LogoutIcon />
              </StyledNavLink>
            </>
              )
            : (
            <>
              <StyledNavLink
                sx={classes.link}
                color="inherit"
                variant="h6"
                underline="none"
                href="auth/sign-in/"
              >
                {'Iniciar sesión'} <LoginIcon />
              </StyledNavLink>
            </>
              )}
        </Box>
      </AppBar>
      <Box sx={classes.placeholder} />
    </Box>
  )
}

AppAppBar.propTypes = {}

export default withRoot(AppAppBar)
