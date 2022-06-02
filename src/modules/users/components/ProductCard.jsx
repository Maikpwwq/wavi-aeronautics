import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../../../firebase/firebaseClient";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
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

const ProductCard = (props) => {
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID");
  const shoppingUpdatedItems = localStorage.getItem("cartUpdated");
  const usedID = userID ? userID : shoppingCartID;
  const _firestore = firestore;
  const navigate = useNavigate();
  const { products } = props;
  const { titulo, precio, imagenes, productID } = products;
  const shoppingsRef = collection(_firestore, "shoppingCart");
  const [shoppingCart, setShoppingCart] = useState({
    productos: [],
  });

  const handleClick = (e) => {
    e.preventDefault();
    navigate("producto", { state: { product: products } });
  };

  const shoppingsFromFirestore = async () => {
    let cardProductos = {};
    // console.log(shoppingsRef, userID);
    const productData = await getDoc(doc(shoppingsRef, usedID));
    //console.log(productData.data());
    for (var index in productData.data()) {
      // console.log(productData.data()[index]); //.Status == "Valid"
      if (productData.data()[index]) {
        cardProductos[index] = productData.data()[index];
      }
    }
    if (cardProductos && cardProductos.productos != []) {
      // console.log(cardProductos, shoppingCart);
      // setShoppingCart({
      //   ...shoppingCart,
      //   productos: cardProductos.productos,
      // });
      return cardProductos;
    }
    // return { productos: [] };
  };

  const readData = () => {
    shoppingsFromFirestore().then((snapshot) => {
      // console.log(snapshot);
      const cardProductos = snapshot;
      // console.log(cardProductos, shoppingCart);
      loadData(cardProductos.productos);
      // setShoppingCart({
      //   ...shoppingCart,
      //   productos: cardProductos.productos,
      // });
      // console.log(cardProductos, shoppingCart);
    });
  };

  

  const loadData = (cardProductos) => {
    setShoppingCart({ ...shoppingCart, productos: cardProductos });
  }

  useEffect(() => {
    // console.log(usedID);
    if (usedID) {
      readData();
      localStorage.setItem("cartUpdated", "firestore");
    }
  }, [usedID, shoppingUpdatedItems]);

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
          <CardActionArea onClick={handleClick}>
            <CardMedia
              component="img"
              height="330"
              image={imagenes[0]}
              alt={titulo}
            ></CardMedia>
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
