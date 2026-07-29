'use client'
import React, { useContext } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import { formatCurrency } from '@/utilities/priceUtils'
import ShoppingCart from '../ShoppingCart'
import UserDropdown from '@/app/components/UserDropdown'

const styles = {
  secondaryBar: {
    zIndex: 1
  }
}

const StoreBanner = () => {
  const { shoppingCart, updateShowCart } = useContext(ShowCartContext)
  const cartItemCount = shoppingCart?.items || 0
  const cartTotal = shoppingCart?.suma || 0

  return (
    <AppBar
      component="div"
      style={styles.secondaryBar}
      color="primary"
      position="static"
      elevation={0}
    >
      <Toolbar>
        <Grid container alignItems="center" spacing={1} sx={{ width: '100%', justifyContent: 'space-between' }}>
          <Grid item xs>
            <Typography color="inherit" variant="h5" component="h1">
              <span style={{ fontWeight: 'bold' }}>Para lo mejor en equipos FPV y Drones</span>
            </Typography>
            <Typography color="inherit" variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalShippingIcon sx={{ marginRight: '0.75rem' }} /> Envíos gratis a toda Colombia!
            </Typography>
          </Grid>

          <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'inherit', whiteSpace: 'nowrap' }}>
              {formatCurrency(cartTotal)} COP
            </Typography>

            <Tooltip title="Carrito de compras">
              <IconButton
                onClick={() => updateShowCart(!shoppingCart.show)}
                sx={{
                  color: '#00aCe4',
                  position: 'relative',
                  p: 1,
                  '&:hover': {
                    bgcolor: 'rgba(0, 172, 228, 0.12)'
                  }
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: 44 }} />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '41%',
                    left: '53%',
                    transform: 'translate(-50%, -50%)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    lineHeight: 1,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.6)'
                  }}
                >
                  {cartItemCount}
                </Box>
              </IconButton>
            </Tooltip>

            <UserDropdown showLoginLabel={false} />
          </Grid>
        </Grid>
        <ShoppingCart />
      </Toolbar>
    </AppBar>
  )
}

export default StoreBanner
