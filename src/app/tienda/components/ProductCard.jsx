import React, { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
// import { getAllShoppingCart } from "@/services/sharedServices";
import FirebaseAddToCart from '@/services/FirebaseAddToCart'
import { loadDetail } from '@/store/states/product'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'

// import "sessionstorage-polyfill";
// import "localstorage-polyfill";
// global.sessionstorage;
// global.localStorage;

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import { CardActionArea } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import PropTypes from 'prop-types'

// import { useQuery } from "react-query";

const ProductCard = ({ products, category }) => {
  const dispatch = useDispatch()
  const categoria = category || 'tienda'
  const producto = products
  const { titulo, precio, imagenes, productID, marca } = producto
  console.log('*****', producto)
  const { shoppingCart, updateShoppingCart } = useContext(ShowCartContext)

  // const storedCart = useSelector((store) => store.shoppingCart);
  // let cart = storedCart || [];
  // console.log("cart products", cart);

  // const [thisShoppingCart, setShoppingCart] = useState({
  //   productos: shoppingCart,
  // });

  const handleSelect = () => {
    console.log('producto', producto)
    try {
      dispatch(loadDetail({ producto }))
    } catch (e) {
      return console.error(e.message)
    }
  }

  // Solo activar
  useEffect(() => {
    storeToFirebaseCart()
  }, [shoppingCart, shoppingCart.productos])

  const storeToFirebaseCart = () => {
    // const cardProductos = {};
    const cardProductos = []
    let cart = []
    // copia de los productos agregados al carrito de compras
    cart = shoppingCart.productos
    console.log('shoppingCart', shoppingCart)
    cart.map((product, n) => {
      const { productID, cantidad } = product
      // cardProductos[n] = productID;
      // Se almacena como items del carrito; id de producto y cantidad solicitada
      cardProductos.push({ productID, cantidad })
    })
    console.log('cardProductos', cardProductos)
    if (cardProductos.length > 0) {
      // Servicio que permite al usuario guardar elementos en el carrito de firebase
      FirebaseAddToCart({ productos: cardProductos })
    }
  }

  const handleAddCard = (e, producto) => {
    e.preventDefault()
    readData(producto)
    // storeToFirebaseCart()
  }

  const readData = (producto) => {
    //   shoppingsFromFirestore().then((snapshot) => {
    let included = true
    const cardProductos = []
    if (shoppingCart.productos) {
      // Se cargan los productos previos del context
      shoppingCart.productos.map((product, n) => {
        cardProductos.push(product)
      })
      // Se compara el Id de producto para aumentar cantidad del mismo articulo
      cardProductos.map((product, n) => {
        const { productID } = product
        console.log(
          "compare product's ID",
          product.productID,
          producto.productID
        )
        if (productID === producto.productID) {
          // TODO aumentar cantidad en 1
          product.cantidad++
          // determina que no se debe incluir de nuevo
          included = false
        }
      })
      // este articulo debe ser incluido con cantidad de uno
      if (included) {
        producto.cantidad = 1
        cardProductos.push(producto)
        console.log('cardProductos', included, cardProductos)
      }
    }
    console.log('readData', cardProductos)
    // setShoppingCart productos:
    if (cardProductos.length > 0) {
      updateShoppingCart(cardProductos)
      // setShoppingCart({ productos: cardProductos });
      console.log('shoppingCart', shoppingCart)
    }
  }

  return (
    <>
      <Box className="" maxWidth="sm" style={{ height: '100%' }}>
        <Card style={{ height: '100%' }}>
          <CardActionArea>
            {producto !== undefined && imagenes && (
              <Link
                href={{
                  pathname: 'tienda/producto',
                  query: `id=${productID}&category=${categoria}&marca=${marca}`,
                  state: { product: products }
                }}
              >
                <CardMedia
                  component="img"
                  height="330"
                  image={imagenes[0]}
                  alt={titulo}
                  onClick={() => handleSelect}
                />
              </Link>
            )}
          </CardActionArea>
          <CardHeader
            title={titulo}
            subheader={precio}
            action={
              <IconButton
                color="inherit"
                onClick={(e) => handleAddCard(e, producto)}
              >
                <AddShoppingCartIcon fontSize="large" />
              </IconButton>
            }
          ></CardHeader>
        </Card>
      </Box>
    </>
  )
}

ProductCard.propTypes = {
  products: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired
}

export default ProductCard
