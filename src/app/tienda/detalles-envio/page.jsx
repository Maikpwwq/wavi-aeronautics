"use client";
import React, { useState, useEffect, useContext } from "react";
import withRoot from "@/modules/withRoot";
import theme from "../innerTheme";
import { styled } from "@mui/material/styles";
import MercadoPago from "../components/MercadoPago";
import Typography from "@/modules/components/Typography";

import { ShowCartContext } from "@/app/tienda/providers/ShoppingCartProvider";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

const styles = (theme) => ({
  root: {
    display: "flex",
    backgroundColor: "#eaeff1",
    overflow: "hidden",
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  inputInfo: {
    paddingBottom: `${theme.spacing(2)} !important`,
    paddingTop: `${theme.spacing(2)} !important`,
  },
  label: {
    paddingBottom: `${theme.spacing(2)} !important`,
    textAlign: "start",
    fontWeight: "bold !important",
    fontSize: "1.2rem !important",
  },
  envioContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 0",
  },
  title: {
    paddingBottom: theme.spacing(4),
  },
});

const DetallesEnvio = (props) => {
  const classes = styles(theme);
  const { shoppingCart } = useContext(ShowCartContext);
  const productsCart = shoppingCart.productos || "";
  console.log("DetallesEnvio", productsCart);

  const [showResume, setShowResume] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userName: "",
    userMail: "",
    userPhone: "",
  });

  const [shippingInfo, setShippingInfo] = useState({
    shippingDirection: "",
    shippingCiudad: "",
    shippingBarrio: "",
    shippingPostalCode: "",
  });

  const handlePersonalInfo = (event) => {
    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value,
    });
  };

  const handleShippinfInfo = (event) => {
    setShippingInfo({
      ...shippingInfo,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <Box sx={classes.root}>
        <Container sx={classes.container}>
          <Box sx={classes.envioContainer}>
            {/* <NavLink to="/sign-in/">
          Sigue con los datos de tu cuenta!
        </NavLink>         */}
            <Typography variant="h4" sx={classes.title} marked="center">
              Detalles de envío
            </Typography>
            <FormGroup
              action=""
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: "33px",
                }}
              >
                <FormLabel sx={classes.label}>Información personal:</FormLabel>
                <br />
                <br />
                <TextField
                  id="userName"
                  name="userName"
                  label="Nombre de usuario"
                  value={userInfo.userName}
                  onChange={handlePersonalInfo}
                  // defaultValue="@NOMBRE USUARIO"
                  sx={classes.inputInfo}
                />
                <TextField
                  id="userMail"
                  name="userMail"
                  label="Correo de usuario"
                  value={userInfo.userMail}
                  onChange={handlePersonalInfo}
                  // defaultValue="@CORREO USUARIO"
                  sx={classes.inputInfo}
                />
                <TextField
                  id="userPhone"
                  label="Celular"
                  name="userPhone"
                  value={userInfo.userPhone}
                  onChange={handlePersonalInfo}
                  // defaultValue="Celular"
                  sx={classes.inputInfo}
                />
              </Box>

              <Box style={{ display: "flex", flexDirection: "column" }}>
                <FormLabel sx={classes.label}>Información de envio:</FormLabel>
                <br />
                <br />
                <TextField
                  id="shippingDirection"
                  label="Número Calle/Cr "
                  name="shippingDirection"
                  value={shippingInfo.shippingDirection}
                  onChange={handleShippinfInfo}
                  // defaultValue="Número Calle/Cr "
                  sx={classes.inputInfo}
                />
                <TextField
                  id="shippingCiudad"
                  label="Ciudad"
                  name="shippingCiudad"
                  value={shippingInfo.shippingCiudad}
                  onChange={handleShippinfInfo}
                  // defaultValue="Ciudad"
                  sx={classes.inputInfo}
                />
                <TextField
                  id="shippingBarrio"
                  label="Barrio"
                  name="shippingBarrio"
                  value={shippingInfo.shippingBarrio}
                  onChange={handleShippinfInfo}
                  // defaultValue="Barrio"
                  sx={classes.inputInfo}
                />
                <TextField
                  id="shippingPostalCode"
                  name="shippingPostalCode"
                  label="Código postal "
                  value={shippingInfo.shippingPostalCode}
                  onChange={handleShippinfInfo}
                  // defaultValue="Código postal "
                  sx={classes.inputInfo}
                />
              </Box>
            </FormGroup>
          </Box>
          {productsCart && (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                // visibility: showResume ? "visible" : "hidden",
              }}
            >
              <Typography variant="h4" sx={classes.title} marked="center">
                Resumen detalles de envio
              </Typography>
              <Typography variant="h5" sx="">
                Información personal:
              </Typography>
              <Typography variant="body1" sx="">
                Nombre: {userInfo.userName} <br />
                Correo: {userInfo.userMail} <br />
                Celular: {userInfo.userPhone} <br />
              </Typography>
              <Typography variant="h5" sx="">
                Detalles de envío:
              </Typography>
              <Typography variant="body1" sx="">
                CodigoPostal: {shippingInfo.shippingPostalCode} <br />
                Dirección: {shippingInfo.shippingDirection} <br />
                Ciudad: {shippingInfo.shippingCiudad} <br />
              </Typography>
              <Typography variant="h5" sx="">
                Resumen productos:
              </Typography>
              <Box style={{ display: "flex", flexDirection: "column" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Titulo</TableCell>
                      <TableCell>Precio</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productsCart.map((producto, index) => {
                      let { titulo, precio, imagenes } = producto;
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Box
                              component="img"
                              src={imagenes[0]}
                              alt={titulo}
                              sx={{
                                height: 100,
                                display: "block",
                                maxWidth: 100,
                                overflow: "hidden",
                                width: "auto",
                              }}
                            ></Box>
                          </TableCell>
                          <TableCell>{titulo}</TableCell>
                          <TableCell>{precio}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
              <MercadoPago
                shippingInfo={shippingInfo}
                userInfo={userInfo}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default withRoot(DetallesEnvio);
