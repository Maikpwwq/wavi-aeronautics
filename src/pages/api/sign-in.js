import { auth } from '@/firebase/firebaseClient'
import { EmailAuthProvider, signInWithCredential } from 'firebase/auth'

// SignInAuth
export default async function handler (req, res) {
  // console.log("req", req.body, JSON.parse(req.body));
  const { email, password } = JSON.parse(req.body)
  if (email !== undefined && password !== undefined) {
    // console.log("email and password are not null", email, password);
    const credential = EmailAuthProvider.credential(email, password)
    try {
      await signInWithCredential(auth, credential)
        // Auth.updateCurrentUser.linkWithCredential(credential)
        .then((usercred) => {
          // Al iniciar sesion almacena una instancia del usuario
          const user = usercred.user
          const { uid } = user
          // console.log("Se ha iniciado una nueva sesión", uid);
          // res.redirect("/tienda/drones");
          return res.json({ userID: uid })
        })
        .catch((err) => {
          // Manejar los Errores aqui.
          // console.log("Error upgrading anonymous account", err);
          const errorCode = err.code
          const errorMessage = err.message
          return res.json({ errorCode, errorMessage })
          // .redirect("auth/sign-in/").end();
        })
    } catch (error) {
      console.log('error signInWithCredential', error)
      return res.status(500).send(error).end()
    }
  }
}
