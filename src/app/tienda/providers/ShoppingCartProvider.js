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
      const storedProducts = sessionStorage.getItem('cartProducts')
      const storedItems = sessionStorage.getItem('cartItems')
      const storedSum = sessionStorage.getItem('cartSum')
      
      // Quick restore from sessionStorage for immediate UI
      if (storedCartID) {
        let parsedProducts = [];
        try {
          parsedProducts = storedProducts ? JSON.parse(storedProducts) : [];
        } catch (e) {
          console.error("Failed to parse cartProducts from sessionStorage", e);
          parsedProducts = [];
        }
        
        setShoppingCart(prev => ({
          ...prev,
          cartID: storedCartID,
          productos: parsedProducts,
          items: storedItems ? parseInt(storedItems, 10) : 0,
          suma: storedSum ? parseInt(storedSum, 10) : 0,
          updated: !prev.updated
        }))

        // Then fetch from Firestore to sync/hydrate full product data
        const loadCartItems = async () => {
          try {
            const items = await FirebaseLoadShoppingCart()
            console.log("Loaded Cart Items from Firestore:", items);
            
            if (items && Array.isArray(items) && items.length > 0) {
              const totalItems = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);
              
              setShoppingCart(prev => ({
                ...prev,
                productos: items,
                items: totalItems,
              }))
            }
          } catch (e) {
            console.error("Failed to load cart items from Firestore", e)
          }
        }
        loadCartItems()
      } else {
        // No ID? Create one via FirebaseLoadShoppingCart
        FirebaseLoadShoppingCart().then(() => {
          // After creation, store the new ID
          const newCartID = sessionStorage.getItem('cartID')
          if (newCartID) {
            setShoppingCart(prev => ({
              ...prev,
              cartID: newCartID
            }))
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
