import React, { useState } from "react";
import { firestore, storage, auth } from "../firebase/firebaseClient";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

function FirebaseShoppingCart(props) {
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID");
  const shoppingUpdatedItems = localStorage.getItem("cartUpdated");
  const usedID = userID ? userID : shoppingCartID;
  const _firestore = firestore;
  const shoppingsRef = collection(_firestore, "shoppingCart");

  var shoppingCart = [];

  const shoppingsFromFirestore = async () => {
    let cardProductos = {};
    // console.log(shoppingsRef, userID);
    const productData = await getDoc(doc(shoppingsRef, usedID));
    //console.log(productData.data());
    for (var index in productData.data()) {
      // console.log(productData.data()[index]); //.Status == "Valid"
      if (productData.data()[index]) {
        cardProductos[index] = productData.data()[index];
      }
    }
    if (cardProductos && cardProductos.productos != []) {
      // console.log(cardProductos, shoppingCart);
      // setShoppingCart({
      //   ...shoppingCart,
      //   productos: cardProductos.productos,
      // });
      // return cardProductos;
      shoppingCart = cardProductos.productos;
    }
    // return { productos: [] };
  };

  shoppingsFromFirestore();

  if (shoppingCart.length > 0) {
    return { shoppingCart };
  }
}

export default FirebaseShoppingCart;
