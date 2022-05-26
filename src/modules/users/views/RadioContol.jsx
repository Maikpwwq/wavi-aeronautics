import React, { useState, useEffect } from "react";
import { firestore, storage } from "../../../firebase/firebaseClient";
import { collection, doc, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

const RadioContol = () => {
  const _firestore = firestore;
  const _storage = storage;
  const productsRef = collection(_firestore, "productos");
  const productsDoc = doc(productsRef, "radio_control");

  const collectionBetafpvBaterias = collection(
    productsDoc,
    "betafpv/baterias/2PCS-2s-300mAh"
  );
  const collectionBetafpvCR = collection(
    productsDoc,
    "betafpv/control-remoto/lite-radio2"
  );
  const collectionEachineBaterias = collection(
    productsDoc,
    "eachine/baterias/E520S-1200mAh"
  );
  const collectionEachineBaterias2 = collection(
    productsDoc,
    "eachine/baterias/E58-500mAh"
  );
  const collectionEachineCR = collection(
    productsDoc,
    "eachine/control-remoto/liteRadio-2.4G"
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
  const collectionFlywooCR = collection(
    productsDoc,
    "flywoo/control-remoto/LiteRadio-V3-ELRS"
  );
  const collectionFlywooCR2 = collection(
    productsDoc,
    "flywoo/control-remoto/LiteRadio-V3-TBS"
  );
  const collectionGeprcBaterias = collection(
    productsDoc,
    "geprc/baterias/4S-650a850mAh"
  );
  const collectionGeprcCR = collection(
    productsDoc,
    "geprc/control-remoto/tinyRadio-GR8"
  );
  const collectionIflightBaterias = collection(
    productsDoc,
    "iflight-rc/baterias/3S-450mAh"
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
  const collectionUruavBaterias = collection(
    productsDoc,
    "uruav/baterias/1S-250mAh"
  );

  const [storeProductsBaterias, setStoreProductsBaterias] = useState([]);
  const [storeProductsRC, setStoreProductsRC] = useState([]);

  const productosFromFirestore = async () => {
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
    let productosBaterias = [];
    for (let product of collectionBaterias) {
      // console.log(product, collectionBaterias)
      let productDataBaterias = await getDocs(product);
      productDataBaterias.forEach((DOC) => {
        productosBaterias.push(DOC.data());
      });
    }
    if (productosBaterias.length > 0) {
      setStoreProductsBaterias(productosBaterias);
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
      <h3>Dispositivos de Contol Remoto.</h3>
      <br />
      <br />
      {storeProductsRC.length == 0 ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <div>
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
      <h3>Baterias para drone.</h3>
      <br />
      <br />
      {storeProductsBaterias.length == 0 ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <div>
          <Grid container spacing={2}>
            {storeProductsBaterias.map((product, k) => {
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
    </>
  );
};

export default RadioContol;
