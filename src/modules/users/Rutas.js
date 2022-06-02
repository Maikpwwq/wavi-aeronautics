import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// importar las paginas
import Products from "./views/Products";
import RadioContol from "./views/RadioContol";
import Accesorios from "./views/Accesorios";
import Software from "./views/Software";
import ProductDetail from "./views/ProductDetail";

function Rutas() {
  return (
    <>
      <Routes>
        <Route index element={<Products />} />
        <Route path="drones" element={<Products />} />
        <Route path="drones/producto" element={<ProductDetail />} />
        <Route path="radio-control" element={<RadioContol />} />
        <Route path="radio-control/producto" element={<ProductDetail />} />
        <Route path="accesorios" element={<Accesorios />} />
        <Route path="accesorios/producto" element={<ProductDetail />} />
        <Route path="software" element={<Software />} />
        <Route path="producto" element={<ProductDetail />} />
        <Route path="*" element={<Navigate to="/tienda-base/"></Navigate>} />
      </Routes>
    </>
  );
}

export default Rutas;
