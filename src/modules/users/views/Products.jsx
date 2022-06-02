import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { firestore, storage, auth } from "../../../firebase/firebaseClient";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import Box from "@mui/material/Box";
import ProductCard from "../components/ProductCard";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "../../components/Typography";

const Products = () => {
  // const user = auth.currentUser || {};
  // const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID") || null;
  const productosDrones = sessionStorage.getItem("Productos_Drones") || null;
  const productosDronesRC =
    sessionStorage.getItem("Productos_DronesRC") || null;
  const _firestore = firestore;
  const _storage = storage;
  const shoppingsRef = collection(_firestore, "shoppingCart");
  // const productsRef = collection(_firestore, "productos/dron/kit_fpv_dron")
  const productsRef = collection(_firestore, "productos");
  const productsDoc = doc(productsRef, "dron");
  const productsCollection = collection(productsDoc, "kit_fpv_dron");
  const productsCollectionRC = collection(productsDoc, "RC");

  const [storeProducts, setStoreProducts] = useState([]);
  const [storeProductsRC, setStoreProductsRC] = useState([]);

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    await setDoc(doc(shoppingsRef, userRef), updateInfo, { merge: true });
  };

  // Lectura del catalogo de productos desde firestore
  const productsFromFirestore = async () => {
    const productData = await getDocs(productsCollection);
    const productDataRC = await getDocs(productsCollectionRC);
    let productos = [];
    let productosRC = [];
    productData.forEach((DOC) => {
      productos.push(DOC.data());
    });
    productDataRC.forEach((DOC) => {
      productosRC.push(DOC.data());
    });
    return [productos, productosRC];
  };

  const productosToSessionStore = () => {
    let productData;
    let productos = [];
    let productosRC = [];
    if (!productosDrones || !productosDronesRC) {
      console.log(productosDrones, productosDronesRC);
      productData = productsFromFirestore();
      productData.then((response) => {
        console.log(response[0], response[1]);
        productos = response[0];
        productosRC = response[1];
        parsePrices(productos, productosRC);
      });
    } else {
      productos = JSON.parse(productosDrones);
      productosRC = JSON.parse(productosDronesRC);
      parsePrices(productos, productosRC);
    }
  };

  const parsePrices = (productos, productosRC) => {
    console.log(productos, productosRC);
    if (productos && productos.length > 0) {
      sessionStorage.setItem("Productos_Drones", JSON.stringify(productos));
      productos.map((product, index, array) => {
        console.log(product.precio);
        if (
          typeof parseInt(product.precio) === "number" &&
          product.precio !== "Agotado"
        ) {
          array[index].precio = parseInt(product.precio).toLocaleString(
            "es-CO",
            { style: "currency", currency: "COP" }
          );
        }
      });
      setStoreProducts(productos);

      //console.log(storeProducts)
    }
    if (productosRC && productosRC.length > 0) {
      sessionStorage.setItem("Productos_DronesRC", JSON.stringify(productosRC));
      productosRC.map((product, index, array) => {
        if (
          typeof parseInt(product.precio) === "number" &&
          product.precio !== "Agotado"
        ) {
          array[index].precio = parseInt(product.precio).toLocaleString(
            "es-CO",
            { style: "currency", currency: "COP" }
          );
        }
      });
      setStoreProductsRC(productosRC);
    }
  };

  const newShoppingCart = () => {
    const shoppingsId = uuidv4();
    shoppingsToFirestore({ productos: [] }, shoppingsId);
    localStorage.setItem("cartID", shoppingsId);
    localStorage.setItem("cartUpdated", "id");
  };

  useEffect(() => {
    localStorage.setItem("cartUpdated", "tienda");
    console.log("shoppingCartID", shoppingCartID);
    if (!shoppingCartID) {
      newShoppingCart();
    }
    productosToSessionStore();
  }, [shoppingCartID]);

  return (
    <>
      <h3>Productos:</h3>
      <br />
      <div>
        {storeProducts.length == 0 ? (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        ) : (
          <div>
            <p>Descubre los mejores kits de Dron FPV listos para vuelo.</p>
            <br />
            <br />
            <Grid container spacing={2}>
              {storeProducts.map((product, k) => {
                return (
                  <Grid item key={k} sm={12} xs={12} md={5} lg={4} xl={3}>
                    <ProductCard
                      className="d-flex mb-2"
                      products={product}
                      productID={k}
                    ></ProductCard>
                  </Grid>
                );
              })}
            </Grid>
            <br />
            <br />
            <h3>Drones a control remoto BNF/PNP/RTF. </h3>
            <br />
            <br />
            <p>
              Bind aNd Fly: Esta versión es la que viene con todo menos con el
              transmisor y el radio control./
            </p>
            <p>
              Plug aNd Play: Esta es la versión incluye todo menos el
              transmisor, el radio control, el receptor, batería y cargador./
            </p>
            <p>
              Ready To Fly: Esta es la versión completa, puede funcionar desde
              el momento que lo recibes.
            </p>
            <br />
            <br />
            <Grid container spacing={2}>
              {storeProductsRC.map((product, k) => {
                return (
                  <Grid item key={k} sm={12} xs={12} md={5} lg={4} xl={3}>
                    <ProductCard
                      className="d-flex mb-2"
                      products={product}
                      productID={k}
                    ></ProductCard>
                  </Grid>
                );
              })}
            </Grid>
          </div>
        )}
      </div>
      <Box maxWidth="md">
        <Typography variant="body1" marked="left" gutterBottom>
          « Envío Internacional. Productos, precios, stock y tiempos de entrega
          sujetos a cambios, como resultado de la actualización automática
          realizada diariamente. »<br></br>
          <br></br>
          Nuestros proveedores nos ofrecen una garantía de 30 días la cual
          extendemos a nuestros clientes, esta cubre daños por defectos del
          material o errores en la fabricación. No cubre mala manipulación por
          parte del usuario.<br></br>
          <br></br>
          En caso de que ya no desee el producto recibido, puede realizar la
          devolución del mismo en un periodo no mayor a 5 días, a partir de su
          entrega. Para ello, deberá pagar el costo del retorno hacia USA. Este
          varia de acuerdo al tamaño y peso del producto.<br></br>
          <br></br>
          ------------------------------------------------------------------
          <br></br>
          ---------------------- TIEMPOS DE ENVIÓ --------------------------
          <br></br>
          ----------------------- DE 10 A 15 DÍAS --------------------------
          <br></br>
          -------------------- A CIUDADES PRINCIPALES ----------------------
          <br></br>
          ------------------------------------------------------------------
        </Typography>
      </Box>
    </>
  );
};

export default Products;
