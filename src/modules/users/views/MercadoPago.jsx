import React from "react";

// /checkout/preferences
// process.env.MERCADOPAGOS_URL

const MercadoPago = () => {
  //Adicione as credenciais de sua conta Mercado Pago junto ao SDK
  const mp = new MercadoPago(`${process.env.MERCADOPAGOS_PUBLIC_KEY}`, {
    locale: "pt-BR",
  });
  const checkout = mp.checkout({
    preference: {
      id: `${process.env.MERCADOPAGOS_PREFERENCE_ID}`, // Indica el ID de la preferencia
    },
    render: {
      container: ".cho-container", // Clase CSS para renderizar el botón de pago
      label: "Pagar", // Cambiar el texto del botón de pago (opcional)
    },
  });
  return (
    <>
      <div class="cho-container"></div>
      //Adicione o SDK MercadoPago.js/v2
      <script src="https://sdk.mercadopago.com/js/v2"></script>
    </>
  );
};

export default MercadoPago;
