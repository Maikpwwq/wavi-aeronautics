import { collection, doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebaseClient";

function FirebaseAddToCart({ products }) {
  const productos = products;
  const user = auth.currentUser || {};
  const userID = user.uid || null;
  const shoppingCartID = localStorage.getItem("cartID");
  const usedID = userID ? userID : shoppingCartID;
  const _firestore = firestore;
  const shoppingsRef = collection(_firestore, "shoppingCart");

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    const productData = await setDoc(doc(shoppingsRef, userRef), updateInfo); // , { merge: true }
    console.log("*productData*", productData);
    return productData;
  };

  shoppingsToFirestore(productos, usedID);
}

export default FirebaseAddToCart;
