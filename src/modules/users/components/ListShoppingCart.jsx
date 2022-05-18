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

const styles = {
  // footer: {
  //   padding: innerTheme.spacing(2),
  //   background: "#eaeff1",
  // },
}

const ListShoppingCart = (props) => {
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const _firestore = firestore;
  const navigate = useNavigate();
  const { products } = props;
  const shoppingsRef = collection(_firestore, "productos/dron/kit_fpv_dron");
  // const shoppingsRef = collection(_firestore, "productos");
  const [shoppingCart, setShoppingCart] = useState({
    productos: [],
  });

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/producto/", { state: { product: products } });
  };

  const shoppingsFromFirestore = async () => {
    // console.log(shoppingsRef, userID);
    const productData = await getDocs(shoppingsRef);
    let cardProductos = [];
    // comparar productos por ids
    productData.forEach((DOC) => {
      let iD = DOC.data().productID;
      for (let codigo of products) {
        console.log(iD, codigo);
        if (iD === codigo) {
          cardProductos.push(DOC.data());
        }
      }
    });
    console.log(cardProductos);
    // cardProductos != {} &&
    if (cardProductos.length > 0) {
      setShoppingCart({ ...shoppingCart, productos: cardProductos });
      console.log(shoppingCart);
    }
  };

  useEffect(() => {
    if (userID) {
      shoppingsFromFirestore();
      //console.log(shoppingCart);
    }
    //console.log(userID);
  }, []);

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    await setDoc(doc(shoppingsRef, userRef), updateInfo, { merge: true });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (userID) {
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
      {shoppingCart.productos.map(({ titulo, precio, imagenes }) => (
        <Box className="" maxWidth="sm" style={{ height: "100%" }}>
          <Card style={{ height: "100%", display: "flex" }}>
            <CardActionArea onClick={handleClick}>
              <CardMedia
                component="img"
                height="80"
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
        </Box>
      ))}
    </>
  );
};

export default withStyles(styles)(ListShoppingCart);
