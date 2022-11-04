import React from "react";
import { useRoutes } from "react-router-dom";
import Home from "../../src/pages/Home";
import SignIn from "../../src/pages/SignIn";
import SignUp from "../../src/pages/SignUp";
// import Terms from "../../src/pages/Terms";
// import Privacy from "../../src/pages/Privacy";
import ForgotPassword from "../../src/pages/ForgotPassword";
import NotFound from "../../src/pages/NotFound";
import PaperBase from "../../src/pages/commerce/Paperbase";
// Rutas Internas Tienda
import Products from "../../src/pages/commerce/views/Products";
import TrasmisorReceptor from "../../src/pages/commerce/views/TrasmisorReceptor";
import RadioContol from "../../src/pages/commerce/views/RadioContol";
import Accesorios from "../../src/pages/commerce/views/Accesorios";
import Software from "../../src/pages/commerce/views/Software";
import ProductDetail from "../../src/pages/commerce/views/ProductDetail";
import ShoppingCart from "../../src/pages/commerce/views/ShoppingCart";
import DetallesEnvio from "../../src/pages/commerce/views/DetallesEnvio";

import ShoppingCartProvider from "../../src/pages/commerce/providers/ShoppingCartProvider";

const serverRoutes = () => {
  return useRoutes([
    {
      path: "/",
      element: <Home />,
      // children: [ ],
    },
    {
      path: "/sign-in/",
      element: <SignIn />,
    },
    {
      path: "/wavi-aeronautics/",
      element: <Home />,
    },
    {
      path: "/sign-up/",
      element: <SignUp />,
    },
    // {
    //   path: 'terms/',
    //   element: <Terms />,
    // },
    // {
    //   path: 'privacy/',
    //   element: <Privacy />,
    // },
    {
      path: "/forgot-password/",
      element: <ForgotPassword />,
    },
    {
      path: "/tienda/*",
      element: (
        <ShoppingCartProvider>
          <PaperBase />
        </ShoppingCartProvider>
      ),
      children: [
        // Rutas Internas Tienda
        {
          path: "drones/",
          element: <Products />,
          children: [
            {
              path: "producto",
              element: <ProductDetail />,
              children: [
                {
                  path: ":productoId",
                  element: <ProductDetail />,
                },
              ],
            },
          ],
        },
        {
          path: "radio-control",
          element: <RadioContol />,
          children: [
            {
              path: "producto",
              element: <ProductDetail />,
              children: [
                {
                  path: ":productoId",
                  element: <ProductDetail />,
                },
              ],
            },
          ],
        },
        {
          path: "trasmisor-receptor",
          element: <TrasmisorReceptor />,
          children: [
            {
              path: "producto",
              element: <ProductDetail />,
              children: [
                {
                  path: ":productoId",
                  element: <ProductDetail />,
                },
              ],
            },
          ],
        },
        {
          path: "accesorios",
          element: <Accesorios />,
          children: [
            {
              path: "producto",
              element: <ProductDetail />,
              children: [
                {
                  path: ":productoId",
                  element: <ProductDetail />,
                },
              ],
            },
          ],
        },
        {
          path: "software",
          element: <Software />,
        },
        {
          path: "producto",
          element: <ProductDetail />,
          children: [
            {
              path: ":productoId",
              element: <ProductDetail />,
            },
          ],
        },
        {
          path: "ver-carrito",
          element: <ShoppingCart />,
        },
        {
          path: "ver-carrito/*",
          element: <ShoppingCart />,
        },
        {
          path: "detalles-envio",
          element: <DetallesEnvio />,
        },
        {
          path: "detalles-envio/*",
          element: <DetallesEnvio />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);
};

export default serverRoutes;
