import { auth, firestore } from "@/firebase/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";

// SignUpAuth
export default async function handler(req, res) {
  const { firstName, lastName, email, password } = JSON.parse(req.body);
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
    console.log(
      "email and password are not null",
      email,
      password,
      firstName,
      lastName
    );
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const displayName = firstName + " " + lastName;
          const data = {
            userMail: user.email,
            userJoined: user.metadata.creationTime,
            userId: user.uid,
            userName: displayName,
          };
          const usedId = user.uid;
          if (!!usedId) {
            // Instancia un carrito de compras vacio
            shoppingsToFirestore({ productos: [] }, usedId).then(() => {
              console.log("Instancia un carrito de compras vacio", usedId);
            });
            userToFirestore(data, usedId).then(() => {
              console.log("Se ha registrado un nuevo usuario a Firebase", displayName);
              return res.json({ userID: usedId });
              // res.redirect("/tienda/drones");
            });
          }
        })
        .catch((err) => {
          console.log("Error upgrading anonymous account", err);
          console.log(err.code);
          const errorCode = err.code;
          const errorMessage = err.message;
          console.log(errorMessage);
          return res.json({ errorMessage, errorCode });
          // res.redirect("auth/sign-up/");
        });
    } catch (error) {
      console.log("error", error);
      return res.status(500).send(error).end();
    }
  }
}
