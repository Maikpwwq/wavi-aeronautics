import React, { useState, useEffect } from "react";
import { firestore, auth } from "../../../firebase/firebaseClient";
import { collection, doc, getDoc } from "firebase/firestore";
import ListShoppingCart from "../components/ListShoppingCart";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { withStyles } from "@mui/styles";

const styles = {
  cartList: {
    top: "100px !important",
  },
};

const ShoppingCart = (props) => {
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID");
  const usedID = userID ? userID : shoppingCartID;
  const { visible, updated } = props;
  const _firestore = firestore;
  const shoppingsRef = collection(_firestore, "shoppingCart");
  const [storeProducts, setStoreProducts] = useState({
    productos: [],
  });

  const productosFromFirestore = async () => {
    const productsDoc = doc(shoppingsRef, usedID);
    const shoppingsData = await getDoc(productsDoc);
    let productos = [];
    // console.log(productData.data().productos);
    productos.push(shoppingsData.data().productos);
    if (productos.length > 0) {
      setStoreProducts({ ...storeProducts, productos: productos });
    }
    localStorage.setItem("cartUpdated", "firestore");
    // console.log(productos);
    // console.log(shoppingsData.data().productos);
  };

  useEffect(() => {
    // console.log(usedID);
    if (usedID) {
      productosFromFirestore();
    }
  }, [updated, visible]);

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
            visibility: visible ? "visible" : "hidden",
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
                className="cartList"
                style={{
                  position: "absolute",
                  minWidth: "500px",
                  top: "80px",
                  right: "80px",
                }}
              >
                <ListShoppingCart
                  className="d-flex mb-2"
                  products={product}
                  visible={visible}
                  updated={updated}
                  productID={k}
                ></ListShoppingCart>
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
};

export default withStyles(styles)(ShoppingCart);
