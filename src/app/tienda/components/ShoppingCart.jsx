'use client'
import React, { useContext, useEffect } from 'react'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import ListShoppingCart from './ListShoppingCart'
import FirebaseCompareShoppingCartIds from '@/services/FirebaseCompareShoppingCartIds'
import { getAllShoppingCart } from '@/services/sharedServices'
import { sharingInformationService } from '@/services/sharing-information'

// import PropTypes from 'prop-types'
// import { useSelector } from 'react-redux'

// import "sessionstorage-polyfill";
// import "localstorage-polyfill";
// global.sessionstorage;
// global.localStorage;

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid2'
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

const ShoppingCart = (props) => {
  const { shoppingCart, updateCart } =
    useContext(ShowCartContext)
  console.log('ShowCartContext ShoppingCart', shoppingCart)
  // const shoppingCart = useSelector((store) => store.shoppingCart);
  const cart = shoppingCart.productos
  const classes = styles(theme)

  const subscription$ = getAllShoppingCart
  const productData = sharingInformationService.getSubject()

  useEffect(() => {
    subscription$.subscribe((response) => {
      if (response) {
        console.log('subscription getAllShoppingCart', response)
        // const { cart } = response;
        // shoppingCart.productos = cart;
      }
    })
    productData.subscribe((data) => {
      if (data) {
        const { cart, userID } = data
        console.log('Detail productCard', cart, userID)
        if (userID && shoppingCart.cartID === null) {
          // Se usa el id para asignarlo al carrito de compras
          updateCart({ cartID: userID })
        }
        if (cart && cart.length > 0) {
          // Se envia array con ids de productos, para identificar referencias y almacenarlas en el context
          FirebaseCompareShoppingCartIds({ products: cart, updateCart })
        }
      }
    })
  }, [shoppingCart])

  // useEffect(() => {
  // }, [shoppingCart]) // productData

  return (
    <>
      { typeof(cart) === 'object'
        ? (<Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>)
        : (<Grid
          container
          spacing={2}
          style={{
            position: 'absolute',
            visibility: shoppingCart.show ? 'visible' : 'hidden'
          }}
        >
          {/* {cart.productos &&
            cartInfo.productos.map((product, k) => {
              // console.log("product", product);
              return ( */}
          <Grid
            item
            // key={k}
            size={{ xs: 12, sm: 12, md: 5, lg: 4, xl: 3 }}
            sx={classes.cartList}
          >
            <ListShoppingCart
              className="d-flex mb-2"
            ></ListShoppingCart>
          </Grid>
          {/* );
            })} */}
        </Grid>
          )}
    </>
  )
}

ShoppingCart.propTypes = {
  // classes: PropTypes.object.isRequired,
}

export default withRoot(ShoppingCart)
