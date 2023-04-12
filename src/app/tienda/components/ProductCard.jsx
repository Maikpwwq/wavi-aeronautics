import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
// import { getAllShoppingCart } from "@/services/sharedServices";
import FirebaseAddToCart from "@/services/FirebaseAddToCart"; 
import { loadDetail } from "@/store/states/product";
import { ShowCartContext } from "@/app/tienda/providers/ShoppingCartProvider";

// import "sessionstorage-polyfill";
// import "localstorage-polyfill";
// global.sessionstorage;
// global.localStorage;

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
  const dispatch = useDispatch();
  const categoria = category || "tienda";
  const producto = products;
  const { titulo, precio, imagenes, productID } = producto;

  const { shoppingCart, updateShoppingCart } = useContext(ShowCartContext);

  // const storedCart = useSelector((store) => store.shoppingCart);
  // let cart = storedCart || [];
  // console.log("cart products", cart);

  // const [thisShoppingCart, setShoppingCart] = useState({
  //   productos: shoppingCart,
  // });

  const handleSelect = () => {
    console.log("producto", producto);
    try {
      dispatch(loadDetail({ producto }));
    } catch (e) {
      return console.error(e.message);
    }
  };

  // Solo activar 
  // useEffect(() => { }, []);

  const storeToFirebaseCart = () => {
    // const cardProductos = {};
    const cardProductos = [];
    let cart = []
    cart = shoppingCart.productos;
    console.log('shoppingCart', shoppingCart);
    cart.map((product, n) => {
        const {productID} = product
        // cardProductos[n] = productID;
        cardProductos.push(productID);
      });
      console.log("cardProductos", cardProductos);
      FirebaseAddToCart({ productos: cardProductos });
  }

  const handleAddCard = (e, producto) => {
    e.preventDefault();
    readData(producto);
    storeToFirebaseCart();
  };

  const readData = (producto) => {
    //   shoppingsFromFirestore().then((snapshot) => {
    let cardProductos = [];
    if (!!shoppingCart.productos){
      shoppingCart.productos.map((product, n) => {
        cardProductos.push(product);
      });
      cardProductos.push(producto);
      console.log('cardProductos', cardProductos);
    }
    console.log('readData', cardProductos);
    // setShoppingCart productos:
    updateShoppingCart(cardProductos);
    // setShoppingCart({ productos: cardProductos });
    console.log('shoppingCart', shoppingCart);
  };

  return (
    <>
      <Box className="" maxWidth="sm" style={{ height: "100%" }}>
        <Card style={{ height: "100%" }}>
          <CardActionArea>
            {producto !== undefined && imagenes && (
              <Link
                href={{
                  pathname: `tienda/producto`, // titulo
                  // search: `?id=${productID}&category=${categoria}`,
                  query: `id=${productID}&category=${categoria}`,
                  state: { product: products },
                }}
              >
                <CardMedia
                  component="img"
                  height="330"
                  image={imagenes[0]}
                  alt={titulo}
                  onClick={() => handleSelect}
                />
              </Link>
            )}
          </CardActionArea>
          <CardHeader
            title={titulo}
            subheader={precio}
            action={
              <IconButton color="inherit" onClick={(e) => handleAddCard(e, producto)}>
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
