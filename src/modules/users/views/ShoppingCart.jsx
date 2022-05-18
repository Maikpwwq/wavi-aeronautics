import React, { useState, useEffect } from "react";
import { firestore, auth } from "../../../firebase/firebaseClient";
import { collection, doc, getDoc } from "firebase/firestore";
import ListShoppingCart from "../components/ListShoppingCart";
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
  const { visible } = props;
  console.log(visible)
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
      // console.log(storeProducts, productos);
    }
  };

  useEffect(() => {
    productosFromFirestore();
  }, []);

  return (
    <>
      {storeProducts.length == 0 ? (
        <div>
          <p>Cargando Carrito Compras!</p>
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            left: "-500px",
            visibility: visible ? "visible" : "hidden",
          }}
        >
          {/* <Grid container spacing={2}> */}
          {storeProducts.productos.map((product, k) => {
            // console.log(product, k);
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
                  productID={k}
                ></ListShoppingCart>
              </Grid>
            );
          })}
          {/* </Grid> */}
        </div>
      )}
    </>
  );
};

export default withStyles(styles)(ShoppingCart);
