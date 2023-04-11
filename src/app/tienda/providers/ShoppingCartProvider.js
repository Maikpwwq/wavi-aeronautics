import React, { useState, createContext } from "react";

export const ShowCartContext = createContext(); 

const ShoppingCartProvider = ({ children }) => { 
  
  const [shoppingCart, setShoppingCart] = useState({
    productos: [],
    show: false,
    updated: false,
    suma: 0,
    items: 0,
  });
  const updateShoppingCart = (newProductos) => {
    console.log("updateShoppingCart", newProductos);
    setShoppingCart((shoppingCart) => ({
      ...shoppingCart,
      productos: newProductos,
    }));
  };
  const updateCart = (newData) => {
    console.log("updateCart", newData);
    setShoppingCart((shoppingCart) => ({
      ...shoppingCart,
      ...newData,
    }));
  };
  const updateShowCart = (bool) => {
    console.log("updateShowCart", bool);
    setShoppingCart((shoppingCart) => ({
      ...shoppingCart,
      show: bool,
    }));
  };
//   const updateCart = (bool) => {
//     setShoppingCart((shoppingCart) => ({
//       ...shoppingCart,
//       updated: bool,
//     }));
//  };

  return (
    <ShowCartContext.Provider
      value={{ shoppingCart, updateShoppingCart, updateShowCart, updateCart }}
    >
      {children}
    </ShowCartContext.Provider>
  );
}

export default ShoppingCartProvider;
