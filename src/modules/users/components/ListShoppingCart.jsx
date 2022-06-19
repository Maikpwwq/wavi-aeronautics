import React, { useState, useEffect } from "react";
import { withStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../../../firebase/firebaseClient";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

import PropTypes from "prop-types";

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

const styles = (theme) => ({});

const ListShoppingCart = (props) => {
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID");
  const AllProducts = sessionStorage.getItem("Todos los productos") || null;
  const shoppingCartItems =
    sessionStorage.getItem("cartProducts") !== 0
      ? sessionStorage.getItem("cartProducts")
      : null;
  const shoppingCartSuma =
    sessionStorage.getItem("cartSum") !== 0
      ? sessionStorage.getItem("cartSum")
      : null;
  const usedID = userID ? userID : shoppingCartID;
  const _firestore = firestore;
  const navigate = useNavigate();
  const { products, visible, updated, classes, setShowingCart } = props;
  const storeKitRef = collection(_firestore, "productos/dron/kit_fpv_dron");
  const storeRCRef = collection(_firestore, "productos/dron/RC");

  // const shoppingsRef = collection(_firestore, "productos");
  const [shoppingCart, setShoppingCart] = useState({
    productos: [],
    suma: 0,
    items: 0,
  });
  console.log(visible)
  // const handleClick = (e) => {
  //   e.preventDefault();
  //   navigate("/tienda-base/producto/", { state: { product: products } });
  // };

  const productsFromFirestore = async () => {
    // console.log(shoppingsRef, userID);
    const collectionsWavi = new Array(storeRCRef, storeKitRef);
    let productData = [];
    for (let product of collectionsWavi) {
      let colectionData = await getDocs(product);
      colectionData.forEach((DOC) => {
        productData.push(DOC.data());
      });
    }
    localStorage.setItem("cartUpdated", "productos");
    return productData;
  };

  const shoppingsFromFirestore = () => {
    let productData;
    if (!AllProducts) {
      // console.log(AllProducts);
      productData = productsFromFirestore();
      // console.log(productData);
      productData.then((response) => {
        compareProductsIDs(response);
        // console.log(response);
        localStorage.setItem("cartUpdated", "firestore");
        sessionStorage.setItem("Todos los productos", JSON.stringify(response));
      });
    } else {
      productData = JSON.parse(AllProducts);
      compareProductsIDs(productData);
      localStorage.setItem("cartUpdated", "sessionStorage");
      if (shoppingCartSuma > 0) {
        sessionStorage.setItem("cartSum", shoppingCartSuma);
      }
      if (shoppingCartItems > 0) {
        sessionStorage.setItem("cartProducts", shoppingCartItems);
      }
    }
  };

  const compareProductsIDs = (productData) => {
    let cardProductos = [];
    // comparar productos por ids
    if (productData && productData.length > 0) {
      // console.log(productData);
      let counter = 0;
      productData.map((DOC) => {
        // console.log(DOC);
        let iD = DOC.productID;
        for (let codigo of products) {
          // console.log(iD, codigo);
          if (iD === codigo) {
            cardProductos.push(DOC);
            counter++;
          }
        }
      });
      if (cardProductos !== [] && cardProductos.length > 0) {
        // console.log(cardProductos);
        setShoppingCart({
          ...shoppingCart,
          productos: cardProductos,
          items: cardProductos.length,
        });
        // console.log(shoppingCart);
        localStorage.setItem("cartUpdated", "filterItems");
        sessionStorage.setItem("cartProducts", cardProductos.length);
        calculateCartAmount();
      }
    }
  };

  const calculateCartAmount = () => {
    let acomulateSum = 0;
    // console.log(acomulateSum);
    shoppingCart.productos.map((product, k) => {
      // console.log(acomulateSum, product.precio);
      if (
        typeof parseInt(product.precio) === "number" &&
        product.precio !== "Agotado"
      ) {
        acomulateSum += parseInt(product.precio);
      }
    });
    if (acomulateSum > 0) {
      // console.log(acomulateSum);
      setShoppingCart({ ...shoppingCart, suma: acomulateSum });
      localStorage.setItem("cartUpdated", "suma");
      sessionStorage.setItem("cartSum", acomulateSum);
      // localStorage.removeItem("cartUpdated");
    }
  };

  useEffect(() => {
    if (usedID) {
      // console.log(usedID, visible);
      shoppingsFromFirestore();
    }
  }, [updated]);

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

  const handleCheckout = () => {
    const productsCart = shoppingCart.productos;
    console.log(productsCart);
    localStorage.setItem("cartUpdated", "detalles-envio");
    setShowingCart(false)
    navigate("/tienda-base/detalles-envio/", {
      state: { productsCart: productsCart },
    });
  };

  const handleShoppingCart = () => {
    localStorage.setItem("cartUpdated", "ver-carrito");
    setShowingCart(false)
    navigate("/tienda-base/ver-carrito/", {
      state: {
        makeVisible: visible,
        makeUpdated: updated,
      },
    });
  };

  return (
    <>
        <Box className="" maxWidth="sm" style={{ height: "100%" }}>
          {shoppingCart.productos.map(
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
          <Button
            variant="contained"
            color="secondary"
            onClick={handleShoppingCart}
          >
            Ver carrito
          </Button>
        </Box>
    </>
  );
};

ListShoppingCart.propTypes = {
  classes: PropTypes.object.isRequired,
  setShowingCart: PropTypes.func.isRequired,
  products: PropTypes.object,
  visible: PropTypes.bool, 
  updated: PropTypes.string,
};

export default withStyles(styles)(ListShoppingCart);
