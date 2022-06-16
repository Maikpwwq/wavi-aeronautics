import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "../../components/Typography";
import { withStyles } from "@mui/styles";

const styles = (theme) => ({
  presentationProducts: {
    margin: `${theme.spacing(4)} ${theme.spacing(2)}`,
  },
});

const Accesorios = (props) => {
  const { classes } = props;
  useEffect(() => {}, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 2,
          mb: 2,
          ps: 2,
          pe: 2,
        }}
        // className={classes.presentationProducts}
      >
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

export default withStyles(styles)(Accesorios);
