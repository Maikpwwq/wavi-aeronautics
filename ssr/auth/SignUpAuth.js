import { auth, firestore } from "../../src/firebase/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";

const SignUpAuth = ({ firstName, lastName, email, password, res }) => {
  const _firestore = firestore;
  const shoppingsRef = collection(_firestore, "shoppingCart");
  const usersRef = collection(_firestore, "users");

  const userToFirestore = async (updateInfo, userID) => {
    await setDoc(doc(usersRef, userID), updateInfo, { merge: true });
  };

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    await setDoc(doc(shoppingsRef, userRef), updateInfo, { merge: true });
  };

  if (
    email !== undefined &&
    password !== undefined &&
    firstName !== undefined &&
    lastName !== undefined
  ) {
    // console.log("email and password are not null", email, password, firstName, lastName);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        const displayName = firstName + " " + lastName;
        const data = {
          userMail: user.email,
          userJoined: user.metadata.creationTime,
          userId: user.uid,
          userName: displayName,
        };
        const usedId = user.uid;
        // Instancia un carrito de compras vacio
        shoppingsToFirestore({ productos: [] }, usedId).then(() => {
          localStorage.setItem("cartID", usedId);
          localStorage.setItem("cartUpdated", "id");
          console.log("Instancia un carrito de compras vacio");
        });
        userToFirestore(data, usedId).then(() => {
          console.log("Se ha registrado el usuario", displayName);
          res.redirect("/tienda/");
        });
      })
      .catch((err) => {
        console.log("Error upgrading anonymous account", err);
        console.log(err.code);
        // var errorCode = err.code;
        var errorMessage = err.message;
        console.log(errorMessage);
        res.redirect("/sign-up/");
      });
  }
};

export default SignUpAuth;
