import React, { useContext } from 'react'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import { auth } from '@/firebase/firebaseClient'
import { v4 as uuidv4 } from 'uuid'
import IconButton from '@mui/material/IconButton'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import PropTypes from 'prop-types'
import FirebaseCompareShoppingCartIds from '@/services/FirebaseCompareShoppingCartIds'
import { parseCopCurrency } from '@/utilities/priceUtils'
import { saveCartToFirestore } from '@/services/shoppingCartService'

import Button from '@mui/material/Button'
import { motion } from 'framer-motion'

const AddProduct = ({ product, selectedOption = null, variant = 'icon' }) => {
  const { shoppingCart, updateCart, updateShowCart } = useContext(ShowCartContext)

  const handleAddToCart = (e) => {
    if (e) e.preventDefault()
    
    // Create a working copy of the cart items or empty array
    const currentItems = shoppingCart.productos ? [...shoppingCart.productos] : []
    
    // Check if product already exists
    const existingProductIndex = currentItems.findIndex(p => p.productID === product.productID)

    if (existingProductIndex >= 0) {
      // Check if the same option is selected (for products with options)
      const existingItem = currentItems[existingProductIndex]
      const sameOption = !selectedOption || 
        (existingItem.selectedOption?.label === selectedOption?.label)
      
      if (sameOption) {
        // Update quantity safely
        currentItems[existingProductIndex] = {
          ...existingItem,
          cantidad: (existingItem.cantidad || 0) + 1
        }
      } else {
        // Different option = treat as new item
        currentItems.push({
          ...product,
          selectedOption: selectedOption,
          // Adjust effective price if option has modifier
          effectivePrice: (product.price || 0) + (selectedOption?.priceModifier || 0),
          cantidad: 1
        })
      }
    } else {
      // Add new product with initial quantity
      currentItems.push({
        ...product,
        selectedOption: selectedOption,
        effectivePrice: (product.price || 0) + (selectedOption?.priceModifier || 0),
        cantidad: 1
      })
    }

    // Update local state and sync with backend/calculations
    if (currentItems.length > 0) {
      // Calculate totals locally for immediate UI update
      const totalItems = currentItems.reduce((acc, item) => acc + (item.cantidad || 0), 0)
      
      const totalSum = currentItems.reduce((acc, item) => {
        // Use effectivePrice (which includes option modifier) or fallback to legacy parsing
        let price = item.effectivePrice || parseCopCurrency(item.price || item.precio);
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

  if (variant === 'button') {
    return (
      <Button
        component={motion.button}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        fullWidth
        variant="contained"
        size="large"
        onClick={handleAddToCart}
        startIcon={<AddShoppingCartIcon />}
        sx={{
          py: 2,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          borderRadius: 3,
          backgroundColor: '#00bcd4', // Electric Blue
          '&:hover': {
            backgroundColor: '#0097a7',
          },
          boxShadow: '0 8px 24px rgba(0, 188, 212, 0.3)',
          textTransform: 'none',
          letterSpacing: 1
        }}
      >
        AGREGAR AL CARRITO
      </Button>
    )
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
  product: PropTypes.object.isRequired,
  selectedOption: PropTypes.object,
  variant: PropTypes.oneOf(['icon', 'button'])
}

export default AddProduct
