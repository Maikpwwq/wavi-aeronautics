import React, { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { firestore, auth } from "../firebase/firebaseClient";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
// import { sharingInformationService } from "./sharing-information";
// import { createCart } from "../store/states/shopping_cart";
// import store from "../../ssr/renderApp.js";

// import { connect, useStore } from "react-redux";
import { ShowCartContext } from "../pages/commerce/providers/ShoppingCartProvider";
import FirebaseCompareShoppingCartIds from "./FirebaseCompareShoppingCartIds";


export const FirebaseLoadShoppingCart = () => { // { dispatch }

  const { updateShoppingCart, updateCart } = useContext(ShowCartContext);

  // console.log("props", createCart);
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID") || null;

  // const shoppingUpdatedItems = localStorage.getItem("cartUpdated");
  const usedID = userID ? userID : shoppingCartID;
  const _firestore = firestore;
  const shoppingsRef = collection(_firestore, "shoppingCart");

  var shoppingCart = [];

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    await setDoc(doc(shoppingsRef, userRef), updateInfo, { merge: true });
  };

  const shoppingsFromFirestore = async () => {
    let cardProductos = {};
    const productData = await getDoc(doc(shoppingsRef, usedID));
    for (var index in productData.data()) {
      // console.log(productData.data()[index]);
      if (productData.data()[index]) {
        cardProductos[index] = productData.data()[index];
      }
    }
    if (cardProductos && cardProductos.productos != []) {
      shoppingCart = cardProductos.productos;
      // console.log("store", cardProductos, shoppingCart);
    }
  };

  const newShoppingCart = () => {
    const shoppingsId = uuidv4();
    shoppingsToFirestore({ productos: [] }, shoppingsId);
    localStorage.setItem("cartID", shoppingsId);
    localStorage.setItem("cartUpdated", "id");
  };

  // if (!shoppingCartID) {
  //   console.log("shoppingCartID", shoppingCartID);
  //   newShoppingCart();
  // }

  if (!!usedID) {
    shoppingsFromFirestore().then(() => {
      console.log("shoppingCart", shoppingCart);
      // store.dispatch(createCard(shoppingCart));
      // dispatch.createCart(shoppingCart);
      updateShoppingCart(shoppingCart);
      FirebaseCompareShoppingCartIds({shoppingCart, updateCart}); 
      // sharingInformationService.setSubject(shoppingCart);
      // return shoppingCart;
    });
  }
};

const mapStateToProps = {};

// const mapDispatchToProps = (dispatch) => {
  //    dispatching plain actions
  // createCart,
  // return {
    // ...bindActionCreators({ createCart }, dispatch)
    // createCart: (shoppingCart) => dispatch.createCart(shoppingCart),
    // createCart,
    // dispatch,
//   };
// };

export default FirebaseLoadShoppingCart;
// export default connect(
//   mapStateToProps,
//   null //mapDispatchToProps
// )(FirebaseLoadShoppingCart);
