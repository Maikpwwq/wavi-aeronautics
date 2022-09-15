import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import ShoppingCart from "./views/ShoppingCart";

import PropTypes from "prop-types";

import "sessionstorage-polyfill";
import "localstorage-polyfill";
global.sessionstorage;
global.localStorage;

import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import HelpIcon from "@mui/icons-material/Help";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import withRoot from "../withRoot";
import theme from "../theme";
import { styled } from "@mui/material/styles";

import AvatarUser from "../../../publicAssets/static/img/l3mik3l.png";
// import WaviPixelLogo from "../../../publicAssets/static/img/WaviPixelLogo.png";
const WaviPixelLogo =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FWaviPixelLogo.png?alt=media&token=7edcec69-8b24-4b95-b970-6b9acfddbdeb";

const lightColor = "rgba(255, 255, 255, 0.7)";

const styles = (theme) => ({
  secondaryBar: {
    zIndex: 1, // Ver listado carrito de compras
  },
  productTabs: {
    overflowX: "scroll !important",
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4,
  },
  linkLogo: {
    // fontSize: 24,
    flex: 1,
    textDecoration: "none",
    alignItems: "center",
    display: "flex",
    fontSize: "2rem",
    color: lightColor,
    "&:hover": {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
  image: {
    borderRadius: "50%",
    marginRight: "30px",
    height: 48,
    width: 48,
  },
});

function Header(props) {
  const { onDrawerToggle } = props;
  const classes = styles(theme);
  const navigate = useNavigate();
  const shoppingCartID = localStorage.getItem("cartID");
  const shoppingCartSuma =
    sessionStorage.getItem("cartSum") !== 0
      ? sessionStorage.getItem("cartSum")
      : null;
  const shoppingCartItems =
    sessionStorage.getItem("cartProducts") !== 0
      ? sessionStorage.getItem("cartProducts")
      : null;
  const shoppingUpdatedItems = localStorage.getItem("cartUpdated");
  const [showingCart, setShowingCart] = useState(false);
  const [value, setValue] = React.useState(0);
  const [shoppingCart, setShoppingCart] = useState({
    suma: shoppingCartSuma > 0 ? shoppingCartSuma : 0,
    items: shoppingCartItems > 0 ? shoppingCartItems : 0,
  });

  const handleShowCart = () => {
    setShowingCart(!showingCart);
    console.log(showingCart);
    localStorage.setItem("cartUpdated", "show");
  };

  // Asignar data almacenada en el localStorage
  useEffect(() => {
    if (shoppingCartItems > 0) {
      // localStorage.setItem("cartUpdated", "items");
      setShoppingCart({
        ...shoppingCart,
        items: shoppingCartItems,
      });
    }
  }, [shoppingCartItems]);

  useEffect(() => {
    if (shoppingCartSuma > 0) {
      // localStorage.setItem("cartUpdated", "suma");
      setShoppingCart({
        ...shoppingCart,
        suma: shoppingCartSuma,
      });
    }
  }, [shoppingCartSuma]);

  const handleChange = (event, newValue) => {
    // console.log(event, newValue);
    setValue(newValue);
    // in SSR navigate is not well supported
    // if (newValue === 0) {
    //   navigate("drones", {replace: true});
    // } else if (newValue === 1) {
    //   navigate("radio-control");
    // } else if (newValue === 2) {
    //   navigate("trasmisor-receptor");
    // } else if (newValue === 3) {
    //   navigate("accesorios");
    // } else if (newValue === 4) {
    //   navigate("software");
    // }
  };

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            {/* <Box sx={{ display: { xs: 'block', md: 'none'} }}>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Box> */}
            <Grid item>
              <NavLink
                to="/"
                variant="h6"
                underline="none"
                color="inherit"
                style={classes.linkLogo}
                // activeClassName="active"
              >
                <Box
                  component="img"
                  sx={classes.image}
                  src={WaviPixelLogo}
                  alt="logo Wavi Aeronautics"
                />
                {"Wavi Aeronautics"}
              </NavLink>
            </Grid>

            <Grid item xs />
            {/* <Grid item>
              <Tooltip title="Alertas • No hay alertas">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Ayuda">
                <IconButton color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <IconButton color="inherit" className={classes.iconButtonAvatar}>
                <Avatar src={AvatarUser} alt="My Avatar" />
              </IconButton>
            </Grid> */}
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        sx={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                Tienda{" "}
                <Typography color="inherit" variant="body1">
                  Envios gratis a toda Colombia!
                </Typography>
              </Typography>
            </Grid>
            {/* <Grid item>
              <Button
                className={classes.button}
                variant="outlined"
                color="inherit"
                size="small"
              >
                Ordenes
              </Button>
            </Grid>
            <Grid item>
              <Link className={classes.link} href="#" variant="body2">
                Favoritos
              </Link>
            </Grid> */}
            <Grid item>
              {shoppingCart.items} Productos.
              <br />$ {shoppingCart.suma} COP
            </Grid>
            <Grid item>
              <Tooltip title="Carrito">
                <IconButton color="inherit" onClick={handleShowCart}>
                  <ShoppingCartIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          <ShoppingCart
            className=""
            visible={showingCart}
            updated={shoppingUpdatedItems}
            setShowingCart={setShowingCart}
          />
          {/* hidden */}
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        sx={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Tabs
          onChange={handleChange}
          value={value}
          textColor="inherit"
          sx={classes.productTabs}
        >
          <Tab textColor="inherit" label="Drones" value={0} component="a" href="/tienda/drones/"></Tab>
          <Tab textColor="inherit" label="Radio Control" value={1} component="a" href="/tienda/radio-control/"/>
          <Tab textColor="inherit" label="Transmisión/Recepción" value={2} component="a" href="/tienda/trasmisor-receptor/" />
          <Tab textColor="inherit" label="Accesorios" value={3} component="a" href="/tienda/accesorios/" />
          <Tab textColor="inherit" label="Software" value={4} component="a" href="/tienda/software/" />
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  // classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
};

export default withRoot(Header);
