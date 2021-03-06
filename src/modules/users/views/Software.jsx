import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "../../components/Typography";
import withRoot from "../../withRoot";
import theme from "../../theme";
import { styled } from "@mui/material/styles";

const styles = (theme) => ({
  presentationProducts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`,
    padding: `${theme.spacing(0)} ${theme.spacing(2)} !important`,
    display: "flex",
    flexDirection: "column",
  },
});

const Accesorios = (props) => {
  //const { classes } = props;
  const classes = styles(theme);
  useEffect(() => {}, []);

  return (
    <>
      <Box sx={classes.presentationProducts}>
        <Typography variant="h5">Simulador para vuelo de Drones.</Typography>
        <br />
        <br />
        <Link
          to="https://www.velocidrone.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Licencia Velocidrone!
        </Link>
      </Box>
    </>
  );
};

export default withRoot(Accesorios);
