import React, { useState } from "react";
// import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
// import { loadDetail } from "../../../store/states/product";
// import { getAllShoppingCart } from "../../../services/sharedServices";
import FirebaseAddToCart from "../../../services/FirebaseAddToCart";

import "sessionstorage-polyfill";
import "localstorage-polyfill";
global.sessionstorage;
global.localStorage;

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import PropTypes from "prop-types";

// import { useQuery } from "react-query";

const ProductCard = ({ products, category }) => {
  // const dispatcher = useDispatch();
  const categoria = category || "tienda";
  const producto = products;
  const { titulo, precio, imagenes, productID } = producto;

  // const storedCart = useSelector((store) => store.shoppingCart);
  // let cart = storedCart || [];
  // console.log("cart products", cart);

  // const [shoppingCart, setShoppingCart] = useState({
  //   productos: [cart],
  // });

  let shoppingCart;

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

  const handleAddCard = (e) => {
    e.preventDefault();
    // if (usedID) {
    let cardProductos = [];
    // readData();
    // console.log(shoppingCart);
    shoppingCart.productos.map((product, n) => {
      cardProductos.push(product);
    });
    console.log("cardProductos", cardProductos);
    // cardProductos.push(productID);
    FirebaseAddToCart({ productos: cardProductos });
    // loadData(cardProductos);
    // console.log(userID, productID);
    // console.log(shoppingCart);
    // shoppingsToFirestore({ productos: cardProductos }, usedID);
    // localStorage.setItem("cartUpdated", "agregar");
    // readData();
    // }
  };

  return (
    <>
      <Box className="" maxWidth="sm" style={{ height: "100%" }}>
        <Card style={{ height: "100%" }}>
          <CardActionArea>
            {producto !== undefined && imagenes && (
              <NavLink
                to={{
                  pathname: `producto?id=${productID}&category=${categoria}`, // titulo
                  // state: { product: products },
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

ProductCard.propTypes = {
  products: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
};

export default ProductCard;
