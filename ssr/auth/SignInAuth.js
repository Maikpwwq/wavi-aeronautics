import { auth } from "../../src/firebase/firebaseClient";
import { EmailAuthProvider, signInWithCredential } from "firebase/auth";

const SignInAuth = ({ email, password, res }) => {

  if (email !== undefined && password !== undefined) {
    // console.log("email and password are not null", email, password);
    let credential = EmailAuthProvider.credential(email, password);
    signInWithCredential(auth, credential)
      // Auth.updateCurrentUser.linkWithCredential(credential)
      .then((usercred) => {
        // Al iniciar sesion almacena una instancia del usuario
        var user = usercred.user;
        console.log("Se ha iniciado una nueva sesión");
        res.redirect("/tienda/");
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
        res.redirect("/sign-in/");
      });
  }
};

export default SignInAuth;
