import React, { useState, useEffect } from "react";
import { firestore, storage } from "../../../firebase/firebaseClient";
import { collection, doc, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "../../components/Typography";
import ShopConditions from "../components/ShopConditions";
import { withStyles } from "@mui/styles";

const styles = (theme) => ({
  presentationProducts: {
    margin: `${theme.spacing(4)} ${theme.spacing(4)}`,
  },
});

const RadioContol = (props) => {
  const shoppingCartID = localStorage.getItem("cartID") || null;
  const productosRadioControl = sessionStorage.getItem("Productos_RC") || null;
  const _firestore = firestore;
  const _storage = storage;
  const productsRef = collection(_firestore, "productos");
  const productsDoc = doc(productsRef, "radio_control");
  const { classes } = props;
  const collectionBetafpvCR = collection(
    productsDoc,
    "betafpv/control-remoto/lite-radio2"
  );
  const collectionEachineCR = collection(
    productsDoc,
    "eachine/control-remoto/liteRadio-2.4G"
  );
  const collectionFlywooCR = collection(
    productsDoc,
    "flywoo/control-remoto/LiteRadio-V3-ELRS"
  );
  const collectionFlywooCR2 = collection(
    productsDoc,
    "flywoo/control-remoto/LiteRadio-V3-TBS"
  );
  const collectionGeprcCR = collection(
    productsDoc,
    "geprc/control-remoto/tinyRadio-GR8"
  );
  const collectionIflightCR = collection(
    productsDoc,
    "iflight-rc/control-remoto/iF8-E"
  );
  const collectionRadioMasterCR = collection(
    productsDoc,
    "radio-master/control-remoto/T8-Lite"
  );
  const collectionRadioMasterCR2 = collection(
    productsDoc,
    "radio-master/control-remoto/T8-Pro"
  );
  const collectionRadioMasterCR3 = collection(
    productsDoc,
    "radio-master/control-remoto/tx12"
  );
  const collectionRadioMasterCR4 = collection(
    productsDoc,
    "radio-master/control-remoto/tx16s"
  );
  const collectionTBSCR = collection(
    productsDoc,
    "team-blacksheep/control-remoto/ethix-mambo"
  );
  const collectionTBSCR2 = collection(
    productsDoc,
    "team-blacksheep/control-remoto/tango2pro"
  );

  const [storeProductsRC, setStoreProductsRC] = useState([]);

  const productsFromFirestore = async () => {
    const collectionRC = new Array(
      collectionBetafpvCR,
      collectionEachineCR,
      collectionFlywooCR,
      collectionFlywooCR2,
      collectionGeprcCR,
      collectionIflightCR,
      collectionRadioMasterCR,
      collectionRadioMasterCR2,
      collectionRadioMasterCR3,
      collectionRadioMasterCR4,
      collectionTBSCR,
      collectionTBSCR2
    );
    let productosRC = [];
    for (let product of collectionRC) {
      // console.log(product, collectionRC);
      let productDataRC = await getDocs(product);
      productDataRC.forEach((DOC) => {
        productosRC.push(DOC.data());
      });
    }
    return productosRC;
  };

  const productosToSessionStore = () => {
    let productData;
    let productos = [];
    if (!productosRadioControl) {
      console.log(productosRadioControl);
      productData = productsFromFirestore();
      productData.then((response) => {
        console.log(response);
        productos = response;
        parsePrices(productos);
      });
    } else {
      productos = JSON.parse(productosRadioControl);
      parsePrices(productos);
    }
  };

  const parsePrices = (productos) => {
    console.log(productos);
    if (productos && productos.length > 0) {
      sessionStorage.setItem("Productos_RC", JSON.stringify(productos));
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
      setStoreProductsRC(productos);
      //console.log(storeProducts)
    }
  };

  useEffect(() => {
    productosToSessionStore();
  }, []);

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column" }}
        className={classes.presentationProducts}
      >
        <Typography variant="h5">Dispositivos de Contol Remoto.</Typography>
        <br />
        <br />
        {storeProductsRC.length == 0 ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body1">
              Controles remotos para volar Drones de RadioContol.
            </Typography>
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
          </>
        )}
        <ShopConditions />
      </Box>
    </>
  );
};

export default withStyles(styles)(RadioContol);
