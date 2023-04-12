"use client";
import React, { useEffect, useState, useContext } from "react";
// import "sessionstorage-polyfill";
// import "localstorage-polyfill";
// global.sessionstorage;
// global.localStorage;
import { ShowCartContext } from "@/app/tienda/providers/ShoppingCartProvider";
import { auth } from "@/firebase/firebaseClient";
// import { useNavigate } from "react-router-dom";
import { useMercadopago } from "react-sdk-mercadopago";
// import mercadopago from "mercadopago";
var mercadopago = require("mercadopago");
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@/modules/components/Typography";
import withRoot from "@/modules/withRoot";
import theme from "@/app/tienda/innerTheme";
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
  },
});

const MercadoPago = (props) => {
  const classes = styles(theme);
  const user = auth.currentUser || {};
  const userID = user.uid || null;

  let shoppingCartID = null;
  // useEffect(() => {
  if (typeof window !== "undefined") {
    shoppingCartID = localStorage.getItem("cartID");
  }
  // }, []);

  const usedID = userID ? userID : shoppingCartID;
  console.log("usedID", usedID)

  const { shoppingCart, updateShowCart } = useContext(ShowCartContext);
  const { show, productos } = shoppingCart;
  console.log("shoppingCart", show, productos)
  const { userInfo, shippingInfo } = props;
  // console.log("props", userInfo, shippingInfo)

  const visibility = productos.length > 0 ? true : false;

  const accessToken = process.env.NEXT_PUBLIC_MERCADOPAGOS_ACCESS_TOKEN;
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGOS_PUBLIC_KEY;
  // console.log("process.env.", accessToken, publicKey)

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

  // var preference = {
  //   items: [
  //     {
  //       title: 'Test',
  //       quantity: 1,
  //       currency_id: 'ARS',
  //       unit_price: 10.5
  //     }
  //   ]
  // };
  
  // mercadopago.preferences.create(preference)

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
    if (usedID && productos) {
      console.log("handleCheckout", usedID, productos);
      getPreference(productos)
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
          style={{ visibility: visibility ? "visible" : "hidden"}}
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
