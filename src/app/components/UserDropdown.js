import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/firebaseClient'
import PersonIcon from '@mui/icons-material/Person'
import SecurityIcon from '@mui/icons-material/Security'
import ReceiptIcon from '@mui/icons-material/Receipt'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import theme from '@/modules/theme'

const styles = (theme) => ({
  avatar: {
    width: 40,
    height: 40,
    border: `2px solid ${theme.palette.secondary.main}`,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 0 10px ${theme.palette.secondary.main}`
    }
  },
  menuPaper: {
    backgroundColor: 'rgba(30, 30, 40, 0.9)', // Glassmorphism dark
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    borderRadius: '12px',
    marginTop: '10px',
    minWidth: '200px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
  },
  menuItem: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }
  },
  menuIcon: {
    color: theme.palette.secondary.main,
    minWidth: '36px'
  },
  logoutItem: {
    '&:hover': {
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      color: '#ff6b6b'
    }
  },
  loginLink: {
    display: 'flex',
    alignItems: 'center',
    color: 'inherit',
    textDecoration: 'none',
    fontSize: '16px',
    '&:hover': {
      color: theme.palette.secondary.main
    }
  }
})

const UserDropdown = ({ showLoginLabel = true }) => {
  const classes = styles(theme)
  const user = useSelector((state) => state.user)
  const userAuth = !!user
  
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = () => {
    handleMenuClose()
    signOut(auth).catch((error) => console.log(error))
  }

  // Get user initials or icon
  const getAvatarContent = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return <PersonIcon />
  }

  if (!userAuth) {
    return (
        <Box>
            {showLoginLabel ? (
                <Link href="/auth/sign-in/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box sx={classes.loginLink}>
                         Iniciar sesión <LoginIcon sx={{ ml: 1 }} />
                    </Box>
                </Link>
            ) : (
                <Tooltip title="Iniciar sesión">
                    <Link href="/auth/sign-in/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <IconButton size="small" sx={{ ml: 1 }}>
                            <LoginIcon sx={{ color: 'white' }} />
                        </IconButton>
                    </Link>
                </Tooltip>
            )}
        </Box>
    )
  }

  return (
    <>
      <Tooltip title="Mi Cuenta">
        <IconButton
          onClick={handleMenuClick}
          size="small"
          sx={{ ml: 1 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={classes.avatar}>
            {getAvatarContent()}
          </Avatar>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          sx: classes.menuPaper,
          elevation: 0
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName || 'Usuario'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }} noWrap>
            {user?.email}
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        
        <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem sx={classes.menuItem}>
            <ListItemIcon sx={classes.menuIcon}>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Mi Perfil
          </MenuItem>
        </Link>
        
        <Link href="/orders" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem sx={classes.menuItem}>
            <ListItemIcon sx={classes.menuIcon}>
              <ReceiptIcon fontSize="small" />
            </ListItemIcon>
            Mis Pedidos
          </MenuItem>
        </Link>

        <Link href="/security/change-password" style={{ textDecoration: 'none', color: 'inherit' }}>
          <MenuItem sx={classes.menuItem}>
            <ListItemIcon sx={classes.menuIcon}>
              <SecurityIcon fontSize="small" />
            </ListItemIcon>
            Cambiar Contraseña
          </MenuItem>
        </Link>

        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        
        <MenuItem onClick={handleSignOut} sx={classes.logoutItem}>
          <ListItemIcon sx={{ color: '#ff6b6b', minWidth: '36px' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserDropdown
