import React, { useEffect } from "react";
// import mercadopago from "mercadopago";
var mercadopago = require("mercadopago");
import { useNavigate } from "react-router-dom";

const MercadoPago = () => {
  const navigate = useNavigate();
  const accessToken = process.env.MERCADOPAGOS_ACCESS_TOKEN;
  // const accessToken = `${process.env.MERCADOPAGOS_ACCESS_TOKEN}`;
  // v1/checkout/preferences
  // v1/payments/
  // process.env.MERCADOPAGOS_URL
  mercadopago.configure({
    access_token: accessToken,
  });
  console.log(accessToken);
  // notification_url: 'https://wavi-aeronautics-drones.web.app/',
  // res.body.data.id (payment.created)
  // external_reference: ''
  // parseInt("10.5"),
  // picture_url:
  //   "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-1.png?alt=media&token=f4f153a2-45fd-415d-884c-6964d3bb582b",
  // description: Incluye
  // var preference = {};
  // var item = {
  //   title: "Test",
  //   quantity: 1,
  //   currency_id: "COP",
  //   unit_price: 1000,
  // };
  // preference.items = [item]


  const handleCheckout = () => {
    let preference = {
      items: [
        {
          title: "Test",
          quantity: 1,
          currency_id: "COP",
          unit_price: 1000,
        },
      ],
    };
    // global.id = response.body.id;
    // navigate(response.body.sandbox_init_point);
    mercadopago.preferences
      .create(preference)
      .then(function(response){
        console.log(response);
      }).catch(function(error){
        console.log(error);
      });
  };

  //Adicione as credenciais de sua conta Mercado Pago junto ao SDK
  // const mp = new window.MercadoPago(`${process.env.MERCADOPAGOS_PUBLIC_KEY}`, {
  //   locale: "pt-COL",
  // });

  // const checkout = () => {
  //   mp.checkout({
  //     preference: {
  //       id: `${process.env.MERCADOPAGOS_PREFERENCE_ID}`, // Indica el ID de la preferencia
  //     },
  //     render: {
  //       container: ".cho-container", // Clase CSS para renderizar el botón de pago
  //       label: "Pagar", // Cambiar el texto del botón de pago (opcional)
  //   theme: {
  //     elementsColor: '#c0392b'.
  //     headerColor: '#c0392b',
  // }
  //     },
  //   });
  // };

  // useEffect(() => {
  //   checkout();
  // }, []);

  return (
    <>
      <div class="cho-container">
        <button type="button" onClick={handleCheckout}>
          PAGAR{" "}
        </button>
      </div>
    </>
  );
};

export default MercadoPago;
