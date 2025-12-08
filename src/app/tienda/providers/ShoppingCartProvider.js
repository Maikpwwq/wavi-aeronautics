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
             const items = await FirebaseLoadShoppingCart()
             if (items && items.length > 0) {
                 setShoppingCart(prev => ({
                     ...prev,
                     productos: items,
                     items: items.length
                 }))
             }
         }
         loadCartItems()
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
