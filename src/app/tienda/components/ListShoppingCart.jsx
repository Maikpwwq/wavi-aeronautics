import React, { useContext, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import CircularProgress from '@mui/material/CircularProgress'

import Typography from '@/modules/components/Typography'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

const styles = (theme) => ({
  image: {
    height: '130px',
    width: 'auto !important'
  },
  productBox: {
    height: '100%',
    width: 'fit-content'
  },
  card: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    width: 'fit-content'
  },
  cantidad: {
    minWidth: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttons: {
    width: '50%'
  }
})

const ListShoppingCart = (props) => {
  const { shoppingCart, updateShowCart, updateCart, removeFromCart } =
    useContext(ShowCartContext)

  let shoppingCartID = null
  useEffect(() => {
    // se lee el ID asignado atras durante el login
    shoppingCartID = sessionStorage.getItem('cartID')
    if (shoppingCartID) {
      updateCart({ cartID: shoppingCartID })
    }
  }, [shoppingCartID])

  const navigate = useRouter()
  const classes = styles(theme)

  const handleRemove = (productID, titulo) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${titulo}" del carrito?`)) {
      removeFromCart(productID)
    }
  }

  const handleCheckout = (e) => {
    e.preventDefault()
    const productsCart = shoppingCart.productos
    console.log('productsCart', productsCart)
    sessionStorage.setItem('cartUpdated', 'detalles-envio')
    updateShowCart(false)
    navigate.push('detalles-envio', {
    })
  }

  const handleShoppingCart = (e) => {
    e.preventDefault()
    sessionStorage.setItem('cartUpdated', 'ver-carrito')
    updateShowCart(false)
    navigate.push('ver-carrito', {
    })
  }

  return (
    <>
      <Box className="" maxWidth="sm" style={classes.productBox}>
        <Suspense fallback={
          <CircularProgress />
        }>
          {shoppingCart.productos &&
            shoppingCart.productos.map(
              ({ titulo, precio, imagenes, productID, cantidad }, index) => (
                <Card style={{ ...classes.card, width: '100%' }} key={index}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    marked="center"
                    align="center"
                    style={classes.cantidad}
                  >
                    {cantidad} X
                  </Typography>
                  {imagenes && imagenes.length > 0 && (
                    <CardMedia
                      sx={classes.image}
                      component="img"
                      image={imagenes[0]}
                      alt={titulo}
                    ></CardMedia>
                  )}

                  <CardHeader
                    title={titulo}
                    subheader={precio}
                    action={
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemove(productID, titulo)}
                        aria-label="eliminar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  ></CardHeader>
                </Card>
              )
            )}
            {shoppingCart.productos && shoppingCart.productos.length >= 1 && (
              <Box className="" maxWidth="sm">
                <Button
                  variant="contained"
                  color="primary"
                  style={classes.buttons}
                  onClick={(e) => handleCheckout(e)}
                >
                  Finalizar compra
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  style={classes.buttons}
                  onClick={(e) => handleShoppingCart(e)}
                >
                  Ver carrito
                </Button>
              </Box>
            )}
        </Suspense>
      </Box>
    </>
  )
}

ListShoppingCart.propTypes = {
  // classes: PropTypes.object.isRequired,
  // setShowingCart: PropTypes.func.isRequired,
  // products: PropTypes.array,
  // visible: PropTypes.bool,
  // updated: PropTypes.string,
}

export default withRoot(ListShoppingCart)
