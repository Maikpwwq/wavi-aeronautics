import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/firebaseClient";
import { signOut } from "firebase/auth";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@mui/styles";
import { NavLink } from "react-router-dom";
import Link from "@mui/material/Link";
import AppBar from "../components/AppBar";
import Toolbar, { styles as toolbarStyles } from "../components/Toolbar";
import WaviPixelLogo from "../../../public/static/img/WaviPixelLogo.png";

const styles = (theme) => ({
  title: {
    fontSize: 24,
    flex: 1,
  },
  image: {
    marginRight: "1em",
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    maxWidth: "360px",
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginRight: "1em",
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
});

function AppAppBar(props) {
  const { classes } = props;
  const user = auth.currentUser || {};
  // const [userAuth, setUserAuth] = useState(true);

  // useEffect(() => {
  //   if (user) {
  //     setUserAuth(false);
  //   }
  //   console.log(user, userAuth);
  // }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        alert("Cerro su sesión de manera exitosa!");
        // setUserAuth(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <AppBar
        position="fixed"
        className="main-bar navlink"
        style={{ flexDirection: "row" }}
      >
        <Toolbar className={classes.toolbar}>
          <div className={classes.left}>
            <Link
              variant="h6"
              underline="none"
              color="inherit"
              className={classes.title}
              to="/"
            >
              <NavLink to="/" style={{ alignItems: "center", display: "flex" }}>
                <img
                  className={classes.image}
                  src={WaviPixelLogo}
                  alt="logo Wavi Aeronautics"
                  height="48"
                  width="48"
                  style={{ borderRadius: "50%" }}
                />
                {"Wavi Aeronautics"}
              </NavLink>
            </Link>
          </div>
        </Toolbar>
        <div className={classes.right} sm={12} xs={12}>
          <Link
            color="inherit"
            variant="h6"
            underline="none"
            className={classes.rightLink}
            to="/paper-base/"
          >
            <NavLink to="/paper-base/">{"Tienda"}</NavLink>
          </Link>
          {user !== {} ? (
            <>
              <Link
                color="inherit"
                variant="h6"
                underline="none"
                className={classes.rightLink}
                to="/sign-in/"
              >
                <NavLink to="/sign-in/">{"Iniciar sesión"}</NavLink>
              </Link>
              <Link
                variant="h6"
                underline="none"
                className={clsx(classes.rightLink, classes.linkSecondary)}
                to="/sign-up/"
              >
                <NavLink to="/sign-up/">{"Registrarse"}</NavLink>
              </Link>
            </>
          ) : (
            <>
              <Link
                variant="h6"
                underline="none"
                className={clsx(classes.rightLink, classes.linkSecondary)}
              >
                <NavLink onClick={handleSignOut} to="/">
                  {"Cerrar Sesión"}
                </NavLink>
              </Link>
            </>
          )}
        </div>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
}

AppAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppAppBar);
