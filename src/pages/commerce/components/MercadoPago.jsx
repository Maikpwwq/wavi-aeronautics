import React, { useEffect, useState } from "react";
import "sessionstorage-polyfill";
import "localstorage-polyfill";
global.sessionstorage;
global.localStorage;
import { auth } from "../../../firebase/firebaseClient";
import { useNavigate } from "react-router-dom";
import { useMercadopago } from "react-sdk-mercadopago";
// import mercadopago from "mercadopago";
var mercadopago = require("mercadopago");
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "../../../modules/components/Typography";
import withRoot from "../../../modules/withRoot";
import theme from "../innerTheme";
import { styled } from "@mui/material/styles";

const styles = (theme) => ({
  checkout: {
    padding: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  pagoBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    top: "24px",
    position: "relative",
    visibility: visibility ? "visible" : "hidden",
  },
});

const MercadoPago = (props) => {
  const navigate = useNavigate();
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID");
  const usedID = userID ? userID : shoppingCartID;
  const { visible, products, userInfo, shippingInfo } = props;
  const classes = styles(theme);
  const visibility = products.length > 0 && visible ? true : false;
  const accessToken = process.env.MERCADOPAGOS_ACCESS_TOKEN;
  const publicKey = process.env.MERCADOPAGOS_PUBLIC_KEY;
  const mercadopagoSDK = useMercadopago.v2(publicKey, {
    locale: "es-CO",
  });
  const [checkoutPro, setCheckoutPro] = useState({
    url: "",
  });
  // v1/checkout/preferences
  // v1/payments/
  // process.env.MERCADOPAGOS_URL
  mercadopago.configure({
    access_token: accessToken,
  });
  // console.log(accessToken);
  // notification_url: 'https://wavi-aeronautics-drones.web.app/',
  // external_reference: ''
  // global.id = response.body.id;
  // navigate(response.body.sandbox_init_point);
  //   mercadopago.preferences
  //     .create(preference)
  //     .then(function (response) {
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       cerror);
  //     });
  // };

  const getPreference = async (productos) => {
    productos.map((producto, index, array) => {
      let { titulo, precio, descripcion, imagenes } = producto;
      array[index] = {
        title: titulo,
        quantity: 1,
        currency_id: "COP",
        unit_price: parseInt(precio),
        picture_url: imagenes[0],
        // description: descripcion,
      };
      return array;
    });
    const pagador = {
      name: userInfo?.userName,
      email: userInfo?.userMail,
      phone: { number: userInfo?.userPhone },
      address: {
        zip_code: shippingInfo?.shippingPostalCode,
        street_number: shippingInfo?.shippingDirection,
      },
    };
    const metodoEnvio = {
      mode: "custom",
      free_shipping: true,
      receiver_address: {
        zip_code: shippingInfo?.shippingPostalCode,
        street_number: shippingInfo?.shippingDirection,
        city_name: shippingInfo?.shippingCiudad,
      },
    };
    let consult = {
      items: productos,
      payer: pagador,
      shipments: metodoEnvio,
    };
    console.log(consult);
    const response = await fetch(
      `https://api.mercadopago.com/checkout/preferences?access_token=${accessToken}`,
      {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consult),
        mode: "cors",
        method: "POST",
      }
    );
    return response.json();
  };

  const handleCheckout = () => {
    if (usedID && visible && products) {
      // console.log(products);
      getPreference(products)
        .then((res) => {
          // console.log(res.init_point);
          setCheckoutPro({ ...checkoutPro, url: res.init_point });
          // setShowResume(true);
          if (mercadopagoSDK) {
            mercadopagoSDK.checkout({
              preference: {
                id: res.id,
              },
              render: {
                container: ".cho-container",
                label: "Pagar con Mercado Pago",
                type: "wallet",
              },
              //   theme: {
              //     elementsColor: '#c0392b'.
              //     headerColor: '#c0392b',
              // }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {}, []);

  return (
    <>
      <Box sx={classes.pagoBtn}>
        <Button
          variant="contained"
          color="primary"
          sx={classes.checkout}
          onClick={() => handleCheckout()}
        >
          Confirmar Orden
        </Button>
        <span className="cho-container" />
      </Box>
    </>
  );
};

export default withRoot(MercadoPago);
