import { auth } from "@/firebase/firebaseClient";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

// TODO: UpdatePassword
export default async function handler(req, res) {
  // console.log("req", req.body, JSON.parse(req.body));
  const { email } = JSON.parse(req.body);
  if (email !== undefined) {
    // console.log("email are not null", email);
    let credential = EmailAuthProvider.credentialWithLink(
      email,
      window.location.href
    );
    try {
      await reauthenticateWithCredential(auth, credential)
        // Auth.updateCurrentUser.linkWithCredential(credential)
        .then((usercred) => {
          // Al iniciar sesion almacena una instancia del usuario
          var user = usercred.user;
          const { uid } = user;
          // console.log("Se ha iniciado una nueva sesión", uid);
          // res.redirect("/tienda/drones");
          return res.json({ userID: uid });
        })
        .catch((err) => {
          // Manejar los Errores aqui.
          // console.log("Error upgrading anonymous account", err);
          var errorCode = err.code;
          var errorMessage = err.message;
          return res.json({ errorCode, errorMessage });
          // .redirect("auth/sign-in/").end();
        });
    } catch (error) {
      console.log("error signInWithCredential", error);
      return res.status(500).send(error).end();
    }
  }
}
