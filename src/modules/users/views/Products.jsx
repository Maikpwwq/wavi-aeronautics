import React, { useState, useEffect } from "react";
import { firestore, storage } from "../../../firebase/firebaseClient";
import { collection, doc, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import Grid from "@mui/material/Grid";

const Products = () => {
  const _firestore = firestore;
  const _storage = storage;
  // const productsRef = collection(_firestore, "productos/dron/kit_fpv_dron")
  const productsRef = collection(_firestore, "productos");
  const productsDoc = doc(productsRef, "dron");
  const productsCollection = collection(productsDoc, "kit_fpv_dron");

  const [storeProducts, setStoreProducts] = useState([]);

  const productosFromFirestore = async () => {
    const productData = await getDocs(productsCollection);
    let productos = [];
    productData.forEach((DOC) => {
      productos.push(DOC.data());
      //   console.log(DOC.data());
    });
    if (productos.length > 0) {
      setStoreProducts(productos);
    }
    // return productData;
  };

  useEffect(() => {
    productosFromFirestore(); //const productData =
    // productData.then((docSnap) => {
    //     if (docSnap) {
    //       let productos = [];
    //       docSnap.forEach((DOC) => {
    //         productos.push(DOC.data());
    //       });
    //       if (productos.length > 0) {
    //         setStoreProducts(productos);
    //       }
    //     } else {
    //       console.log("No hay productos en esta categoria!");
    //     }
    //   });
  }, []);

  //   console.log(storeProducts);

  return (
    <>
      <h3>Productos</h3>
      <div>
        {storeProducts.length == 0 ? (
          <p>Cargando productos!</p>
        ) : (
          <div>
            <p>Descubre los mejores kits de Dron FPV listos para vuelo.</p>
            <Grid container spacing={2}>
              {storeProducts.map((product, k) => {
                console.log(product);
                return (
                  <Grid item sm={12} xs={12} md={5} lg={4} xl={3}>
                    <ProductCard
                      className="d-flex mb-2"
                      key={k}
                      products={product}
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
