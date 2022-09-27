import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { firestore, auth } from "../../../firebase/firebaseClient";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { getShoppingCart } from "../../../services/sharedServices";

import "sessionstorage-polyfill";
import "localstorage-polyfill";
global.sessionstorage;
global.localStorage;

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { CardActionArea } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

// import { useQuery } from "react-query";

const ProductCard = (props) => {
  // const navigate = useNavigate();
  const { products } = props;
  const { titulo, precio, imagenes, productID } = products;
  console.log(products);
  const [shoppingCart, setShoppingCart] = useState({
    productos: [],
  });

  const subscription = getShoppingCart();
  if (!shoppingCart.productos > 0) {
    subscription.subscribe((response) => {
      // console.log("productObservable", response);
      const { shoppingCart } = response;
      setShoppingCart({ ...shoppingCart, productos: shoppingCart });
      loadData(shoppingCart);
      localStorage.setItem("cartUpdated", "firestore");
    });
  }

  // const { isLoading, error, data, refetch } = useQuery(
  //   "SignInData",
  //   () => handleSubmit(data),
  //   { enabled: false }
  // );

  // if (isLoading) return "Loading...";

  // if (error) return "An error has occurred: " + error.message;

  // const handleClick = (e) => {
  //   e.preventDefault();
  //   navigate("producto/", { state: { product: products } });
  // };

  // const readData = () => {
  //   shoppingsFromFirestore().then((snapshot) => {
  //     // console.log(snapshot);
  //     const cardProductos = snapshot;
  //     // console.log(cardProductos, shoppingCart);
  //     loadData(cardProductos.productos);
  //     // setShoppingCart({
  //     //   ...shoppingCart,
  //     //   productos: cardProductos.productos,
  //     // });
  //     // console.log(cardProductos, shoppingCart);
  //   });
  // };

  // const loadData = (cardProductos) => {
  //   setShoppingCart({ ...shoppingCart, productos: cardProductos });
  // }

  // useEffect(() => {
  //   // console.log(usedID);
  //   if (usedID) {
  //     readData();

  //   }
  // }, [usedID, shoppingUpdatedItems]);

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    await setDoc(doc(shoppingsRef, userRef), updateInfo); // , { merge: true }
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (usedID) {
      let cardProductos = [];
      readData();
      // console.log(shoppingCart);
      shoppingCart.productos.map((product, n) => {
        cardProductos.push(product);
      });
      // console.log(cardProductos);
      // var index = cardProductos.length;
      // console.log(index, shoppingCart.productos.length);
      // cardProductos[index] = shoppingCart.productos
      //let cardProductos = shoppingCart.productos + productID;
      cardProductos.push(productID);
      // console.log(cardProductos);
      // cardProductos[index] = productID
      loadData(cardProductos);
      // console.log(userID, productID);
      // console.log(shoppingCart);
      // console.log(cardProductos);
      shoppingsToFirestore({ productos: cardProductos }, usedID);
      localStorage.setItem("cartUpdated", "agregar");
      readData();
    }
  };

  return (
    <>
      <Box className="" maxWidth="sm" style={{ height: "100%" }}>
        <Card style={{ height: "100%" }}>
          {/* onClick={handleClick} */}
          <CardActionArea>
            {/* <NavLink to="producto/" product={products}> */}
            {products && products !== null && products !== undefined && (
              <NavLink
                to={{
                  pathname: "producto/",
                  state: { product: products },
                }}
              >
                <CardMedia
                  component="img"
                  height="330"
                  image={imagenes[0]}
                  alt={titulo}
                ></CardMedia>
              </NavLink>
            )}
          </CardActionArea>
          <CardHeader
            title={titulo}
            subheader={precio}
            action={
              <IconButton color="inherit" onClick={handleAddCard}>
                <AddShoppingCartIcon fontSize="large" />
              </IconButton>
            }
          ></CardHeader>
        </Card>
      </Box>
    </>
  );
};

export default ProductCard;
