import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// importar las paginas
import Products from "./views/Products";
import TrasmisorReceptor from "./views/TrasmisorReceptor";
import RadioContol from "./views/RadioContol";
import Accesorios from "./views/Accesorios";
import Software from "./views/Software";
import ProductDetail from "./views/ProductDetail";
import ShoppingCart from "./views/ShoppingCart";
import DetallesEnvio from "./views/DetallesEnvio";

function Rutas() {
  return (
    <>
      <Routes>
        <Route index element={<Products />} />
        <Route path="drones" element={<Products />} />
        <Route path="drones/producto" element={<ProductDetail />} />
        <Route path="radio-control" element={<RadioContol />} />
        <Route path="radio-control/producto" element={<ProductDetail />} />
        <Route path="trasmisor-receptor" element={<TrasmisorReceptor />} />
        <Route path="trasmisor-receptor/producto" element={<ProductDetail />} />
        <Route path="accesorios" element={<Accesorios />} />
        <Route path="accesorios/producto" element={<ProductDetail />} />
        <Route path="software" element={<Software />} />
        <Route path="producto" element={<ProductDetail />} />
        <Route path="ver-carrito" element={<ShoppingCart />} />
        <Route path="ver-carrito/*" element={<ShoppingCart />} />
        <Route path="detalles-envio" element={<DetallesEnvio />} />
        <Route path="detalles-envio/*" element={<DetallesEnvio />} />
        <Route path="*" element={<Navigate to="/tienda/"></Navigate>} />
      </Routes>
    </>
  );
}

export default Rutas;
