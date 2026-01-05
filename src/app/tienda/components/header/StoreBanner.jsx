'use client'
import React, { useContext } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import { formatCurrency } from '@/utilities/priceUtils'
import ShoppingCart from '../ShoppingCart'
import UserDropdown from '@/app/components/UserDropdown'

const styles = {
  secondaryBar: {
    zIndex: 1 // Ver listado carrito de compras
  },
  blueLink: {
    textDecoration: 'none',
    color: '#00aCe4'
  }
}

const StoreBanner = () => {
    const { shoppingCart, updateShowCart } = useContext(ShowCartContext)

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
            <Grid item size={{ xs: 12, sm: 8, md: 9, lg: 9, xl: 10 }} xs>
              <Typography color="inherit" variant="h5" component="h1">
                Tienda
              </Typography>
              <Typography color="inherit" variant="body1" sx={{ display: 'flex' }}>
                <LocalShippingIcon sx={{ marginRight: '1rem' }}/> {' '} Envios gratis a toda Colombia!
              </Typography>
            </Grid>
            <Grid item size={{ xs: 3, sm: 3, md: 2, lg: 2, xl: 1 }} sx={{ whiteSpace: 'nowrap' }}>
              {shoppingCart.items} Productos
              <br />{formatCurrency(shoppingCart.suma)} COP
            </Grid>
            <Grid item size={{ xs: 3, sm: 1, md: 1, lg: 1, xl: 1 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Carrito">
                <IconButton
                  color="inherit"
                  onClick={() => updateShowCart(!shoppingCart.show)}
                  style={styles.blueLink}
                >
                  <ShoppingCartIcon fontSize="large" />
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
