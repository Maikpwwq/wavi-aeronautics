import { collection, doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "@/firebase/firebaseClient";

function FirebaseAddToCart({ productos }) {
  const cartProductos = productos;
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = sessionStorage.getItem("cartID");
  const usedID = userID ? userID : shoppingCartID;
  const _firestore = firestore;
  const shoppingsRef = collection(_firestore, "shoppingCart");

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    const productData = await setDoc(doc(shoppingsRef, userRef), updateInfo, { merge: true });
    sessionStorage.setItem("cartUpdated", "agregar");
    // console.log("*productData*", productData);
    return productData;
  };
  console.log("FirebaseAddToCart", {productos: cartProductos}, usedID);
  shoppingsToFirestore({ productos: cartProductos }, usedID);
}

export default FirebaseAddToCart;
