import React from "react";
import { firestore } from "@/firebase/firebaseClient";
import { collection, doc, getDocs } from "firebase/firestore";

function FirebaseTrasmisorReceptorProducts(props) {
  let productosReceptor = null;
  if (typeof window !== "undefined") {
    // Perform localStorage action
    productosReceptor = sessionStorage.getItem("Productos_Receptor") || null;
  }
  const _firestore = firestore;
  const productsRef = collection(_firestore, "productos");
  const productsDoc = doc(productsRef, "radio_control");

  var storeProductsReceptor = [];

  const collectionBetafpvReceptor = collection(
    productsDoc,
    "betafpv/receptor/BETAFPV-ELRS"
  );
  const collectionFlyskyReceptor = collection(
    productsDoc,
    "flysky/receptor/Flysky-FS-X14S-V2"
  );
  const collectionFlyskyReceptor2 = collection(
    productsDoc,
    "flysky/receptor/Flysky-FS-iA8X"
  );
  const collectionFlywooReceptor = collection(
    productsDoc,
    "flywoo/receptor/Flywoo-ELRS"
  );
  const collectionFrskyReceptor = collection(
    productsDoc,
    "frsky/receptor/Frsky_R-XSR"
  );
  const collectionFrskyReceptor2 = collection(
    productsDoc,
    "frsky/receptor/Frsky_XM+"
  );
  const collectioniFlightReceptor = collection(
    productsDoc,
    "iflight-rc/receptor/iFlight-R81-SPI"
  );
  const collectionRadioMasterReceptor = collection(
    productsDoc,
    "radio-master/receptor/NANO-ELRS-EP2"
  );
  const collectionRadioMasterReceptor2 = collection(
    productsDoc,
    "radio-master/receptor/RadioMaster-R81"
  );
  const collectionTeamBlacksheepReceptor = collection(
    productsDoc,
    "team-blacksheep/receptor/Crossfire-Nano-RX"
  );
  const collectionTeamBlacksheepReceptor2 = collection(
    productsDoc,
    "team-blacksheep/receptor/Crossfire-Nano-RX-Pro"
  );
  const collectionTeamBlacksheepReceptor3 = collection(
    productsDoc,
    "team-blacksheep/receptor/Crossfire-Nano-RX-SE"
  );
  const collectionTeamBlacksheepReceptor4 = collection(
    productsDoc,
    "team-blacksheep/receptor/Traser-Nano-RX"
  );

  const productsFromFirestore = async () => {
    const collectionReceptor = new Array(
      collectionBetafpvReceptor,
      collectionFlyskyReceptor,
      collectionFlyskyReceptor2,
      collectionFlywooReceptor,
      collectionFrskyReceptor,
      collectionFrskyReceptor2,
      collectioniFlightReceptor,
      collectionRadioMasterReceptor,
      collectionRadioMasterReceptor2,
      collectionTeamBlacksheepReceptor,
      collectionTeamBlacksheepReceptor2,
      collectionTeamBlacksheepReceptor3,
      collectionTeamBlacksheepReceptor4
    );
    let productosReceptor = [];
    for (let product of collectionReceptor) {
      // console.log(product, collectionReceptor)
      let productDataReceptor = await getDocs(product);
      productDataReceptor.forEach((DOC) => {
        productosReceptor.push(DOC.data());
      });
    }
    return productosReceptor;
  };

  const productosToSessionStore = () => {
    let productData;
    let productos = [];
    if (!productosReceptor) {
      //console.log(productosReceptor);
      productData = productsFromFirestore();
      productData.then((response) => {
        //console.log(response);
        productos = response;
        parsePrices(productos);
      });
    } else {
      productos = JSON.parse(productosReceptor);
      parsePrices(productos);
    }
  };

  const parsePrices = (productos) => {
    //console.log(productos);
    if (productos && productos.length > 0 && typeof window !== "undefined") {
      sessionStorage.setItem("Productos_Receptor", JSON.stringify(productos));
      productos.map((product, index, array) => {
        //console.log(product.precio);
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
      // setStoreProductsReceptor(productos);
      //console.log(storeProducts)
      storeProductsReceptor = productos;
    }
  };

  productosToSessionStore();
  if (storeProductsReceptor.length > 0) {
    return { storeProductsReceptor };
  }
}

export default FirebaseTrasmisorReceptorProducts;
