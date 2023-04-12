"use client";
import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { ThemeProvider, styled } from "@mui/material/styles";
import { ShowCartContext } from "@/app/tienda/providers/ShoppingCartProvider";
import FirebaseCompareShoppingCartIds from "@/services/FirebaseCompareShoppingCartIds";
import withRoot from "@/modules/withRoot";
import theme from "@/modules/theme";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Navigator from "./components/Navigator";
// import Content from "./Content";
// import Products from "./views/Products";
import Header from "./components/Header";
import ShopMarcas from "./components/ShopMarcas";
import ShopConditions from "./components/ShopConditions";
import innerTheme from "./innerTheme";

import { getAllShoppingCart } from "@/services/sharedServices";
import { sharingInformationService } from "@/services/sharing-information";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/">
        Wavi Aeronautics
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 256;

const styles = (theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
  },
  drawer: {
    [innerTheme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  app: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    overflowX: "auto",
  },
  shopMore: {
    padding: innerTheme.spacing(2),
    background: "#eaeff1",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

const Footer = styled("footer")(({ theme }) => ({
  padding: theme.spacing(2),
  background: "#eaeff1",
}));

const Main = styled("main")(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2, 2),
  background: "#eaeff1",
  // zIndex: -1,
}));

function Paperbase({ children }) {
  // const { classes } = props;
  const classes = styles(theme);
  const { updateShoppingCart, updateCart } = useContext(ShowCartContext);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const subscription$ = getAllShoppingCart;
  const productData = sharingInformationService.getSubject();

  useEffect(() => {
    subscription$.subscribe((response) => {
      if (!!response) {
        console.log("subscription getAllShoppingCart", response);
        // const { cart } = response;
        // shoppingCart.productos = cart;
      }
    });
  }, [subscription$]);

  useEffect(() => {
    productData.subscribe((data) => { 
      if (!!data) {
        const { cart } = data;
        console.log("Detail productCard", cart);
        // se actualiza el array de ids productos
        FirebaseCompareShoppingCartIds({ products: cart, updateCart });
        // updateShoppingCart(cart);
        // shoppingCart.productos = data;
      }
      // else {
      //   shoppingCart.productos = [];
      // }
    });
  }, [productData]);
  
  return (
    <ThemeProvider theme={innerTheme}>
      <Box sx={classes.root}>
        <CssBaseline />
        {/* <nav className={classes.drawer}>
          <Box sx={{ display: { xs: 'none', md: 'block' } }} implementation="js">
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          </Hidden>
          <Box sx={{ display: { xs: 'block', md: 'none' } }} implementation="css">
            <Navigator PaperProps={{ style: { width: drawerWidth } }} />
          </Box>
        </nav> */}
        <Box sx={classes.app}>
          <Header onDrawerToggle={handleDrawerToggle} />.
          <Main>
            {/* <Products /> */}
            {children}
            {/* <Content /> */}
          </Main>
          <Box sx={classes.shopMore}>
            <ShopConditions />
          </Box>
          <ShopMarcas />
          <Footer>
            <Copyright />
          </Footer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

Paperbase.propTypes = {
  // classes: PropTypes.object.isRequired,
};

export default withRoot(Paperbase);
