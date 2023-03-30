import React, { useState, useContext } from "react";
// import { useLocation } from "react-router-dom";
import { ShowCartContext } from "@/app/tienda/providers/ShoppingCartProvider";
import ListShoppingCart from "./ListShoppingCart";
// import { sharingInformationService } from "@/services/sharing-information";
import FirebaseCompareShoppingCartIds from "@/services/FirebaseCompareShoppingCartIds";

import PropTypes from "prop-types";
import { useSelector } from "react-redux";

// import "sessionstorage-polyfill";
// import "localstorage-polyfill";
// global.sessionstorage;
// global.localStorage;

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import withRoot from "@/modules/withRoot";
import theme from "../innerTheme";
import { styled } from "@mui/material/styles";

const styles = (theme) => ({
  cartList: {
    position: "absolute",
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
  const { shoppingCart, updateShoppingCart } = useContext(ShowCartContext);
  console.log("ShowCartContext ShoppingCart", shoppingCart);
  // const { showingCart, setShowingCart, shoppingUpdatedItems } = useContext(ShowCartContext);

  // const shoppingCart = useSelector((store) => store.shoppingCart);
  let cart = shoppingCart.productos; // ["EfOjZScDg7ZIkLQvGG6u", "EfOjZScDg7ZIkLQvGG6u"] // []
  // let cartInfo = [];

  // if (shoppingCart.productos && shoppingCart.productos.length > 0) {
  //   // const productData = sharingInformationService.getSubject();
  //   // productData.subscribe((data) => {
  //   //   if (!!data) {
  //       // updateShoppingCart(data);
  //       console.log("Detail shoppingIds", cart);
  //       FirebaseCompareShoppingCartIds(cart);
  //   //   }
  //   // });
  // }

  // const { visible, updated, setShowingCart } = props || {};
  const classes = styles(theme);

  // console.log("props", visible, updated);
  // const { state } = useLocation() || {};
  // const { makeVisible, makeUpdated } = state || "";
  // console.log("state", makeVisible, makeUpdated);
  // const visibleSettings = makeVisible || visible;
  // const updatedSettings = makeUpdated || updated;
  // console.log("settings", visibleSettings, updatedSettings);

  return (
    <>
      {cart == [] ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid
          container
          spacing={2}
          style={{
            position: "absolute",
            visibility: shoppingCart.show ? "visible" : "hidden",
          }}
        >
          {/* {cart.productos &&
            cartInfo.productos.map((product, k) => { 
              // console.log("product", product);
              return ( */}
          <Grid
            item
            // key={k}
            sm={12}
            xs={12}
            md={5}
            lg={4}
            xl={3}
            sx={classes.cartList}
          >
            <ListShoppingCart
              className="d-flex mb-2"
              // products={product}
              // visible={visibleSettings}
              // updated={updatedSettings}
              // productID={k}
              // setShowingCart={setShowingCart}
            ></ListShoppingCart>
          </Grid>
          {/* );
            })} */}
        </Grid>
      )}
    </>
  );
};

ShoppingCart.propTypes = {
  // classes: PropTypes.object.isRequired,
  // setShowingCart: PropTypes.func.isRequired,
  // visible: PropTypes.bool,
  // updated: PropTypes.string,
};

export default withRoot(ShoppingCart);
