import React, { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
// import { getAllShoppingCart } from "@/services/sharedServices";
import { loadDetail } from '@/store/states/product'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import AddProduct from '@/app/tienda/components/AddProduct'

// import "sessionstorage-polyfill";
// import "localstorage-polyfill";
// global.sessionstorage;
// global.localStorage;

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import { CardActionArea } from '@mui/material'
import PropTypes from 'prop-types'

// import { useQuery } from "react-query";

const styles = () => ({
  imageCentered: {
    display: 'flex',
    justifyContent: 'center'
  },
  imageSize: {
    height: '330px',
    width: 'auto'
  }
})

const ProductCard = ({ products, category }) => {
  const classes = styles()
  const dispatch = useDispatch()
  const categoria = category || 'tienda'
  const producto = products
  const { titulo, precio, imagenes, productID, marca } = producto
  const { shoppingCart } = useContext(ShowCartContext)

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

  // TODO: Separar la acción de agregar al carrito para usarla dentro del detalle de producto
  // Solo activar


  return (
    <>
      <Box className="" maxWidth="sm" style={{ height: '100%' }}>
        <Card style={{ height: '100%' }}>
          <CardActionArea>
            {producto !== undefined && imagenes && (
              <Link
                style={classes.imageCentered}
                href={{
                  pathname: 'producto',
                  query: `id=${productID}&category=${categoria}&marca=${marca}`,
                  state: { product: products }
                }}
              >
                <CardMedia
                  component="img"
                  style={classes.imageSize}
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
              <AddProduct product={producto}/>
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
