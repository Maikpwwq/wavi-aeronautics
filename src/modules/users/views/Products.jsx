import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { firestore, storage, auth } from "../../../firebase/firebaseClient";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useTheme } from "@mui/material/styles";
import { withStyles } from "@mui/styles";

import 'sessionstorage-polyfill'
import 'localstorage-polyfill'
global.sessionstorage
global.localStorage

import Box from "@mui/material/Box";
import ProductCard from "../components/ProductCard";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "../../components/Typography";

const styles = (theme) => ({
  presentationProducts: {
    margin: `${theme.spacing(4)} ${theme.spacing(2)}`,
  },
  spacingTexts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`,
  },
  endingTexts: {
    marginBottom: `${theme.spacing(2)} !important`,
  },
});

const Products = (props) => {
  // const user = auth.currentUser || {};
  // const userID = user.uid || null;
  const { classes } = props;
  const theme = useTheme();
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

  const [storeProducts, setStoreProducts] = useState([]);
  const [storeProductsRC, setStoreProductsRC] = useState([]);

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
      console.log(productosDrones, productosDronesRC);
      productData = productsFromFirestore();
      productData.then((response) => {
        console.log(response[0], response[1]);
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
    console.log(productos, productosRC);
    if (productos && productos.length > 0) {
      sessionStorage.setItem("Productos_Drones", JSON.stringify(productos));
      productos.map((product, index, array) => {
        console.log(product.precio);
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
      setStoreProducts(productos);

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
      setStoreProductsRC(productosRC);
    }
  };

  const newShoppingCart = () => {
    const shoppingsId = uuidv4();
    shoppingsToFirestore({ productos: [] }, shoppingsId);
    localStorage.setItem("cartID", shoppingsId);
    localStorage.setItem("cartUpdated", "id");
  };

  useEffect(() => {
    localStorage.setItem("cartUpdated", "tienda");
    console.log("shoppingCartID", shoppingCartID);
    if (!shoppingCartID) {
      newShoppingCart();
    }
    productosToSessionStore();
  }, [shoppingCartID]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 2,
          mb: 2,
          ps: 2,
          pe: 2,
        }}
      >
        <Typography variant="h5" className={classes.spacingTexts}>
          Kits de Dron FPV:
        </Typography>
        <>
          {storeProducts.length == 0 ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="body1" className={classes.endingTexts}>
                Descubre los mejores kits de Dron FPV listos para vuelo.
              </Typography>
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
              <Typography variant="h5" className={classes.spacingTexts}>
                Drones a control remoto BNF/PNP/RTF.{" "}
              </Typography>
              <Typography variant="body1">
                Bind aNd Fly: Esta versión es la que viene con todo menos con el
                transmisor y el radio control.
              </Typography>
              <Typography variant="body1">
                Plug aNd Play: Esta es la versión incluye todo menos el
                transmisor, el radio control, el receptor, batería y cargador.
              </Typography>
              <Typography variant="body1" className={classes.endingTexts}>
                Ready To Fly: Esta es la versión completa, puede funcionar desde
                el momento que lo recibes.
              </Typography>
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
            </>
          )}
        </>
      </Box>
    </>
  );
};

export default withStyles(styles)(Products);
