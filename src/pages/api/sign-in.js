import { auth } from "@/firebase/firebaseClient";
import { EmailAuthProvider, signInWithCredential } from "firebase/auth";

// SignInAuth
export default async function handler(req, res) {
  console.log("req", req.body, JSON.parse(req.body));
  const { email, password } = JSON.parse(req.body);
  if (email !== undefined && password !== undefined) {
    console.log("email and password are not null", email, password);
    let credential = EmailAuthProvider.credential(email, password);
    try {
      await signInWithCredential(auth, credential)
        // Auth.updateCurrentUser.linkWithCredential(credential)
        .then((usercred) => {
          // Al iniciar sesion almacena una instancia del usuario
          var user = usercred.user;
          console.log("Se ha iniciado una nueva sesión");
          res.redirect("/tienda/drones");
        })
        .catch((err) => {
          // Manejar los Errores aqui.
          console.log("Error upgrading anonymous account", err);
          // console.log(user, loading, error, signInWithProvider)
          var errorCode = err.code;
          var errorMessage = err.message;
          if (errorCode === "auth/wrong-password") {
            console.log("Wrong password.");
          } else if (errorCode === "auth/user-not-found") {
            console.log("User not found");
          } else if (errorCode === "auth/missing-email") {
            console.log("Missing email");
          } else {
            // window.alert(errorMessage);
            console.log(errorMessage);
          }
          return res.redirect("auth/sign-in/").end();
        });
    } catch (error) {
      console.log("error", error);
      return res.status(500).send(error).end();
    }
  }
}
