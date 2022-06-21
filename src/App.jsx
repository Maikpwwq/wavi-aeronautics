import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import "./App.scss";

// importar las paginas
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ForgotPassword from "./pages/ForgotPassword";
import { StyledEngineProvider } from '@mui/material/styles';
// import ProductDetail from "./modules/users/views/ProductDetail";

import PaperBase from "./modules/users/Paperbase";

function App() {
  return (
    <div className="app"> 
    {/* StyledEngineProvider injectFirst */}
      <Routes>
        <Route index element={<Home />} />
        <Route path="/sign-in/" element={<SignIn />} />
        <Route path="/sign-up/" element={<SignUp />} />
        <Route path="/terms/" element={<Terms />} />
        <Route path="/privacy/" element={<Privacy />} />
        <Route path="/forgot-password/" element={<ForgotPassword />} />
        <Route path="/tienda-base/*" element={<PaperBase />} />
        {/* <Route path="/producto/" element={<ProductDetail />} /> */}
        <Route path="*" element={<Navigate to="/"></Navigate>} />
      </Routes>
    </div>
  );
}

export default App;
