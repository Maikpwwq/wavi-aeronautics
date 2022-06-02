import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "../../components/Typography";
import { withStyles } from "@mui/styles";

const styles = (theme) => ({
  presentationProducts: {
    margin: `${theme.spacing(4)} ${theme.spacing(4)}`,
  },
});

const Accesorios = (props) => {
  const { classes } = props;
  useEffect(() => {}, []);

  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column" }}
        className={classes.presentationProducts}
      >
        <Typography variant="h5">Simulador para vuelo de Drones.</Typography>
        <br />
        <br />
        Velocidrone!
      </Box>
    </>
  );
};

export default withStyles(styles)(Accesorios);
