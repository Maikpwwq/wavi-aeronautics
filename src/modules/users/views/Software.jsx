import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "../../components/Typography";

const Accesorios = () => {

  useEffect(() => {
    
  }, []);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Typography variant="h3">Simulador para vuelo de Drones.</Typography>
        <br />
        <br />
        Velocidrone!
      </Box>
    </>
  );
};

export default Accesorios;