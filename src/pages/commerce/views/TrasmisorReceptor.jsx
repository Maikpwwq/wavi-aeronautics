import React, { useState } from "react";
import { useSelector, connect } from "react-redux";
import ProductCard from "../components/ProductCard";

import "sessionstorage-polyfill";
import "localstorage-polyfill";
global.sessionstorage;
global.localStorage;

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "../../../modules/components/Typography";
import withRoot from "../../../modules/withRoot";
import theme from "../innerTheme";
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

const TrasmisorReceptor = (props) => {
  // const { classes } = props;
  const shopState = useSelector((store) => store.shop);
  const { receptores } = shopState;

  const classes = styles(theme);
  const [storeProductsReceptor, setStoreProductsReceptor] = useState(
    receptores || []
  );

  return (
    <>
      <Box sx={classes.presentationProducts}>
        <Typography variant="h5" sx={classes.spacingTexts}>
          Receptor para drone.
        </Typography>
        {storeProductsReceptor == undefined ||
        storeProductsReceptor.length == 0 ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body1" sx={classes.endingTexts}>
              Receptor para cada necesidad en potencia y distacia de vuelo.
            </Typography>
            <Grid container spacing={2}>
              {storeProductsReceptor.map((product, k) => {
                // console.log(product, k);
                // productID
                return (
                  <Grid item key={k} sm={12} xs={12} md={5} lg={4} xl={3}>
                    <ProductCard
                      category="receptores"
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

const mapStateToProps = (state) => {
  return {
    storeProductsReceptor: state.receptores,
  };
};

export default connect(mapStateToProps, null)(withRoot(TrasmisorReceptor));
