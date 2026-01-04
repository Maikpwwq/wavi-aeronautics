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
} else {
  firebaseApp = getApps()[0]
}

export { firebaseApp }

export const auth = getAuth(firebaseApp)

export const firestore = initializeFirestore(firebaseApp, {
  experimentalAutoDetectLongPolling: true
})

export const storage = getStorage(firebaseApp)

onAuthStateChanged(auth, (user) => {
  // Check for user status
  if (user) {
    console.log('onAuthStateChanged', user)
  } else {
    // El Usuario no ha iniciado su sesion
    console.log('no hay un usuario registrado')
  }
})
