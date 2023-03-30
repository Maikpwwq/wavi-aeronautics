"use client";
import React, { useState, useContext } from "react";
import { firestore, auth } from "@/firebase/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
// import { sharingInformationService } from "./sharing-information";
import { ShowCartContext } from "@/app/tienda/providers/ShoppingCartProvider";
import PropTypes from "prop-types";

export const FirebaseCompareShoppingCartIds = ({ products, updateCart }) => {
  // const { updateCart } = useContext(ShowCartContext);
  console.log("products", products, updateCart);
  const AllProducts = sessionStorage.getItem("Todos los productos") || null;
  const shoppingCartItems =
    sessionStorage.getItem("cartProducts") !== 0
      ? sessionStorage.getItem("cartProducts")
      : null;
  const shoppingCartSuma =
    sessionStorage.getItem("cartSum") !== 0
      ? sessionStorage.getItem("cartSum")
      : null;

  const productosIds = products || [""];
  // console.log("productosIds", productosIds);

  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID");
  const usedID = userID ? userID : shoppingCartID;
  const _firestore = firestore;
  const storeKitRef = collection(_firestore, "productos/dron/kit_fpv_dron");
  const storeRCRef = collection(_firestore, "productos/dron/RC");

  var shoppingCart = [];

  // TODO: replace for arrow function: search product by id? need to use all Refs in comparison
  const productsFromFirestore = async () => {
    // console.log(shoppingsRef, userID);
    const collectionsWavi = new Array(storeRCRef, storeKitRef);
    let productData = [];
    for (let product of collectionsWavi) {
      let colectionData = await getDocs(product);
      colectionData.forEach((DOC) => {
        productData.push(DOC.data());
      });
    }
    localStorage.setItem("cartUpdated", "productos");
    return productData;
  };

  const shoppingsFromFirestore = () => {
    let productData;
    if (!AllProducts) {
      // console.log(AllProducts);
      productData = productsFromFirestore();
      // console.log(productData);
      productData.then((response) => {
        compareProductsIDs(response);
        // console.log(response);
        localStorage.setItem("cartUpdated", "firestore");
        sessionStorage.setItem("Todos los productos", JSON.stringify(response));
      });
    } else {
      productData = JSON.parse(AllProducts);
      compareProductsIDs(productData);
      localStorage.setItem("cartUpdated", "sessionStorage");
      if (shoppingCartSuma > 0) {
        sessionStorage.setItem("cartSum", shoppingCartSuma);
      }
      if (shoppingCartItems > 0) {
        sessionStorage.setItem("cartProducts", shoppingCartItems);
      }
    }
  };

  const compareProductsIDs = (productData) => {
    let cardProductos = [];
    let productos = [];
    // comparar productos por ids
    if (productData && productData.length > 0) {
      // console.log("productData", productData, productos);
      productos = productData;
      let counter = 0;
      productos.map((DOC) => {
        // console.log(DOC);
        let iD = DOC.productID;
        for (let codigo of productosIds) {
          // console.log(iD, codigo);
          if (iD === codigo) {
            cardProductos.push(DOC);
            counter++;
          }
        }
      });
      if (cardProductos !== [] && cardProductos.length > 0) {
        // console.log("cardProductos", cardProductos);
        // setShoppingCart({
        //   ...shoppingCart,
        //   productos: cardProductos,
        //   items: cardProductos.length,
        // });
        shoppingCart.productos = cardProductos;
        shoppingCart.items = cardProductos.length;
        // console.log(shoppingCart);
        localStorage.setItem("cartUpdated", "filterItems");
        sessionStorage.setItem("cartProducts", cardProductos.length);
        calculateCartAmount(cardProductos);
      }
    }
  };

  const calculateCartAmount = (cardProductos) => {
    let acomulateSum = 0;
    // console.log(acomulateSum);
    cardProductos.map((product, k) => {
      // console.log(acomulateSum, product.precio);
      if (
        typeof parseInt(product.precio) === "number" &&
        product.precio !== "Agotado"
      ) {
        acomulateSum += parseInt(product.precio);
      }
    });
    if (acomulateSum > 0) {
      // console.log(acomulateSum);
      // setShoppingCart({ ...shoppingCart, suma: acomulateSum });
      shoppingCart.suma = acomulateSum;
      localStorage.setItem("cartUpdated", "suma");
      sessionStorage.setItem("cartSum", acomulateSum);
      // localStorage.removeItem("cartUpdated");
      // console.log("service", shoppingCart);
      if (!!shoppingCart.productos) {
        console.log("service", shoppingCart);
        updateCart(shoppingCart);
        // sharingInformationService.setSubject(shoppingCart);
      }
    }
  };

  if (usedID) {
    shoppingsFromFirestore();
  }
};

FirebaseCompareShoppingCartIds.propTypes = {
  products: PropTypes.array.isRequired,
};

export default FirebaseCompareShoppingCartIds;
