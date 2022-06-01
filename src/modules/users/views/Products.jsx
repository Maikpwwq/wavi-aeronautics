import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { firestore, storage, auth } from "../../../firebase/firebaseClient";
import { collection, doc, getDocs } from "firebase/firestore";
import Box from "@mui/material/Box";
import ProductCard from "../components/ProductCard";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

const Products = () => {
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID") || null;
  const _firestore = firestore;
  const _storage = storage;
  const shoppingsRef = collection(_firestore, "shoppingCart");
  // const productsRef = collection(_firestore, "productos/dron/kit_fpv_dron")
  const productsRef = collection(_firestore, "productos");
  const productsDoc = doc(productsRef, "dron");
  const productsCollection = collection(productsDoc, "kit_fpv_dron");
  const productsCollectionRC = collection(productsDoc, "RC");

  const [storeProducts, setStoreProducts] = useState([]);
  const [storeProductsRC, setStoreProductsRC] = useState([]);

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    await setDoc(doc(shoppingsRef, userRef), updateInfo, { merge: true });
  };

  const productosFromFirestore = async () => {
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
    if (productos.length > 0) {
      productos.map((product, index, array) => {
        if (product.precio !== "Agotado") {
          array[index].precio = parseInt(product.precio).toLocaleString(
            "es-CO",
            { style: "currency", currency: "COP" }
          );
        }
      });
      setStoreProducts(productos);
      //console.log(storeProducts)
    }
    if (productosRC.length > 0) {
      productosRC.map((product, index, array) => {
        if (product.precio !== "Agotado") {
          array[index].precio = parseInt(product.precio).toLocaleString(
            "es-CO",
            { style: "currency", currency: "COP" }
          );
        }
      });
      setStoreProductsRC(productosRC);
    }
  };

  const newShoppingCart = () => {
    const shoppingsId = uuidv4();
    shoppingsToFirestore({ productos: [] }, shoppingsId);
    localStorage.setItem("cartID", shoppingsId);
  };

  useEffect(() => {
    console.log("shoppingCartID", shoppingCartID)
    if (!userID && !shoppingCartID){
      newShoppingCart();
    }
    productosFromFirestore(); // Lectura del catalogo de productos desde firestore
  }, [shoppingCartID]);

  return (
    <>
      <h3>Productos:</h3>
      <br />
      <div>
        {storeProducts.length == 0 ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <div>
            <p>Descubre los mejores kits de Dron FPV listos para vuelo.</p>
            <br />
            <br />
            <Grid container spacing={2}>
              {storeProducts.map((product, k) => {
                return (
                  <Grid item key={k} sm={12} xs={12} md={5} lg={4} xl={3}>
                    <ProductCard
                      className="d-flex mb-2"
                      products={product}
                      productID={k}
                    ></ProductCard>
                  </Grid>
                );
              })}
            </Grid>
            <br />
            <br />
            <h3>Drones a control remoto BNF/PNP/RTF. </h3>
            <br />
            <br />
            <p>
              Bind aNd Fly: Esta versión es la que viene con todo menos con el
              transmisor y el radio control./
            </p>
            <p>
              Plug aNd Play: Esta es la versión incluye todo menos el
              transmisor, el radio control, el receptor, batería y cargador./
            </p>
            <p>
              Ready To Fly: Esta es la versión completa, puede funcionar desde
              el momento que lo recibes.
            </p>
            <br />
            <br />
            <Grid container spacing={2}>
              {storeProductsRC.map((product, k) => {
                return (
                  <Grid item key={k} sm={12} xs={12} md={5} lg={4} xl={3}>
                    <ProductCard
                      className="d-flex mb-2"
                      products={product}
                      productID={k}
                    ></ProductCard>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
