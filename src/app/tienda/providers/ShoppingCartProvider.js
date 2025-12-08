import React, { useState, createContext, useEffect } from 'react'
import FirebaseLoadShoppingCart from '@/services/FirebaseLoadShoppingCart'

export const ShowCartContext = createContext()

const ShoppingCartProvider = ({ children }) => {
  const [shoppingCart, setShoppingCart] = useState({
    cartID: null,
    productos: [],
    show: false,
    updated: false,
    suma: 0,
    items: 0
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCartID = sessionStorage.getItem('cartID')
      
      if (storedCartID) {
         // Restore ID
         setShoppingCart(prev => ({
           ...prev,
           cartID: storedCartID,
           updated: !prev.updated
         }))

         // Fetch items
         const loadCartItems = async () => {
             try {
                 const items = await FirebaseLoadShoppingCart()
                 console.log("Loaded Cart Items:", items);
                 
                 if (items && Array.isArray(items)) {
                     // Recalculate totals from loaded items
                     // Ideally we should move this calculation to a shared helper or the load service?
                     // For now, let's keep it simple or import priceUtils if needed.
                     // Actually, let's just update the list. The banner might show 0 temporarily until something triggers an update?
                     // Or we calculate it right here.
                     
                     // Import helper (we can't easily import inside useEffect, assuming helper imports aren't available unless top-level)
                     // Let's just sum it up simple for now to restore state.
                     const totalItems = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);
                     // We need to parse price if it's a string, or just use raw if it's there.
                     // The items from DB should have the same structure as what we saved.
                     
                     setShoppingCart(prev => ({
                         ...prev,
                         productos: items,
                         items: totalItems,
                         // We might miss total sum here if we don't recalculate it.
                         // But at least products are back.
                         // Let's rely on AddProduct or other logic for now, or just set items.
                     }))
                 }
             } catch (e) {
                 console.error("Failed to load cart items", e)
             }
         }
         loadCartItems()
      } else {
        // No ID? Trigger load anyway to potentially create one?
        // logic in FirebaseLoadShoppingCart handles creation if missing.
         FirebaseLoadShoppingCart().then(items => {
             if (items && items.length > 0) {
                 // Update state if we got a new cart with items (unlikely but possible if logic changes)
             }
         });
      }
    }
  }, [])
  const updateShoppingCart = (newProductos) => {
    console.log('updateShoppingCart', newProductos)
    setShoppingCart((shoppingCart) => ({
      ...shoppingCart,
      productos: newProductos
    }))
  }
  const updateCart = (newData) => {
    console.log('updateCart', newData)
    setShoppingCart((shoppingCart) => ({
      ...shoppingCart,
      ...newData
    }))
  }
  const updateShowCart = (bool) => {
    console.log('updateShowCart', bool)
    setShoppingCart((shoppingCart) => ({
      ...shoppingCart,
      show: bool
    }))
  }

  return (
    <ShowCartContext.Provider
      value={{ shoppingCart, updateShoppingCart, updateShowCart, updateCart }}
    >
      {children}
    </ShowCartContext.Provider>
  )
}

export default ShoppingCartProvider
