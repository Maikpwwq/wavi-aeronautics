import React, { useState, useEffect } from "react";
import { firestore, auth } from "../../../firebase/firebaseClient";
import { collection, doc, getDoc } from "firebase/firestore";
import ListShoppingCart from "../components/ListShoppingCart";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { withStyles } from "@mui/styles";
import MercadoPago from "../components/MercadoPago";

const styles = {
  cartList: {
    top: "100px !important",
  },
};

const ShoppingCart = (props) => {
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const { visible } = props;
  console.log(visible);
  const _firestore = firestore;
  const productsRef = collection(_firestore, "shoppingCart");
  const [storeProducts, setStoreProducts] = useState({
    productos: [],
  });

  const productosFromFirestore = async () => {
    const productsDoc = doc(productsRef, userID);
    const productData = await getDoc(productsDoc);
    let productos = [];
    // console.log(productData.data().productos);
    productos.push(productData.data().productos);
    if (productos.length > 0) {
      setStoreProducts({ ...storeProducts, productos: productos });
    }
    console.log(productos);
  };

  useEffect(() => {
    if (userID) {
      productosFromFirestore();
    }
  }, []);

  return (
    <>
      {storeProducts.productos.length == 0 ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid
          container
          spacing={2}
          style={{
            position: "relative",
            left: "-500px",
            visibility: visible ? "visible" : "hidden",
          }}
        >
          {/* <Grid container spacing={2}> */}
          {storeProducts.productos.map((product, k) => {
            console.log(product);
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
                }}
              >
                <ListShoppingCart
                  className="d-flex mb-2"
                  products={product}
                  visible={visible}
                  productID={k}
                ></ListShoppingCart>
              </Grid>
            );
          })}
          <Grid item>
            <MercadoPago visible={visible} products={storeProducts.productos} />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default withStyles(styles)(ShoppingCart);
