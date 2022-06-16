import React, { useState, useEffect } from "react";
import { firestore, storage } from "../../../firebase/firebaseClient";
import { collection, doc, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "../../components/Typography";
import { withStyles } from "@mui/styles";

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

const TrasmisorReceptor = (props) => {
  const shoppingCartID = localStorage.getItem("cartID") || null;
  const productosReceptor =
    sessionStorage.getItem("Productos_Receptor") || null;
  const _firestore = firestore;
  const _storage = storage;
  const productsRef = collection(_firestore, "productos");
  const productsDoc = doc(productsRef, "radio_control");
  const { classes } = props;
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

  const [storeProductsReceptor, setStoreProductsReceptor] = useState([]);

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
      console.log(productosReceptor);
      productData = productsFromFirestore();
      productData.then((response) => {
        console.log(response);
        productos = response;
        parsePrices(productos);
      });
    } else {
      productos = JSON.parse(productosReceptor);
      parsePrices(productos);
    }
  };

  const parsePrices = (productos) => {
    console.log(productos);
    if (productos && productos.length > 0) {
      sessionStorage.setItem("Productos_Receptor", JSON.stringify(productos));
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
      setStoreProductsReceptor(productos);
      //console.log(storeProducts)
    }
  };

  useEffect(() => {
    productosToSessionStore();
  }, []);

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
          Receptor para drone.
        </Typography>
        {storeProductsReceptor.length == 0 ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body1" className={classes.endingTexts}>
              Receptor para cada necesidad en potencia y distacia de vuelo.
            </Typography>
            <Grid container spacing={2}>
              {storeProductsReceptor.map((product, k) => {
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
      </Box>
    </>
  );
};

export default withStyles(styles)(TrasmisorReceptor);
