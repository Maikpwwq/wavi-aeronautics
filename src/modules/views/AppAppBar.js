import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/firebaseClient";
import { signOut } from "firebase/auth";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import withRoot from "../withRoot";
import theme from "../theme";
import PropTypes from "prop-types";
import clsx from "clsx";
import { styled } from "@mui/material/styles";
import { NavLink } from "react-router-dom";
import AppBar from "../components/AppBar";
// import WaviPixelLogo from "../../../publicAssets/static/img/WaviPixelLogo.png";
const WaviPixelLogo =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FWaviPixelLogo.png?alt=media&token=7edcec69-8b24-4b95-b970-6b9acfddbdeb";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  height: 64,
  justifyContent: "space-between",
  [theme.breakpoints.up("sm")]: {
    height: 70,
  },
}));

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.common.white,
  marginRight: "1em",
}));

const styles = (theme) => ({
  title: {
    fontSize: 24,
    flex: 1,
  },
  image: {
    marginRight: "1em",
    height: 48,
    width: 48,
    borderRadius: "50%",
  },
  placeholder: {
    height: 64,
    [theme.breakpoints.up("sm")]: {
      height: 70,
    },
  },
  left: {
    flex: 1,
  },
  leftLinkActive: {
    color: theme.palette.common.white, // "#00aCe4",
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    maxWidth: "360px",
  },

  linkSecondary: {
    color: theme.palette.secondary.main, // "#00aCe4",
  },
});

function AppAppBar(props) {
  // const { theme } = props;
  const classes = styles(theme);
  console.log(classes);
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const [userAuth, setUserAuth] = useState(false);
  console.log(user);
  useEffect(() => {
    if (user && userID) {
      setUserAuth(true);
      console.log(user, userAuth);
    }
    console.log(user, userAuth);
  }, [user]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUserAuth(false);
        localStorage.clear();
        alert("Cerro su sesión de manera exitosa!");
        console.log(auth.currentUser);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box>
      <AppBar
        position="fixed"
        className="main-bar navlink"
        style={{ flexDirection: "row" }}
      >
        <StyledToolbar>
          <Box sx={classes.left}>
            <NavLink
              to="/"
              variant="h6"
              underline="none"
              color="inherit"
              sx={classes.title}
              style={{
                alignItems: "center",
                display: "flex",
                fontSize: "2rem",
              }}
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
          </Box>
        </StyledToolbar>
        <Box sx={classes.right} sm={12} xs={12}>
          <StyledNavLink
            color="inherit"
            variant="h6"
            underline="none"
            to="/tienda-base/"
          >
            {"Tienda"}
          </StyledNavLink>
          {userAuth ? (
            <>
              <StyledNavLink
                variant="h6"
                underline="none"
                className={clsx(classes.linkSecondary)}
                onClick={handleSignOut}
                to="/"
              >
                {"Cerrar Sesión"}
              </StyledNavLink>
            </>
          ) : (
            <>
              <StyledNavLink
                color="inherit"
                variant="h6"
                underline="none"
                to="/sign-in/"
              >
                {"Iniciar sesión"}
              </StyledNavLink>
              {/* <Link
                variant="h6"
                underline="none"
                className={clsx(classes.rightLink, classes.linkSecondary)}
                to="/sign-up/"
              >
                <NavLink to="/sign-up/">{"Registrarse"}</NavLink>
              </Link> */}
            </>
          )}
        </Box>
      </AppBar>
      <Box sx={classes.placeholder} />
    </Box>
  );
}

AppAppBar.propTypes = {};

export default withRoot(AppAppBar);
