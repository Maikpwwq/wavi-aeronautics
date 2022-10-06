import React, { useState, useEffect } from "react";
import withRoot from "../../withRoot";
import theme from "../innerTheme";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../../../firebase/firebaseClient";
import { collection, doc, setDoc } from "firebase/firestore";
import { sharingInformationService } from "../../../services/sharing-information";

import PropTypes from "prop-types";

import "sessionstorage-polyfill";
import "localstorage-polyfill";
global.sessionstorage;
global.localStorage;

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
// import CardContent from "@mui/material/CardContent";
// import CardActions from "@mui/material/CardActions";
// import { CardActionArea } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
// import { styled } from "@mui/material/styles";

const styles = (theme) => ({});

const ListShoppingCart = (props) => {
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID");
  const usedID = userID ? userID : shoppingCartID;
  const navigate = useNavigate();
  const { visible, updated, setShowingCart } = props; // products,
  const classes = styles(theme);
  const _firestore = firestore;
  const shoppingsRef = collection(_firestore, "shoppingCart");

  var shoppingCart = [];
  // const [shoppingCart, setShoppingCart] = useState({
  //   productos: [],
  //   suma: 0,
  //   items: 0,
  // });

  console.log("visibility", visible);
  // const handleClick = (e) => {
  //   e.preventDefault();
  //   navigate("/tienda/producto/", { state: { product: products } });
  // };

  if (shoppingCart.length === 0) {
    const productData = sharingInformationService.getSubject();
    productData.subscribe((data) => {
      if (!!data) {
        shoppingCart = data;
        // console.log("Detail shoppingCard", data, shoppingCart);
      }
    });
  }

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    await setDoc(doc(shoppingsRef, userRef), updateInfo, { merge: true });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (usedID) {
      let cardProductos = [];
      console.log("shoppingCart", shoppingCart);
      shoppingCart.productos.map((product, n) => {
        cardProductos.push(product);
      });
      console.log(cardProductos);
      // var index = cardProductos.length;
      // console.log(index, shoppingCart.productos.length);
      // cardProductos[index] = shoppingCart.productos
      //let cardProductos = shoppingCart.productos + productID;
      cardProductos.push(productID);
      // cardProductos[index] = productID
      setShoppingCart({ ...shoppingCart, productos: cardProductos });
      // console.log(userID, productID);
      console.log(shoppingCart);
      console.log(cardProductos);
      shoppingsToFirestore({ productos: cardProductos }, userID);
      shoppingsFromFirestore();
    } else {
      navigate("/sign-in/");
    }
  };

  const handleCheckout = () => {
    const productsCart = shoppingCart.productos;
    console.log(productsCart);
    localStorage.setItem("cartUpdated", "detalles-envio");
    setShowingCart(false);
    navigate("/tienda/detalles-envio/", {
      state: { productsCart: productsCart },
    });
  };

  const handleShoppingCart = () => {
    localStorage.setItem("cartUpdated", "ver-carrito");
    setShowingCart(false);
    navigate("/tienda/ver-carrito/", {
      state: {
        makeVisible: visible,
        makeUpdated: updated,
      },
    });
  };

  return (
    <>
      <Box className="" maxWidth="sm" style={{ height: "100%" }}>
        {shoppingCart.productos &&
          shoppingCart.productos.map(
            ({ titulo, precio, imagenes, productID }) => (
              <Card style={{ height: "100%", display: "flex" }} key={productID}>
                {/* <CardActionArea onClick={handleClick}></CardActionArea> */}
                <CardMedia
                  component="img"
                  height="120"
                  image={imagenes[0]}
                  alt={titulo}
                ></CardMedia>

                <CardHeader
                  title={titulo}
                  subheader={precio}
                  action={
                    <IconButton color="inherit" onClick={handleCancel}>
                      <CancelIcon fontSize="large" />
                    </IconButton>
                  }
                ></CardHeader>
              </Card>
            )
          )}
        <Button variant="contained" color="primary" onClick={handleCheckout}>
          Finalizar compra
        </Button>
        {/* <Button
            variant="contained"
            color="secondary"
            onClick={handleShoppingCart}
          >
            Ver carrito
          </Button> */}
      </Box>
    </>
  );
};

ListShoppingCart.propTypes = {
  // classes: PropTypes.object.isRequired,
  setShowingCart: PropTypes.func.isRequired,
  // products: PropTypes.array,
  visible: PropTypes.bool,
  updated: PropTypes.string,
};

export default withRoot(ListShoppingCart);
