import React, { useState, useEffect } from "react";
import { getObservableAccesorios } from "../../../services/sharedServices";
import "sessionstorage-polyfill";
import "localstorage-polyfill";
global.sessionstorage;
global.localStorage;

import ProductCard from "../components/ProductCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "../../components/Typography";
import withRoot from "../../withRoot";
import theme from "../../theme";
import { styled } from "@mui/material/styles";

const styles = (theme) => ({
  presentationProducts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`,
    padding: `${theme.spacing(0)} ${theme.spacing(2)} !important`,
    display: "flex",
    flexDirection: "column",
  },
  spacingTexts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`,
  },
  endingTexts: {
    marginBottom: `${theme.spacing(2)} !important`,
  },
});

const Accesorios = (props) => {
  // const { classes } = props;
  const classes = styles(theme);

  const subscription = getObservableAccesorios();
  const [storeProductsBaterias, setStoreProductsBaterias] = useState([]);

  if (!storeProductsBaterias.length > 0) {
    subscription.subscribe((response) => {
      // console.log("productObservable", response);
      const { productsBaterias } = response;
      setStoreProductsBaterias(productsBaterias);
    });
  }

  return (
    <>
      <Box sx={classes.presentationProducts}>
        <Typography variant="h5" sx={classes.spacingTexts}>
          Baterias para drone.
        </Typography>
        {storeProductsBaterias.length == 0 ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body1" sx={classes.endingTexts}>
              Baterias para cada necesidad en potencia y tiempo de vuelo.
            </Typography>
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
          </>
        )}
      </Box>
    </>
  );
};

export default withRoot(Accesorios);
