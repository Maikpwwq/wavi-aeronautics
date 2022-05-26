import React, { useState, useEffect } from "react";
import { firestore, storage } from "../../../firebase/firebaseClient";
import { collection, doc, getDocs } from "firebase/firestore";
import Box from "@mui/material/Box";
import ProductCard from "../components/ProductCard";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

const Products = () => {
  const _firestore = firestore;
  const _storage = storage;
  // const productsRef = collection(_firestore, "productos/dron/kit_fpv_dron")
  const productsRef = collection(_firestore, "productos");
  const productsDoc = doc(productsRef, "dron");
  const productsCollection = collection(productsDoc, "kit_fpv_dron");
  const productsCollectionRC = collection(productsDoc, "RC");

  const [storeProducts, setStoreProducts] = useState([]);
  const [storeProductsRC, setStoreProductsRC] = useState([]);

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
      setStoreProducts(productos);
    }
    if (productosRC.length > 0) {
      setStoreProductsRC(productosRC);
    }
  };

  useEffect(() => {
    productosFromFirestore();
  }, []);

  return (
    <>
      <h3>Productos:</h3>
      <br />
      <div>
        {storeProducts.length == 0 ? (
          // <p>Cargando productos!</p>
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
                // console.log(product, k);
                // productID
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
                // console.log(product, k);
                // productID
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
