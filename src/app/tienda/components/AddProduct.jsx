import React, { useContext } from 'react'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import { auth } from '@/firebase/firebaseClient'
import IconButton from '@mui/material/IconButton'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import PropTypes from 'prop-types'
import FirebaseCompareShoppingCartIds from '@/services/FirebaseCompareShoppingCartIds'
import { parseCopCurrency } from '@/utilities/priceUtils'
import { saveCartToFirestore } from '@/services/shoppingCartService'

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
      const totalItems = currentItems.reduce((acc, item) => acc + (item.cantidad || 0), 0)
      
      const totalSum = currentItems.reduce((acc, item) => {
        // Use the centralized parser to handle "$ 2.000.000" or raw numbers
        let price = parseCopCurrency(item.precio);
        return acc + (price * (item.cantidad || 0));
      }, 0)

      // Optimistic update to context first
      updateCart({ 
          updated: true, 
          productos: currentItems,
          items: totalItems,
          suma: totalSum
      })
      
      // Persist to Firestore - save minimal structure (productID + cantidad)
      let cartID = sessionStorage.getItem('cartID')
      
      // If guest has no ID yet, create it now (Lazy initialization)
      if (!cartID && !auth?.currentUser?.uid) {
        const { v4: uuidv4 } = await import('uuid');
        cartID = uuidv4();
        sessionStorage.setItem('cartID', cartID);
        console.log('[AddProduct] Created new guest cartID:', cartID);
      }

      const cartToSave = currentItems.map(item => ({
        productID: item.productID,
        cantidad: item.cantidad
      }))
      
      // Save to sessionStorage for quick restore on refresh
      sessionStorage.setItem('cartProducts', JSON.stringify(cartToSave))
      sessionStorage.setItem('cartItems', totalItems.toString())
      sessionStorage.setItem('cartSum', totalSum.toString())
      
      const targetID = auth?.currentUser?.uid || cartID;
      if (targetID) {
        saveCartToFirestore(targetID, cartToSave)
      }
      
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
