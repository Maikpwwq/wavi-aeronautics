import React from 'react';
import { useRoutes } from 'react-router-dom';
import Home from "../../src/pages/Home";
import SignIn from "../../src/pages/SignIn";
import SignUp from "../../src/pages/SignUp";
// import Terms from "../../src/pages/Terms";
// import Privacy from "../../src/pages/Privacy";
import ForgotPassword from "../../src/pages/ForgotPassword";
import NotFound from "../../src/pages/NotFound";

const serverRoutes = () => {
  return useRoutes([
    {
      element: <Home />,
      path: '/',
    },
    {
      path: '/sign-in/',
      element: <SignIn />,
    },
    {
      path: '/sign-up/',
      element: <SignUp />,
    },
    // {
    //   path: '/terms/',
    //   element: <Terms />,
    // },
    // {
    //   path: '/privacy/',
    //   element: <Privacy />,
    // },
    {
      path: '/forgot-password/',
      element: <ForgotPassword />,
    },
    {
      path: '/tienda-base/*',
      element: <PaperBase />,
    },
    {
      path: '*',
      element: <NotFound />, 
    },
  ]);
};

export default serverRoutes;
