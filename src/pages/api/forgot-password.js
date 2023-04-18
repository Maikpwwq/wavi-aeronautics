import { auth } from "@/firebase/firebaseClient";
import { sendPasswordResetEmail } from "firebase/auth";

// TODO: UpdatePassword
export default async function handler(req, res) {
  // console.log("req", req.body, JSON.parse(req.body));
  const { email } = JSON.parse(req.body);
  if (email !== undefined) {
    console.log("email is not null", email);
    try {
      await sendPasswordResetEmail(auth, email)
        .then((usercred) => {
          // Se envia un correo para cambiar el password de usuario
          console.log("Se ha enviado un correo de verificación", usercred);
          return res.json();
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
      console.log("error UpdatePassword", error);
      return res.status(500).send(error).end();
    }
  }
}
