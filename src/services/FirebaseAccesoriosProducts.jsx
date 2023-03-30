import { collection, doc, getDocs } from "firebase/firestore";
import { firestore, storage } from "@/firebase/firebaseClient";

function FirebaseAccesoriosProducts(props) {
  let shoppingCartID = null;
  let productosBaterias = null;
  if (typeof window !== "undefined") {
    // Perform localStorage action
    shoppingCartID = sessionStorage.getItem("cartID") || null;
    productosBaterias = sessionStorage.getItem("Productos_Baterias") || null;
  }
  const _storage = storage;
  const _firestore = firestore;
  const productsRef = collection(_firestore, "productos");
  const productsDoc = doc(productsRef, "radio_control");
  var productsBaterias = [];

  const collectionBetafpvBaterias = collection(
    productsDoc,
    "betafpv/baterias/2PCS-2s-300mAh"
  );
  const collectionEachineBaterias = collection(
    productsDoc,
    "eachine/baterias/E520S-1200mAh"
  );
  const collectionEachineBaterias2 = collection(
    productsDoc,
    "eachine/baterias/E58-500mAh"
  );
  const collectionEmaxUsaBaterias = collection(
    productsDoc,
    "emax-usa/baterias/1S-300mAh"
  );
  const collectionEmaxUsaBaterias2 = collection(
    productsDoc,
    "emax-usa/baterias/1S-450mAh"
  );
  const collectionEmaxUsaBaterias3 = collection(
    productsDoc,
    "emax-usa/baterias/2PCS-2S-300mAh"
  );
  const collectionFlywooBaterias = collection(
    productsDoc,
    "flywoo/baterias/4PCS-1S-450mAh"
  );
  const collectionFlywooBaterias2 = collection(
    productsDoc,
    "flywoo/baterias/4PCS-1S-750mAh"
  );
  const collectionGeprcBaterias = collection(
    productsDoc,
    "geprc/baterias/4S-650a850mAh"
  );
  const collectionIflightBaterias = collection(
    productsDoc,
    "iflight-rc/baterias/3S-450mAh"
  );
  const collectionUruavBaterias = collection(
    productsDoc,
    "uruav/baterias/1S-250mAh"
  );

  const productsFromFirestore = async () => {
    const collectionBaterias = new Array(
      collectionBetafpvBaterias,
      collectionEachineBaterias,
      collectionEachineBaterias2,
      collectionEmaxUsaBaterias,
      collectionEmaxUsaBaterias2,
      collectionEmaxUsaBaterias3,
      collectionFlywooBaterias,
      collectionFlywooBaterias2,
      collectionGeprcBaterias,
      collectionIflightBaterias,
      collectionUruavBaterias
    );
    let productosBaterias = [];
    for (let product of collectionBaterias) {
      // console.log(product, collectionBaterias)
      let productDataBaterias = await getDocs(product);
      productDataBaterias.forEach((DOC) => {
        productosBaterias.push(DOC.data());
      });
    }
    return productosBaterias;
  };

  const productosToSessionStore = () => {
    let productData;
    let productos = [];
    if (!productosBaterias) {
      // console.log(productosBaterias);
      productData = productsFromFirestore();
      productData.then((response) => {
        // console.log(response);
        productos = response;
        parsePrices(productos);
      });
    } else {
      productos = JSON.parse(productosBaterias);
      parsePrices(productos);
    }
  };

  const parsePrices = (productos) => {
    // console.log(productos);
    if (productos && productos.length > 0 && typeof window !== "undefined") {
      sessionStorage.setItem("Productos_Baterias", JSON.stringify(productos));
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
      // setStoreProductsBaterias(productos);
      //console.log(storeProducts)
      productsBaterias = productos;
    }
  };
  productosToSessionStore();
  if (productsBaterias.length > 0) {
    return { productsBaterias };
  }
}

export default FirebaseAccesoriosProducts;
