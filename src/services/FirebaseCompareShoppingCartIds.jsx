"use client";
import React, { useState, useContext } from "react";
import { firestore, auth } from "@/firebase/firebaseClient";
import { collection, getDocs } from "firebase/firestore";
// import { sharingInformationService } from "./sharing-information";
import PropTypes from "prop-types";

export const FirebaseCompareShoppingCartIds = ({ products, updateCart }) => {
  console.log("products", products, updateCart);
  const AllProducts = sessionStorage.getItem("Todos los productos") || null;
  // const shoppingCartItems =
  //   sessionStorage.getItem("cartProducts") !== 0
  //     ? sessionStorage.getItem("cartProducts")
  //     : null;
  // const shoppingCartSuma =
  //   sessionStorage.getItem("cartSum") !== 0
  //     ? sessionStorage.getItem("cartSum")
  //     : null;

  //     if (shoppingCartSuma > 0) {
  //       sessionStorage.setItem("cartSum", shoppingCartSuma);
  //     }

  let productosIds = [];
  let productosCantidades = [];

  const extractProductsID = (products) => {
    products.map(({ productID }, index) => {
      productosIds[index] = productID;
    });
    console.log("extractProductsID", productosIds);
  };

  const extractProductAmount = (products) => {
    products.map(({ cantidad }, index) => {
      productosCantidades[index] = cantidad;
    });
    console.log("extractProductAmount", productosCantidades);
  };

  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = sessionStorage.getItem("cartID");
  const usedID = userID ? userID : shoppingCartID;
  const _firestore = firestore;
  // Dron
  const storeKitRef = collection(_firestore, "productos/dron/kit_fpv_dron");
  const storeRCRef = collection(_firestore, "productos/dron/RC");
  // Radio Control
  const storeBetafpvRef = collection(
    _firestore,
    "productos/radio_control/betafpv"
  );
  const storeEachineRef = collection(
    _firestore,
    "productos/radio_control/eachine"
  );
  const storeEmaxUsaRef = collection(
    _firestore,
    "productos/radio_control/emax-usa"
  );
  const storeFlyskyRef = collection(
    _firestore,
    "productos/radio_control/flysky"
  );
  const storeFlywooRef = collection(
    _firestore,
    "productos/radio_control/flywoo"
  );
  const storeFrskyRef = collection(_firestore, "productos/radio_control/frsky");
  const storeGeprcRef = collection(_firestore, "productos/radio_control/geprc");
  const storeIflightRef = collection(
    _firestore,
    "productos/radio_control/iflight-rc"
  );
  const storeRadioMasterRef = collection(
    _firestore,
    "productos/radio_control/radio-master"
  );
  const storeTBSRef = collection(
    _firestore,
    "productos/radio_control/team-blacksheep"
  );
  const storeUruavRef = collection(_firestore, "productos/radio_control/uruav");

  var shoppingCart = [];

  // TODO: replace for arrow function: search product by id? need to use all Refs in comparison
  const productsFromFirestore = async () => {
    // console.log(shoppingsRef, userID);
    const collectionsWavi = new Array(
      storeRCRef,
      storeKitRef,
      storeBetafpvRef,
      storeEachineRef,
      storeEmaxUsaRef,
      storeFlyskyRef,
      storeFlywooRef,
      storeFrskyRef,
      storeGeprcRef,
      storeIflightRef,
      storeRadioMasterRef,
      storeTBSRef,
      storeUruavRef
    );
    let productData = [];
    for (let product of collectionsWavi) {
      let colectionData = await getDocs(product);
      colectionData.forEach((DOC) => {
        productData.push(DOC.data());
      });
    }
    sessionStorage.setItem("cartUpdated", "productos");
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
        sessionStorage.setItem("cartUpdated", "firestore");
        sessionStorage.setItem("Todos los productos", JSON.stringify(response));
      });
    } else {
      productData = JSON.parse(AllProducts);
      compareProductsIDs(productData);
      sessionStorage.setItem("cartUpdated", "sessionStorage");
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
            // Se identifica por ID que producto representa para ser añadido
            cardProductos.push(DOC);
            // Se hace uso de las cantidades asginadas en el carrito de compras
            cardProductos[counter].cantidad = productosCantidades[counter];
            // Nuestra marca para identificar el producto en el array
            counter++;
          }
        }
      });
      if (cardProductos !== [] && cardProductos.length > 0) {
        console.log("cardProductos", cardProductos);
        shoppingCart.productos = cardProductos;
        // Se determina la cantidad de objetos agregados al carrito de compras
        // cardProductos.length;
        let totalCantidades = 0;
        productosCantidades.map((cantidad) => {
          totalCantidades += cantidad;
        });
        shoppingCart.items = totalCantidades;
        console.log("compareProductAmounts", shoppingCart, totalCantidades);
        sessionStorage.setItem("cartUpdated", "filterItems");
        sessionStorage.setItem("cartProducts", totalCantidades);
        // Se envia listado de productos para calcular el valor del carrito de compras
        calculateCartAmount(cardProductos);
      }
    }
  };

  const calculateCartAmount = (cardProductos) => {
    let acomulateSum = 0;
    // console.log(acomulateSum);
    cardProductos.map((product, k) => {
      // console.log(acomulateSum, product.precio);
      const { precio, cantidad } = product;
      if (typeof parseInt(precio) === "number" && precio !== "Agotado") {
        acomulateSum += parseInt(precio) * cantidad;
      }
    });
    if (acomulateSum > 0) {
      // console.log(acomulateSum);
      // setShoppingCart({ ...shoppingCart, suma: acomulateSum });
      shoppingCart.suma = acomulateSum;
      sessionStorage.setItem("cartUpdated", "suma");
      sessionStorage.setItem("cartSum", acomulateSum);
      // sessionStorage.removeItem("cartUpdated");
      console.log("service", shoppingCart);
      if (!!shoppingCart.productos) {
        console.log("service", shoppingCart);
        updateCart(shoppingCart);
        // sharingInformationService.setSubject({shoppingCart});
      }
    }
  };

  if (usedID) {
    // Funciones para procesar datos de entrada
    extractProductsID(products);
    extractProductAmount(products);
    // Funcion para obtener de Firestore todos los productos de la tienda
    shoppingsFromFirestore();
  }
};

FirebaseCompareShoppingCartIds.propTypes = {
  products: PropTypes.array.isRequired,
};

export default FirebaseCompareShoppingCartIds;
