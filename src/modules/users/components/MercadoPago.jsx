import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { withStyles } from "@mui/styles";
import { useMercadopago } from "react-sdk-mercadopago";
import { auth } from "../../../firebase/firebaseClient";
// import mercadopago from "mercadopago";
var mercadopago = require("mercadopago");
import { useNavigate } from "react-router-dom";

const styles = (theme) => ({
  checkout: {
    padding: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
});

const MercadoPago = (props) => {
  const navigate = useNavigate();
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID");
  const usedID = userID ? userID : shoppingCartID;
  const { visible, products, classes } = props;
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
    let consult = {
      items: productos,
    };
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

  console.log(products);

  const handleCheckout = () => {
    if (usedID && visible && products) {
      console.log(products);
      getPreference(products)
        .then((res) => {
          console.log(res.init_point);
          setCheckoutPro({ ...checkoutPro, url: res.init_point });
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

  // useEffect(() => {
  //   if (usedID && visible && products) {
  //     console.log(products);
  //     getPreference(products)
  //       .then((res) => {
  //         console.log(res.init_point);
  //         setCheckoutPro({ ...checkoutPro, url: res.init_point });
  //         if (mercadopagoSDK) {
  //           mercadopagoSDK.checkout({
  //             preference: {
  //               id: res.id,
  //             },
  //             render: {
  //               container: ".cho-container",
  //               label: "Pagar con Mercado Pago",
  //               type: "wallet",
  //             },
  //             //   theme: {
  //             //     elementsColor: '#c0392b'.
  //             //     headerColor: '#c0392b',
  //             // }
  //           });
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, [products]);

  return (
    <>
      {products && products.lenght > 0 ? (
        <>
          <Button
            variant="contained"
            color="primary"
            className={classes.checkout}
            onClick={handleCheckout}
          >
            Caja
          </Button>
          <span className="cho-container" />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default withStyles(styles)(MercadoPago);