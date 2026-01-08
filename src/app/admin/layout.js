'use client'

import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import HomeIcon from '@mui/icons-material/Home'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AdminGuard from '@/app/components/admin/AdminGuard'
import UserDropdown from '@/app/components/UserDropdown'

const WaviPixelLogo =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FWaviPixelLogo.png?alt=media&token=7edcec69-8b24-4b95-b970-6b9acfddbdeb'

const drawerWidth = 240

const Sidebar = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#1a2744',
    color: 'white',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  },
}))

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
  }),
)

const StyledAppBar = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    backgroundColor: 'white',
    color: '#1a2744',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
)

const NAV_ITEMS = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Pedidos', icon: <ShoppingCartIcon />, path: '/admin/orders' },
  { text: 'Problemas de Pedidos', icon: <ReportProblemIcon />, path: '/admin/orders/issues' },
  { text: 'Usuarios', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Configuración', icon: <SettingsIcon />, path: '/admin/settings' },
]

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(true)
  const pathname = usePathname()

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  return (
    <AdminGuard>
      <Box sx={{ display: 'flex' }}>
        <StyledAppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Panel de Administración
            </Typography>
            <UserDropdown showLoginLabel={false} />
          </Toolbar>
        </StyledAppBar>
        
        <Sidebar variant="persistent" anchor="left" open={open}>
          <Box sx={{ p: 3, textAlign: 'center' }}>
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
          <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <List sx={{ mt: 2 }}>
            {NAV_ITEMS.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  component={Link} 
                  href={item.path}
                  selected={pathname === item.path}
                  sx={{
                    mx: 1,
                    borderRadius: 2,
                    mb: 1,
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(0, 188, 212, 0.2)',
                        color: '#00bcd4',
                        '& .MuiListItemIcon-root': {
                            color: '#00bcd4',
                        }
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ mt: 'auto', p: 2 }}>
             <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
             <ListItem disablePadding>
                <ListItemButton 
                  component={Link} 
                  href="/"
                  sx={{
                    borderRadius: 2,
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Volver al Sitio" />
                </ListItemButton>
              </ListItem>
          </Box>
        </Sidebar>

        <Main open={open}>
          <Toolbar /> {/* Spacer for fixed AppBar */}
          <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            {children}
          </Box>
        </Main>
      </Box>
    </AdminGuard>
  )
}
