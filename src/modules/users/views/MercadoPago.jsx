import React, { useEffect, useState } from "react";
import { useMercadopago } from "react-sdk-mercadopago";
// import mercadopago from "mercadopago";
var mercadopago = require("mercadopago");
import { useNavigate } from "react-router-dom";

const MercadoPago = (props) => {
  const navigate = useNavigate();
  const { visible } = props;
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
  // const handleCheckout = () => {
  //   let preference = {
  //     items: [
  //       {
  //         title: "Test",
  //         quantity: 1,
  //         currency_id: "COP",
  //         unit_price: 1000,
  //       },
  //     ],
  //   };
  // global.id = response.body.id;
  // navigate(response.body.sandbox_init_point);
  //   mercadopago.preferences
  //     .create(preference)
  //     .then(function (response) {
  //       console.log(response);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  const getPreference = async () => {
    let consult = {
      items: [
        {
          title: "Test",
          quantity: 1,
          currency_id: "COP",
          unit_price: 1000,
          picture_url:
            "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-1.png?alt=media&token=f4f153a2-45fd-415d-884c-6964d3bb582b",
          description: "Incluye",
        },
      ],
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

  useEffect(() => {
    if (visible) {
      getPreference()
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
  }, [mercadopagoSDK, visible]);

  return (
    <>
      <div className="cho-container" />
    </>
  );
};

export default MercadoPago;
