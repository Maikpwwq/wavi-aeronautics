"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import PropTypes from "prop-types";
import Button from "../components/Button";
import withRoot from "../withRoot";
import theme from "../theme";
import Typography from "../components/Typography";
import ProductHeroLayout from "./ProductHeroLayout";
import Box from "@mui/material/Box";
// import MavicAir from "public/static/img/Portada-DJI-Mavic-Air-2.png";
const MavicAir = "/static/img/Portada-DJI-Mavic-Air-2.png";
// const MavicAir =
//    "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FPortada-DJI-Mavic-Air-2.png?alt=media&token=c74ad4fe-459b-47e2-8542-fca74408f429";

const styles = (theme) => ({
  background: {
    // backgroundImage: `url(${MavicAir})`,
    backgroundImage: `url("/static/img/Portada-DJI-Mavic-Air-2.png")`,
    backgroundColor: "#7fc7d9", // Average color of the background image.
    backgroundPosition: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    zIndex: -2,
  },
  button: {
    minWidth: 200,
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up("sm")]: {
      marginTop: theme.spacing(10),
    },
    paddingBottom: "2em",
    paddingTop: "1.5em",
  },
  more: {
    marginTop: theme.spacing(2),
    paddingTop: "1em",
  },
});

function ProductHero(props) {
  // const { theme } = props;
  const classes = styles(theme);
  const navigate = useRouter();
  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <Image
        style={{ display: "none"}}
        src={MavicAir}
        alt="increase priority"
        width={1300}
        height={650}
      />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Necesitas un Dron
      </Typography>
      <Typography color="inherit" align="center" variant="h5" sx={classes.h5}>
        Somos fabricantes y distribuidores de Technología VToL (despegue y
        aterrizaje vertical).
        <br />
        Solicita alguno de nuestros servicios.
      </Typography>
      <Button
        color="secondary"
        size="large"
        variant="contained"
        className="navlink"
        sx={classes.button}
      >
        <Link href="auth/sign-up/">{"Registrarse"}</Link>
      </Button>
      <Typography variant="body2" color="inherit" sx={classes.more}>
        Disfruta nuestras ofertas
      </Typography>
    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  // classes: PropTypes.object.isRequired,
};

export default withRoot(ProductHero);
