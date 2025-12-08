import React, { useContext } from 'react'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import IconButton from '@mui/material/IconButton'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import PropTypes from 'prop-types'
import FirebaseCompareShoppingCartIds from '@/services/FirebaseCompareShoppingCartIds'

const AddProduct = ({ product }) => {
  const { shoppingCart, updateCart, updateShowCart } = useContext(ShowCartContext)

  const handleAddToCart = (e) => {
    e.preventDefault()
    
    // Create a working copy of the cart items or empty array
    const currentItems = shoppingCart.productos ? [...shoppingCart.productos] : []
    
    // Check if product already exists
    const existingProductIndex = currentItems.findIndex(p => p.productID === product.productID)

    if (existingProductIndex >= 0) {
      // Update quantity safely
      currentItems[existingProductIndex] = {
        ...currentItems[existingProductIndex],
        cantidad: (currentItems[existingProductIndex].cantidad || 0) + 1
      }
    } else {
      // Add new product with initial quantity
      currentItems.push({
        ...product,
        cantidad: 1
      })
    }

    // Update local state and sync with backend/calculations
    if (currentItems.length > 0) {
      // Optimistic update to context first (optional, but good for UI responsiveness)
      updateCart({ updated: true, productos: currentItems })
      sessionStorage.setItem('cartUpdated', 'listado-productos-context')
      
      // Calculate totals and deep sync
      FirebaseCompareShoppingCartIds({ products: currentItems, updateCart })
      
      // Show cart drawer
      updateShowCart(true)
    }
  }

  return (
    <IconButton
      color="inherit"
      onClick={handleAddToCart}
      aria-label="Agregar al carrito"
    >
      <AddShoppingCartIcon fontSize="large" />
    </IconButton>
  )
}

AddProduct.propTypes = {
  product: PropTypes.object.isRequired
}

export default AddProduct
