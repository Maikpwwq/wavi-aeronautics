import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import ShoppingCart from "./views/ShoppingCart";

import PropTypes from "prop-types";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import HelpIcon from "@mui/icons-material/Help";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Hidden from "@mui/material/Hidden";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { withStyles } from "@mui/styles";

import AvatarUser from "../../../public/static/img/l3mik3l.png";
// import WaviPixelLogo from "../../../public/static/img/WaviPixelLogo.png";
const WaviPixelLogo =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FWaviPixelLogo.png?alt=media&token=7edcec69-8b24-4b95-b970-6b9acfddbdeb";

const lightColor = "rgba(255, 255, 255, 0.7)";

const styles = (theme) => ({
  title: {
    fontSize: 24,
    flex: 1,
  },
  secondaryBar: {
    zIndex: 1, // Ver listado carrito de compras
  },
  productTabs: {
    overflow: "scroll !important",
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: "none",
    color: lightColor,
    "&:hover": {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
});

function Header(props) {
  const { classes, onDrawerToggle } = props;
  const navigate = useNavigate();
  const shoppingCartID = localStorage.getItem("cartID");
  const shoppingCartSuma =
    localStorage.getItem("cartSum") !== 0
      ? localStorage.getItem("cartSum")
      : null;
  const shoppingCartItems =
    localStorage.getItem("cartProducts") !== 0
      ? localStorage.getItem("cartProducts")
      : null;
  const shoppingUpdatedItems = localStorage.getItem("cartUpdated");
  const [showingCart, setShowingCart] = useState(false);
  const [value, setValue] = React.useState(0);
  const [shoppingCart, setShoppingCart] = useState({
    suma: 0,
    items: 0,
  });

  const handleShowCart = () => {
    setShowingCart(!showingCart);
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
    if (newValue === 0) {
      navigate("drones");
    } else if (newValue === 1) {
      navigate("radio-control");
    } else if (newValue === 2) {
      navigate("accesorios");
    } else if (newValue === 3) {
      navigate("software");
    }
  };

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            {/* <Hidden smUp>
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
            </Hidden> */}
            <Grid item>
              <NavLink
                to="/"
                variant="h2"
                underline="none"
                color="inherit"
                className={classes.title && classes.link}
                style={{
                  alignItems: "center",
                  display: "flex",
                  fontSize: "2rem",
                }}
                activeClassName="active"
              >
                <img
                  className={classes.image}
                  src={WaviPixelLogo}
                  alt="logo Wavi Aeronautics"
                  height="48"
                  width="48"
                  style={{
                    borderRadius: "50%",
                    marginRight: "30px",
                  }}
                />
                {"Wavi Aeronautics"}
              </NavLink>
            </Grid>

            <Grid item xs />
            <Grid item>
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
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                Tienda
              </Typography>
              <Typography color="inherit" variant="body1">
                Envios gratis a toda Colombia!
              </Typography>
            </Grid>
            <Grid item>
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
            </Grid>
            <Grid item>
              {shoppingCart.items} Productos. $ {shoppingCart.suma} COP
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
          />
          {/* hidden */}
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Tabs
          onChange={handleChange}
          value={value}
          textColor="inherit"
          className={classes.productTabs}
          style={{ overflow: "scroll" }}
        >
          <Tab textColor="inherit" label="Drones" value={0} />
          <Tab textColor="inherit" label="Radio Control" value={1} />
          <Tab textColor="inherit" label="Accesorios" value={2} />
          <Tab textColor="inherit" label="Software" value={3} />
        </Tabs>
      </AppBar>
    </React.Fragment>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);
