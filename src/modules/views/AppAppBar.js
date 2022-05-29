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
// import WaviPixelLogo from "../../../public/static/img/WaviPixelLogo.png";
const WaviPixelLogo =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FWaviPixelLogo.png?alt=media&token=7edcec69-8b24-4b95-b970-6b9acfddbdeb";

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
  const [userAuth, setUserAuth] = useState(false);

  useEffect(() => {
    if (user && user !== {}) {
      setUserAuth(true);
    }
    console.log(user, userAuth);
  }, [user]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        alert("Cerro su sesión de manera exitosa!");
        setUserAuth(false);
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
            <NavLink
              to="/"
              variant="h6"
              underline="none"
              color="inherit"
              className={classes.title}
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
                style={{ borderRadius: "50%" }}
              />
              {"Wavi Aeronautics"}
            </NavLink>
          </div>
        </Toolbar>
        <div className={classes.right} sm={12} xs={12}>
          <Link
            color="inherit"
            variant="h6"
            underline="none"
            className={classes.rightLink}
            to="/tienda-base/"
          >
            <NavLink to="/tienda-base/">{"Tienda"}</NavLink>
          </Link>
          {userAuth ? (
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
          ) : (
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
