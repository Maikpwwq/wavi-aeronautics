import React, { useState} from "react";
import {
  connect,
  ReactReduxContext,
  useStore,
  useSelector,
  useDispatch,
} from "react-redux";
import { useTheme } from "@mui/material/styles";
import withRoot from "../../withRoot";
import theme from "../innerTheme";
import { styled } from "@mui/material/styles";

import "sessionstorage-polyfill";
import "localstorage-polyfill";
global.sessionstorage;
global.localStorage;

import Box from "@mui/material/Box";
import ProductCard from "../components/ProductCard";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "../../components/Typography";

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

const Products = (props) => {
  const shopState = useSelector((store) => store.shop);
  const { drones, dronesRC } = shopState;

  const theme = useTheme();
  const classes = styles(theme);
  // const user = auth.currentUser || {};
  // const userID = user.uid || null;

  // const dispatch = useDispatch();
  // const state = useSelector((state))
  // const { store } = useContext(ReactReduxContext);

  const [storeProducts, setStoreProducts] = useState(drones || []);
  const [storeProductsRC, setStoreProductsRC] = useState(dronesRC || []);

  return (
    <>
      <Box sx={classes.presentationProducts}>
        <Typography variant="h5" sx={classes.spacingTexts}>
          Kits de Dron FPV:
        </Typography>
        <>
          {storeProducts == undefined || storeProducts.length == 0 ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="body1" sx={classes.endingTexts}>
                Descubre los mejores kits de Dron FPV listos para vuelo.
              </Typography>
              <Grid container spacing={2}>
                {storeProducts.map((product, k) => {
                  return (
                    <Grid item key={k} sm={12} xs={12} md={5} lg={4} xl={3}>
                      <ProductCard
                        sx="d-flex mb-2"
                        products={product}
                        productID={k}
                      ></ProductCard>
                    </Grid>
                  );
                })}
              </Grid>
              <br />
              <br />
              <Typography variant="h5" sx={classes.spacingTexts}>
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
              <Typography variant="body1" sx={classes.endingTexts}>
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

const mapStateToProps = (state) => {
  return {
    storeProducts: state.drones,
    storeProductsRC: state.dronesRC,
  };
};

export default connect(mapStateToProps, null)(withRoot(Products));
