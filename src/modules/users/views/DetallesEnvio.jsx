import React, { useState, useEffect } from "react";
import { useLocation, NavLink } from "react-router-dom";
import { withStyles } from "@mui/styles";
import MercadoPago from "../components/MercadoPago";
import Typography from "../../components/Typography";

import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";

const styles = (theme) => ({
  inputInfo: {
    paddingButtom: `${theme.spacing(2)} !important`,
    paddingTop: `${theme.spacing(2)} !important`,
  },
  envioContainer: {
    display: "flex",
    flexDirection: "column",
  },
});

const DetallesEnvio = (props) => {
  const { classes } = props;
  const { state } = useLocation() || {};
  const { productsCart } = state || "";
  console.log(productsCart);
  const visible = true;
  const [userInfo, setUserEditInfo] = useState({
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
    setUserEditInfo({
      ...userEditInfo,
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
      <Box className={classes.envioContainer} maxWidth="md">
        {/* <NavLink to="/sign-in/">
          Sigue con los datos de tu cuenta!
        </NavLink>         */}
        <Typography variant="h5" className="">
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
            <FormLabel>Información personal:</FormLabel>
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
              variant="filled"
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
            <FormLabel>Información de envio:</FormLabel>
            <br />
            <br />
            <TextField
              id="userDirection"
              label="Número Calle/Cr "
              name="userDirection"
              value={shippingInfo.shippingDirection}
              onChange={handleShippinfInfo}
              // defaultValue="Número Calle/Cr "
              className={classes.inputInfo}
            />
            <TextField
              id="userCiudad"
              name="userCiudad"
              label="Ciudad"
              value={shippingInfo.shippingCiudad}
              onChange={handleShippinfInfo}
              // defaultValue="Ciudad"
              className={classes.inputInfo}
            />
            <TextField
              id="userBarrio"
              label="Barrio"
              name="userBarrio"
              value={shippingInfo.shippingBarrio}
              onChange={handleShippinfInfo}
              // defaultValue="Barrio"
              className={classes.inputInfo}
            />
            <TextField
              id="userPostalCode"
              name="userPostalCode"
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
    </>
  );
};

export default withStyles(styles)(DetallesEnvio);
