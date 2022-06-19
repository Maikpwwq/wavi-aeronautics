import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { firestore, auth } from "../../../firebase/firebaseClient";
import { collection, doc, getDoc } from "firebase/firestore";
import ListShoppingCart from "../components/ListShoppingCart";

import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { withStyles } from "@mui/styles";

const styles = (theme) => ({
  cartList: {
    top: "85px !important",
    minWidth: "480px",
    right: "133px",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(8, 6),
      minWidth: "380px !important",
      right: "13px !important",
    },
  },
});

const ShoppingCart = (props) => {
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const { visible, updated, classes, setShowingCart } = props || {};
  // console.log("props", visible, updated);
  const { state } = useLocation() || {};
  const { makeVisible, makeUpdated } = state || "";
  // console.log("state", makeVisible, makeUpdated);
  const visibleSettings = makeVisible || visible;
  const updatedSettings = makeUpdated || updated;
  console.log("settings", visibleSettings, updatedSettings);
  const shoppingCartID = localStorage.getItem("cartID");
  const usedID = userID ? userID : shoppingCartID;
  const _firestore = firestore;
  const shoppingsRef = collection(_firestore, "shoppingCart");
  const [storeProducts, setStoreProducts] = useState({
    productos: [],
  });

  // const [settings, setSettings] = useState({
  //   visibleSettings: visible || makeVisible || "",
  //   updatedSettings: updated || makeUpdated || "",
  // });

  const productosFromFirestore = async () => {
    const productsDoc = doc(shoppingsRef, usedID);
    const shoppingsData = await getDoc(productsDoc);
    let productos = [];
    if (shoppingsData.data()) {
      // console.log(productData.data().productos);
      productos.push(shoppingsData.data().productos);
      if (productos.length > 0) {
        setStoreProducts({ ...storeProducts, productos: productos });
      }
      localStorage.setItem("cartUpdated", "firestore");
    }
    // console.log(productos);
    // console.log(shoppingsData.data().productos);
  };

  useEffect(() => {
    // console.log(usedID);
    if (usedID) {
      productosFromFirestore();
      console.log("loadFirebase")
    }
  }, [visible || updated]);

  return (
    <>
      {storeProducts.productos == [] ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid
          container
          spacing={2}
          style={{
            position: "absolute",
            visibility: visibleSettings ? "visible" : "hidden",
          }}
        >
          {storeProducts.productos.map((product, k) => {
            // console.log(product);
            return (
              <Grid
                item
                key={k}
                sm={12}
                xs={12}
                md={5}
                lg={4}
                xl={3}
                className={classes.cartList}
                style={{ position: "absolute" }}
              >
                <ListShoppingCart
                  className="d-flex mb-2"
                  products={product}
                  visible={visibleSettings}
                  updated={updatedSettings}
                  productID={k}
                  setShowingCart={setShowingCart}
                ></ListShoppingCart>
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
};

ShoppingCart.propTypes = {
  classes: PropTypes.object.isRequired,
  setShowingCart: PropTypes.func.isRequired,
  visible: PropTypes.bool, 
  updated: PropTypes.string,
};

export default withStyles(styles)(ShoppingCart);
