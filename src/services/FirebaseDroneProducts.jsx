import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { firestore, storage, auth } from "../firebase/firebaseClient";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

function FirebaseDroneProducts (props) {
  const shoppingCartID = localStorage.getItem("cartID") || null;
  const productosDrones = sessionStorage.getItem("Productos_Drones") || null;
  const productosDronesRC =
    sessionStorage.getItem("Productos_DronesRC") || null;
  const _firestore = firestore;
  const _storage = storage;
  const shoppingsRef = collection(_firestore, "shoppingCart");
  // const productsRef = collection(_firestore, "productos/dron/kit_fpv_dron")
  const productsRef = collection(_firestore, "productos");
  const productsDoc = doc(productsRef, "dron");
  const productsCollection = collection(productsDoc, "kit_fpv_dron");
  const productsCollectionRC = collection(productsDoc, "RC");

  // const [storeProducts, setStoreProducts] = useState([]);
  // const [storeProductsRC, setStoreProductsRC] = useState([]);

  var storeProducts = [];
  var storeProductsRC = [];

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    await setDoc(doc(shoppingsRef, userRef), updateInfo, { merge: true });
  };

  // Lectura del catalogo de productos desde firestore
  const productsFromFirestore = async () => {
    const productData = await getDocs(productsCollection);
    const productDataRC = await getDocs(productsCollectionRC);
    let productos = [];
    let productosRC = [];
    productData.forEach((DOC) => {
      productos.push(DOC.data());
    });
    productDataRC.forEach((DOC) => {
      productosRC.push(DOC.data());
    });
    return [productos, productosRC];
  };

  const productosToSessionStore = () => {
    let productData;
    let productos = [];
    let productosRC = [];
    if (!productosDrones || !productosDronesRC) {
      // console.log(productosDrones, productosDronesRC);
      productData = productsFromFirestore();
      productData.then((response) => {
        // console.log(response[0], response[1]);
        productos = response[0];
        productosRC = response[1];
        parsePrices(productos, productosRC);
      });
    } else {
      productos = JSON.parse(productosDrones);
      productosRC = JSON.parse(productosDronesRC);
      parsePrices(productos, productosRC);
    }
  };

  const parsePrices = (productos, productosRC) => {
    // console.log(productos, productosRC);
    if (productos && productos.length > 0) {
      sessionStorage.setItem("Productos_Drones", JSON.stringify(productos));
      productos.map((product, index, array) => {
        // console.log(product.precio);
        if (
          typeof parseInt(product.precio) === "number" &&
          product.precio !== "Agotado"
        ) {
          array[index].precio = parseInt(product.precio).toLocaleString(
            "es-CO",
            { style: "currency", currency: "COP" }
          );
        }
      });
      // setStoreProducts(productos);
      storeProducts = productos;
      //console.log(storeProducts)
    }
    if (productosRC && productosRC.length > 0) {
      sessionStorage.setItem("Productos_DronesRC", JSON.stringify(productosRC));
      productosRC.map((product, index, array) => {
        if (
          typeof parseInt(product.precio) === "number" &&
          product.precio !== "Agotado"
        ) {
          array[index].precio = parseInt(product.precio).toLocaleString(
            "es-CO",
            { style: "currency", currency: "COP" }
          );
        }
      });
      // setStoreProductsRC(productosRC);
      storeProductsRC = productosRC;
    }
    // console.log("response", storeProducts.length, storeProductsRC.length);
    // return { storeProducts, storeProductsRC };
  };

  const newShoppingCart = () => {
    const shoppingsId = uuidv4();
    shoppingsToFirestore({ productos: [] }, shoppingsId);
    localStorage.setItem("cartID", shoppingsId);
    localStorage.setItem("cartUpdated", "id");
  };

  if (!shoppingCartID) {
    console.log("shoppingCartID", shoppingCartID);
    newShoppingCart();
  }

  productosToSessionStore();
  if (storeProducts.length > 0 && storeProductsRC.length > 0) {
      //console.log("response", storeProducts, storeProductsRC);
      // console.log("response", storeProducts.length, storeProductsRC.length);
      const response = { storeProducts, storeProductsRC };
      return response;
  }

  // useEffect(() => {
  //   setTimout(() => {
  //     localStorage.setItem("cartUpdated", "tienda");
  //     console.log("shoppingCartID", shoppingCartID);
  //     if (!shoppingCartID) {
  //       newShoppingCart();
  //     }
  //     productosToSessionStore();
  //   }, 0);
  // }, [shoppingCartID, productosDrones, productosDronesRC]); 
  // productsCollection, productsCollectionRC,
};

export default FirebaseDroneProducts;
