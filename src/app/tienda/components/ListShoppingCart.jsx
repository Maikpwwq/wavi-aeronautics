'use client'
// import { collection, doc, setDoc } from 'firebase/firestore'
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// import { firestore } from '@/firebase/firebaseClient'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'

// import "localstorage-polyfill";
// import "sessionstorage-polyfill";
// global.sessionstorage;
// global.localStorage;
import Typography from '@/modules/components/Typography'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
// import CardContent from "@mui/material/CardContent";
// import CardActions from "@mui/material/CardActions";
// import { CardActionArea } from "@mui/material";
// import CancelIcon from '@mui/icons-material/Cancel'
// import IconButton from '@mui/material/IconButton'
// import { styled } from "@mui/material/styles";

const styles = (theme) => ({
  image: {
    height: '130px',
    width: 'auto !important'
  },
  card: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-evenly'
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
  const { shoppingCart, updateShowCart, updateCart } =
    useContext(ShowCartContext)
  console.log('ShowCartContext ListShoppingCart', shoppingCart)

  let shoppingCartID = null
  useEffect(() => {
    // se lee el ID asignado atras durante el login
    shoppingCartID = sessionStorage.getItem('cartID')
    if (shoppingCartID) {
      console.log('shoppingCartID', shoppingCartID)
      // se asigna cartID al storeContext del usuario
      updateCart({ cartID: shoppingCartID })
    }
  }, [shoppingCartID])

  const navigate = useRouter()
  const classes = styles(theme)
  // TODO: handle cancel button
  // const _firestore = firestore
  // const shoppingsRef = collection(_firestore, 'shoppingCart')

  // console.log("visibility", visible);
  // const handleClick = (e) => {
  //   e.preventDefault();
  //   navigate("/tienda/producto/", { state: { product: products } });
  // };

  // if (myShoppingCart.length === 0) {
  //   const productData = sharingInformationService.getSubject();
  //   productData.subscribe((data) => {
  //     if (!!data) {
  //       myShoppingCart = data;
  //       console.log("Detail shoppingCard", data, shoppingCart);
  //     }
  //   });
  // }

  // const shoppingsToFirestore = async (updateInfo, userRef) => {
  //   await setDoc(doc(shoppingsRef, userRef), updateInfo, { merge: true })
  // }

  // const handleCancel = (e) => {
  //   e.preventDefault()
  //   if (shoppingCartID) {
  //     const cardProductos = []
  //     console.log('myShoppingCart', shoppingCart)
  //     shoppingCart.productos.map((product, n) => {
  //       cardProductos.push(product)
  //     })
  //     console.log(cardProductos)
  //     // var index = cardProductos.length;
  //     // console.log(index, shoppingCart.productos.length);
  //     // cardProductos[index] = shoppingCart.productos
  //     // let cardProductos = shoppingCart.productos + productID;
  //     cardProductos.push(productID)
  //     // cardProductos[index] = productID
  //     updateCart({ ...shoppingCart, productos: cardProductos })
  //     // console.log(userID, productID);
  //     console.log(shoppingCart)
  //     console.log(cardProductos)
  //     shoppingsToFirestore({ productos: cardProductos }, shoppingCartID)
  //     // shoppingsFromFirestore();
  //   } else {
  //     navigate.push('sign-in')
  //   }
  // }

  const handleCheckout = (e) => {
    e.preventDefault()
    const productsCart = shoppingCart.productos
    console.log('productsCart', productsCart)
    sessionStorage.setItem('cartUpdated', 'detalles-envio')
    updateShowCart(false)
    navigate.push('tienda/detalles-envio', {
      // state: { productsCart: productsCart },
    })
  }

  const handleShoppingCart = (e) => {
    e.preventDefault()
    sessionStorage.setItem('cartUpdated', 'ver-carrito')
    updateShowCart(false)
    navigate.push('tienda/ver-carrito', {
      // state: {
      //   makeVisible: shoppingCart.show,
      //   makeUpdated: updated,
      // },
    })
  }

  return (
    <>
      <Box className="" maxWidth="sm" style={{ height: '100%' }}>
        {shoppingCart.productos &&
          shoppingCart.productos.map(
            ({ titulo, precio, imagenes, productID, cantidad }, index) => (
              <Card style={classes.card} key={index}>
                {/* <CardActionArea onClick={handleClick}></CardActionArea> */}
                <Typography
                  variant="h6"
                  gutterBottom
                  marked="center"
                  align="center"
                  style={classes.cantidad}
                >
                  {cantidad} X
                </Typography>
                <CardMedia
                  sx={classes.image}
                  component="img"
                  image={imagenes[0]}
                  alt={titulo}
                ></CardMedia>

                <CardHeader
                  title={titulo}
                  subheader={precio}
                  // action={
                  //   <IconButton color="inherit" onClick={() => handleCancel}>
                  //     <CancelIcon fontSize="large" />
                  //   </IconButton>
                  // }
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
