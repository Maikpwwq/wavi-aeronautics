'use client'

import React, { useState, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
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
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Premium differentiated Material UI Icons for Admin
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ContactSupportIcon from '@mui/icons-material/ContactSupport'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ArticleIcon from '@mui/icons-material/Article'
import CloudSyncIcon from '@mui/icons-material/CloudSync'
import TuneIcon from '@mui/icons-material/Tune'
import StorefrontIcon from '@mui/icons-material/Storefront'

import AdminGuard from '@/app/components/admin/AdminGuard'
import UserDropdown from '@/app/components/UserDropdown'

const WaviPixelLogo =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FWaviPixelLogo.png?alt=media&token=7edcec69-8b24-4b95-b970-6b9acfddbdeb'

const drawerWidth = 250

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    [theme.breakpoints.up('md')]: {
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    },
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    width: '100%',
    maxWidth: '100vw',
    overflowX: 'hidden'
  }),
)

const StyledAppBar = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
      ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }),
    }
  }),
)

const NAV_ITEMS = [
  { text: 'Dashboard', icon: <SpaceDashboardIcon />, path: '/admin' },
  { text: 'Pedidos', icon: <ReceiptLongIcon />, path: '/admin/orders' },
  { text: 'Problemas de Pedidos', icon: <ReportProblemIcon />, path: '/admin/orders/issues' },
  { text: 'Gestión de Productos', icon: <Inventory2Icon />, path: '/admin/products' },
  { text: 'Promociones', icon: <LocalOfferIcon />, path: '/admin/promotions' },
  { text: 'Moderación de Usados', icon: <FactCheckIcon />, path: '/admin/used-products' },
  { text: 'Opiniones', icon: <RateReviewIcon />, path: '/admin/reviews' },
  { text: 'Preguntas Técnicas', icon: <ContactSupportIcon />, path: '/admin/questions' },
  { text: 'Usuarios', icon: <ManageAccountsIcon />, path: '/admin/users' },
  { text: 'Publicaciones', icon: <ArticleIcon />, path: '/admin/publications' },
  { text: 'Migrar Productos', icon: <CloudSyncIcon />, path: '/admin/products/migrate' },
  { text: 'Configuración', icon: <TuneIcon />, path: '/admin/settings' },
]

export default function AdminLayout({ children }) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = useState(true)

  useEffect(() => {
    setOpen(isDesktop)
  }, [isDesktop])

  const toggleDrawer = () => {
    setOpen(prev => !prev)
  }

  const pathname = usePathname()

  const drawerContent = (
    <>
      <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
      <Box sx={{ p: 2.5, textAlign: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            component="img"
            src={WaviPixelLogo}
            alt="Wavi Aeronautics"
            sx={{ height: 44, width: 44, marginRight: 1.5, borderRadius: '50%' }}
          />
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.2px' }}>
            Wavi Aeronautics
          </Typography>
        </Link>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
      
      <List sx={{ mt: 1.5, px: 1, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isSelected = pathname === item.path
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                component={Link} 
                href={item.path}
                selected={isSelected}
                onClick={() => !isDesktop && setOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 1.5,
                  transition: 'all 0.2s ease',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 172, 228, 0.18)',
                    color: '#38bdf8',
                    fontWeight: 700,
                    '& .MuiListItemIcon-root': { color: '#38bdf8' },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 172, 228, 0.24)'
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: '#ffffff',
                    '& .MuiListItemIcon-root': { color: '#ffffff' }
                  }
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? '#38bdf8' : 'rgba(255,255,255,0.65)', minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontSize: '0.875rem', 
                    fontWeight: isSelected ? 700 : 500,
                    letterSpacing: '0.1px'
                  }} 
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      
      <Box sx={{ mt: 'auto', p: 1.5 }}>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.08)', mb: 1.5 }} />
        <ListItem disablePadding>
          <ListItemButton 
            component={Link} 
            href="/"
            sx={{
              borderRadius: 2,
              py: 1,
              px: 1.5,
              color: 'rgba(255,255,255,0.75)',
              '&:hover': { 
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#38bdf8',
                '& .MuiListItemIcon-root': { color: '#38bdf8' }
              }
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.75)', minWidth: 38 }}>
              <StorefrontIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Volver a la Tienda" 
              primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </>
  )

  const drawerStyles = {
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column'
    },
  }

  return (
    <AdminGuard>
      <Box sx={{ display: 'flex' }}>
        <StyledAppBar position="fixed" open={open}>
          <Toolbar sx={{ minHeight: '64px !important' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              edge="start"
              sx={{ mr: 2 }}
            >
              {open && isDesktop ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 800, color: '#0f172a', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Panel de Administración
            </Typography>
            <UserDropdown showLoginLabel={false} />
          </Toolbar>
        </StyledAppBar>
        
        {/* Desktop Sidebar (Persistent) */}
        {isDesktop ? (
          <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            sx={{
              width: drawerWidth,
              ...drawerStyles
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          /* Mobile Sidebar (Temporary) */
          <Drawer
            variant="temporary"
            anchor="left"
            open={open}
            onClose={toggleDrawer}
            sx={{
              width: drawerWidth,
              ...drawerStyles
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        <Main open={open}>
          <Toolbar sx={{ minHeight: '64px !important' }} />
          <Box sx={{ maxWidth: '100%', mx: 'auto', p: { xs: 0, md: 1 } }}>
            {children}
          </Box>
        </Main>
      </Box>
    </AdminGuard>
  )
}
