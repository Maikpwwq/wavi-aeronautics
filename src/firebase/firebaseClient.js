import { firebaseClientConfig } from '@/firebase/firebaseConfig'
import { getApps, initializeApp } from 'firebase/app'
// import * as fb from 'firebase/compat/app'

// Productos de Firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore' // getFirestore,
// import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'
// import { getAnalytics } from 'firebase/analytics'

let firebaseApp
// Instancia de Firebase
if (getApps().length < 1) {
  firebaseApp = initializeApp(firebaseClientConfig)
}
/*
if (typeof window !== 'undefined' && !fb.apps.length) {
    fb.initializeApp(firebaseClientConfig)
    fb.auth().setPersistence(fb.auth.Auth.Persistence.SESSION)
    // window.firebase = fb
}
const firebaseApp = fb.app()
const firebaseApp = !fb.apps.length
    ? fb.initializeApp(firebaseClientConfig)
    : fb.app()
*/
export { firebaseApp }

export const auth = getAuth(firebaseApp)
// export const currentUser = auth.currentUser
// console.log(currentUser)

// export const firestore = getFirestore(firebaseApp)
export const firestore = initializeFirestore(firebaseApp, {
  experimentalAutoDetectLongPolling: true
})
// firestore.settings({ timestampsInSnapshots: true })

export const storage = getStorage(firebaseApp)

// export const analytics = getAnalytics(firebaseApp)

// export const db = getDatabase(firebaseApp)

// console.log(db.ref().child('tienda'));

onAuthStateChanged(auth, (user) => {
  // Check for user status
  if (user) {
    console.log('onAuthStateChanged', user)
    // El Usuario se comparte con el lado del cliente
    // esto no funciona sharingInformationService.setSubject({ currentUser: user });
  } else {
    // El Usuario no ha iniciado su sesion
    console.log('no hay un usuario registrado')
  }
})
