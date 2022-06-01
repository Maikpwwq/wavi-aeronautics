import React, { useState, useEffect } from "react";
import { withStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../../../firebase/firebaseClient";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { CardActionArea } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import MercadoPago from "./MercadoPago";

const styles = {
  // footer: {
  //   padding: innerTheme.spacing(2),
  //   background: "#eaeff1",
  // },
};

const ListShoppingCart = (props) => {
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID");
  const usedID = userID ? userID : shoppingCartID;
  const _firestore = firestore;
  const navigate = useNavigate();
  const { products, visible, updated } = props;
  const storeKitRef = collection(_firestore, "productos/dron/kit_fpv_dron");
  const storeRCRef = collection(_firestore, "productos/dron/RC");

  // const shoppingsRef = collection(_firestore, "productos");
  const [shoppingCart, setShoppingCart] = useState({
    productos: [],
    suma: 0,
    items: 0,
  });

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/producto/", { state: { product: products } });
  };

  const shoppingsFromFirestore = async () => {
    // console.log(shoppingsRef, userID);
    const collectionsWavi = new Array(storeRCRef, storeKitRef);
    let productData = [];
    for (let product of collectionsWavi) {
      let colectionData = await getDocs(product);
      colectionData.forEach((DOC) => {
        productData.push(DOC.data());
      });
    }
    let cardProductos = [];
    // comparar productos por ids
    productData.forEach((DOC) => {
      // console.log(DOC);
      let iD = DOC.productID;
      for (let codigo of products) {
        // console.log(iD, codigo);
        if (iD === codigo) {
          cardProductos.push(DOC);
        }
      }
    });
    // localStorage.setItem("cartUpdated", "firestore");
    console.log(cardProductos);
    // cardProductos != {} &&
    if (cardProductos.length > 0) {
      setShoppingCart({
        ...shoppingCart,
        productos: cardProductos,
        items: cardProductos.length,
      });
      console.log(shoppingCart);
      localStorage.setItem("cartUpdated", "items");
      localStorage.setItem("cartProducts", cardProductos.length);
    }
  };

  const calculateCartAmount = () => {
    let acomulateSum = 0;
    console.log(acomulateSum);
    shoppingCart.productos.map((product, k) => {
      console.log(acomulateSum, product.precio);
      if (product.precio !== "Agotado") {
        acomulateSum += parseInt(product.precio);
      }
    });
    setShoppingCart({ ...shoppingCart, suma: acomulateSum });
    localStorage.setItem("cartSum", acomulateSum);
    localStorage.setItem("cartUpdated", "suma");
    // localStorage.removeItem("cartUpdated");
  };

  useEffect(() => {
    if (usedID) {
      console.log(usedID, visible);
      shoppingsFromFirestore();
      calculateCartAmount();
      localStorage.setItem("cartUpdated", "productos");
    }
  }, [updated, visible]);

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    await setDoc(doc(shoppingsRef, userRef), updateInfo, { merge: true });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (usedID) {
      let cardProductos = [];
      console.log(shoppingCart);
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

  return (
    <>
      <Box className="" maxWidth="sm" style={{ height: "100%" }}>
        {shoppingCart.productos.map(
          ({ titulo, precio, imagenes, productID }) => (
            <Card style={{ height: "100%", display: "flex" }} key={productID}>
              <CardActionArea onClick={handleClick}>
                <CardMedia
                  component="img"
                  height="120"
                  image={imagenes[0]}
                  alt={titulo}
                ></CardMedia>
              </CardActionArea>
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
        <MercadoPago visible={visible} products={shoppingCart.productos}/>
      </Box>
    </>
  );
};

export default withStyles(styles)(ListShoppingCart);
