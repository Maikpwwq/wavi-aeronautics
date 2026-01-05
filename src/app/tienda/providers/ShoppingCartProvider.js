import React, { useState, createContext, useEffect } from 'react'
import FirebaseLoadShoppingCart from '@/services/FirebaseLoadShoppingCart'
import { saveCartToFirestore } from '@/services/shoppingCartService'
import { FirebaseCompareShoppingCartIds } from '@/services/FirebaseCompareShoppingCartIds'
import { calculateCopPrice, parseCopCurrency } from '@/utilities/priceUtils'

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
      const cachedAllProducts = sessionStorage.getItem('Todos los productos')
      
      // Quick restore from sessionStorage
      if (storedCartID) {
        let parsedCartItems = [];
        try {
          parsedCartItems = storedProducts ? JSON.parse(storedProducts) : [];
        } catch (e) {
          console.error("Failed to parse cartProducts from sessionStorage", e);
          parsedCartItems = [];
        }
        
        // Hydrate cart items with full product data from cache
        let hydratedProducts = parsedCartItems;
        if (cachedAllProducts && parsedCartItems.length > 0) {
          try {
            const allProducts = JSON.parse(cachedAllProducts);
            const cartIdsMap = new Map(parsedCartItems.map(p => [p.productID, p.cantidad]));
            
            hydratedProducts = allProducts
              .filter(p => cartIdsMap.has(p.productID))
              .map(p => ({
                ...p,
                precio: calculateCopPrice(p.precio),
                cantidad: cartIdsMap.get(p.productID) || 1
              }));
            
            console.log("Hydrated cart products:", hydratedProducts);
          } catch (e) {
            console.error("Failed to hydrate cart products", e);
          }
        }
        
        setShoppingCart(prev => ({
          ...prev,
          cartID: storedCartID,
          productos: hydratedProducts,
          items: storedItems ? parseInt(storedItems, 10) : 0,
          suma: storedSum ? parseInt(storedSum, 10) : 0,
          updated: !prev.updated
        }))
      }

      // Initial Load & Subscription
      const initializeCart = async () => {
        let activeCartID = storedCartID;

        // Note: In a real app we might want to dependency inject the user ID here or read from Redux
        // But for this provider which wraps the app, we might rely on the side-effects of AuthListener
        // updating Redux/SessionStorage.
        // Let's rely on sessionStorage for the user ID if available as "wavi_user"
        const storedUser = sessionStorage.getItem('wavi_user');
        if (storedUser) {
             const u = JSON.parse(storedUser);
             if (u.uid) activeCartID = u.uid;
        }

        if (!activeCartID) {
           // Create new Guest ID
           await FirebaseLoadShoppingCart(); 
           activeCartID = sessionStorage.getItem('cartID');
        }


        if (activeCartID) {
            setShoppingCart(prev => ({ ...prev, cartID: activeCartID }));
            
            // Subscribe to Firestore changes
            const { subscribeToCart } = await import('@/services/shoppingCartService');
            const unsubscribe = subscribeToCart(activeCartID, (items) => {
                
                if (items.length > 0) {
                    // Use FirebaseCompareShoppingCartIds to hydrate cart with full product data
                    // This function fetches from cache or Firestore and updates the cart state
                    FirebaseCompareShoppingCartIds({
                        products: items,
                        updateCart: (cartState) => {
                            setShoppingCart(prev => ({
                                ...prev,
                                ...cartState,
                                updated: !prev.updated
                            }));
                        }
                    });
                } else {
                    // Empty cart
                    setShoppingCart(prev => ({
                        ...prev,
                        productos: [],
                        items: 0,
                        suma: 0,
                        updated: !prev.updated
                    }));
                }
            });

            return unsubscribe; // Cleanup needs to be handled
        }
      };

      // We need to manage the cleanup of the subscription
      let unsub = () => {};
      initializeCart().then(fn => { if(fn) unsub = fn; });
      
      return () => {
          unsub();
      }
    }
  }, []);
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

  const removeFromCart = (productID) => {
    console.log('removeFromCart', productID)
    
    setShoppingCart((prev) => {
      const newProductos = prev.productos.filter(item => item.productID !== productID)
      const newItems = newProductos.reduce((acc, item) => acc + (parseInt(item.cantidad) || 0), 0)
      
      // Fix: Use parseCopCurrency to correctly handle "$ X.XXX.XXX" strings
      const newSum = newProductos.reduce((acc, item) => {
         return acc + (parseCopCurrency(item.precio) * (parseInt(item.cantidad) || 1));
      }, 0)

      // Update Session Storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('cartProducts', JSON.stringify(newProductos))
        sessionStorage.setItem('cartItems', newItems)
        sessionStorage.setItem('cartSum', newSum)
      }
      
      // Update Firestore
      if (prev.cartID) {
         saveCartToFirestore(prev.cartID, newProductos.map(p => ({ productID: p.productID, cantidad: p.cantidad || 1 })));
      }

      return {
        ...prev,
        productos: newProductos,
        items: newItems,
        suma: newSum,
        updated: !prev.updated
      }
    })
  }

  return (
    <ShowCartContext.Provider
      value={{ shoppingCart, updateShoppingCart, updateShowCart, updateCart, removeFromCart }}
    >
      {children}
    </ShowCartContext.Provider>
  )
}

export default ShoppingCartProvider
