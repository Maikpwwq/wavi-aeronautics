import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// importar las paginas
import Products from "./views/Products";
import RadioContol from "./views/RadioContol";
import ProductDetail from "./views/ProductDetail";

function Rutas() {
  return (
    <>
      <Routes>
        <Route index element={<Products />} />
        <Route path="drones" element={<Products />} />
        <Route path="radio-control" element={<RadioContol />} />
        <Route path="accesorios" element={<RadioContol />} />
        <Route path="software" element={<RadioContol />} />
        <Route path="producto" element={<ProductDetail />} />
        <Route path="*" element={<Navigate to="/"></Navigate>} />
      </Routes>
    </>
  );
}

export default Rutas;