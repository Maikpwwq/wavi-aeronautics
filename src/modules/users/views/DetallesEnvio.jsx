import React, { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { withStyles } from "@mui/styles";
import MercadoPago from "../components/MercadoPago";
import Typography from "../../components/Typography";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";

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
    flexDirection: "row",
    alignItems: "center",
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
    paddingBottom: theme.spacing(8),
  },
});

const DetallesEnvio = (props) => {
  const { classes } = props;
  const { state } = useLocation() || {};
  const { productsCart } = state || "";
  console.log(productsCart);
  const visible = true;
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
      <section className={classes.root}>
        <Container
          className={classes.container}
          style={{ textAlign: "center" }}
        >
          <Box className={classes.envioContainer}>
            {/* <NavLink to="/sign-in/">
          Sigue con los datos de tu cuenta!
        </NavLink>         */}
            <Typography variant="h4" className={classes.title} marked="center">
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
                <FormLabel className={classes.label}>
                  Información personal:
                </FormLabel>
                <br />
                <br />
                <TextField
                  id="userName"
                  name="userName"
                  label="Nombre de usuario"
                  value={userInfo.userName}
                  onChange={handlePersonalInfo}
                  // defaultValue="@NOMBRE USUARIO"
                  className={classes.inputInfo}
                />
                <TextField
                  id="userMail"
                  name="userMail"
                  label="Correo de usuario"
                  value={userInfo.userMail}
                  onChange={handlePersonalInfo}
                  // defaultValue="@CORREO USUARIO"
                  className={classes.inputInfo}
                />
                <TextField
                  id="userPhone"
                  label="Celular"
                  name="userPhone"
                  value={userInfo.userPhone}
                  onChange={handlePersonalInfo}
                  // defaultValue="Celular"
                  className={classes.inputInfo}
                />
              </Box>

              <Box style={{ display: "flex", flexDirection: "column" }}>
                <FormLabel className={classes.label}>
                  Información de envio:
                </FormLabel>
                <br />
                <br />
                <TextField
                  id="shippingDirection"
                  label="Número Calle/Cr "
                  name="shippingDirection"
                  value={shippingInfo.shippingDirection}
                  onChange={handleShippinfInfo}
                  // defaultValue="Número Calle/Cr "
                  className={classes.inputInfo}
                />
                <TextField
                  id="shippingCiudad"
                  label="Ciudad"
                  name="shippingCiudad"
                  value={shippingInfo.shippingCiudad}
                  onChange={handleShippinfInfo}
                  // defaultValue="Ciudad"
                  className={classes.inputInfo}
                />
                <TextField
                  id="shippingBarrio"
                  label="Barrio"
                  name="shippingBarrio"
                  value={shippingInfo.shippingBarrio}
                  onChange={handleShippinfInfo}
                  // defaultValue="Barrio"
                  className={classes.inputInfo}
                />
                <TextField
                  id="shippingPostalCode"
                  name="shippingPostalCode"
                  label="Código postal "
                  value={shippingInfo.shippingPostalCode}
                  onChange={handleShippinfInfo}
                  // defaultValue="Código postal "
                  className={classes.inputInfo}
                />
              </Box>
            </FormGroup>
            {productsCart && (
              <MercadoPago
                visible={visible}
                products={productsCart}
                shippingInfo={shippingInfo}
                userInfo={userInfo}
              />
            )}
          </Box>
        </Container>
      </section>
    </>
  );
};

export default withStyles(styles)(DetallesEnvio);
