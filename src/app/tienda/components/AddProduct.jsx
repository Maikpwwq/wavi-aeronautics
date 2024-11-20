import React, { useContext } from 'react'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'

import IconButton from '@mui/material/IconButton'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import PropTypes from 'prop-types'

const AddProduct = ({ product }) => {

    const addProduct = product

    const { shoppingCart, updateShoppingCart } = useContext(ShowCartContext)

    const handleAddCard = (e, producto) => {
        e.preventDefault()
        readData(producto)
        // TODO: leer carrito firebase enviar luego a FirebaseCompareShoppingCartIds
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
            <IconButton
                color="inherit"
                onClick={(e) => handleAddCard(e, addProduct)}
            >
                <AddShoppingCartIcon fontSize="large" />
            </IconButton>
        </>
    )
}

AddProduct.propTypes = {
    product: PropTypes.object.isRequired,    
}

export default AddProduct