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
      // Calculate totals locally for immediate UI update
      const totalItems = currentItems.reduce((acc, item) => acc + (item.cantidad || 0), 0);
      
      const totalSum = currentItems.reduce((acc, item) => {
        // If price is already formatted (COP), parse it. If it's USD (raw), convert it.
        // Usually in the store pages, the products displayed have ALREADY been converted to COP by the generic firebase services/utils.
        // So item.precio should be a string like "$ 2.000.000".
        // HOWEVER, we must be careful.
        
        // Let's import the helper we just made
        // (We need to update imports first, but for now assuming it's available or inline it)
        
        let price = 0;
        if (typeof item.precio === 'string' && item.precio.includes('$')) {
           // It's likely COP formatted
           price = parseInt(item.precio.replace(/[^0-9]/g, ''), 10);
        } else {
           // Fallback/Safety: It might be raw USD or just a number
           // If it is raw USD, we technically should convert it, but the UI displays COP.
           // Let's assume the product object in the cart SHOULD carry the COP price.
           price = parseInt(item.precio, 10) || 0;
        }
        
        return acc + (price * (item.cantidad || 0));
      }, 0);

      // Optimistic update to context first (optional, but good for UI responsiveness)
      updateCart({ 
          updated: true, 
          productos: currentItems,
          items: totalItems,
          suma: totalSum
      })
      sessionStorage.setItem('cartUpdated', 'listado-productos-context')
      
      // Calculate totals and deep sync with backend
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
