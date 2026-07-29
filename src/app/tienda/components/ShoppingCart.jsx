'use client'
import React, { useContext, useEffect, Suspense } from 'react'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import ListShoppingCart from './ListShoppingCart'
import FirebaseCompareShoppingCartIds from '@/services/FirebaseCompareShoppingCartIds'
import { sharingInformationService } from '@/services/sharing-information'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'

const styles = (theme) => ({
  cartList: {
    position: 'absolute',
    top: '85px !important',
    minWidth: '480px',
    right: '133px',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(8, 6),
      minWidth: '380px !important',
      right: '13px !important'
    }
  }
})

const ShoppingCart = () => {
  const { shoppingCart, updateCart } = useContext(ShowCartContext)
  const cart = shoppingCart.productos || []
  const classes = styles(theme)

  const productData = sharingInformationService.getSubject()

  useEffect(() => {
    productData.subscribe((data) => {
      if (data) {
        const { cart, userID } = data
        if (userID && shoppingCart.cartID === null) {
          updateCart({ cartID: userID })
        }
        if (cart && cart.length > 0) {
          FirebaseCompareShoppingCartIds({ products: cart, updateCart })
        }
      }
    })
  }, [shoppingCart.updated])

  return (
    <>
      {/* Speech bubble text cloud when cart is empty */}
      {typeof cart === 'object' && cart.length < 1 && (
        <Box
          sx={{
            position: 'absolute',
            top: '72px',
            right: { xs: '15px', sm: '65px', md: '75px' },
            zIndex: 1300,
            visibility: shoppingCart.show === true ? 'visible' : 'hidden',
            opacity: shoppingCart.show === true ? 1 : 0,
            transition: 'all 0.2s ease-in-out',
            bgcolor: '#ffffff',
            color: '#2d3748',
            py: 2.5,
            px: 3.5,
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
            minWidth: '280px',
            maxWidth: '340px',
            textAlign: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-8px',
              right: '28px',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '8px solid #ffffff',
              zIndex: 2
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '-9px',
              right: '28px',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '8px solid #cbd5e1',
              zIndex: 1
            }
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#4a5568',
              fontWeight: 500,
              fontSize: '0.95rem',
              lineHeight: 1.5
            }}
          >
            No hay artículos cargados en el carrito de compras
          </Typography>
        </Box>
      )}

      {/* Cart items list when cart has products */}
      <Suspense
        fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        }
      >
        {typeof cart === 'object' && cart.length > 0 && (
          <Grid
            container
            spacing={2}
            style={{
              position: 'relative',
              top: '33%',
              visibility: shoppingCart.show === true ? 'visible' : 'hidden'
            }}
            sx={{ right: { xs: '84px', sm: '-84px' } }}
          >
            <Grid
              item
              size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}
              sx={classes.cartList}
            >
              <ListShoppingCart className="d-flex mb-2" />
            </Grid>
          </Grid>
        )}
      </Suspense>
    </>
  )
}

export default withRoot(ShoppingCart)
