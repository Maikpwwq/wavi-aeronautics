"use client";
import React, { useContext } from "react";
import { ShowCartContext } from "@/app/tienda/providers/ShoppingCartProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
// import CardActionArea from "@mui/material/CardActionArea";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import withRoot from "@/modules/withRoot";
import theme from "../innerTheme";

const styles = (theme) => ({
  cartList: {
    minWidth: "480px",
    // [theme.breakpoints.down("sm")]: {
    //   padding: theme.spacing(8, 6),
    //   minWidth: "380px !important",
    //   right: "13px !important",
    // },
  },
  image: {
    height: "130px",
    width: "auto !important",
  },
  card: {
    height: "100%",
    display: "flex",
    justifyContent: "space-evenly",
  },
});

function ShowCartPage() {
  const navigate = useRouter();
  const { shoppingCart, updateShowCart, updateShoppingCart } =
    useContext(ShowCartContext);
  console.log("ShowCartContext ShoppingCart", shoppingCart);
  let cart = shoppingCart.productos;
  const classes = styles(theme);

  const handleCheckout = (e) => {
    e.preventDefault();
    const productsCart = shoppingCart.productos;
    console.log("productsCart", productsCart);
    sessionStorage.setItem("cartUpdated", "detalles-envio");
    updateShowCart(false);
    navigate.push("tienda/detalles-envio", {
      // state: { productsCart: productsCart },
    });
  };

  return (
    <>
      {cart == [] ? (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex" }}>
          <Grid container spacing={2}>
            <Grid
              item
              sm={12}
              xs={12}
              md={6}
              lg={8}
              xl={10}
              sx={classes.cartList}
            >
              <Box className="">
                {shoppingCart.productos &&
                  cart.map(({ titulo, precio, imagenes, productID, categoria }, index) => (
                    <Card style={classes.card} key={index}>
                      <Link
                        href={{
                          pathname: `tienda/producto`, 
                          query: `id=${productID}&category=${categoria}`,
                        }}
                      >
                        <CardMedia
                          sx={classes.image}
                          component="img"
                          image={imagenes[0]}
                          alt={titulo}
                        />
                      </Link>
                      <CardHeader
                        title={titulo}
                        subheader={precio}
                        action={
                          <IconButton
                            color="inherit"
                            onClick={() => handleCancel}
                          >
                            <CancelIcon fontSize="large" />
                          </IconButton>
                        }
                      ></CardHeader>
                    </Card>
                  ))}
                {shoppingCart.productos && (
                  <Box className="" maxWidth="sm">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => handleCheckout(e)}
                    >
                      Finalizar compra
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}

export default withRoot(ShowCartPage);
