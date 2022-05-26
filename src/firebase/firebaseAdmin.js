import * as firebaseAdmin from 'firebase-admin'
import { initializeApp, applicationDefault } from 'firebase-admin/app'

// const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
// import serviceAccount from `${process.env.GOOGLE_APPLICATION_CREDENTIALS}`
import serviceAccount from '../../serviceAccountKey.json'

// use firebase dtabase instead
console.log(serviceAccount)
if (!firebaseAdmin.apps.length) {
    initializeApp({
        // credential: firebaseAdmin.credential.cert(serviceAccount),
        credential: applicationDefault(),
        databaseURL: 'https://wavi-aeronautics-default-rtdb.firebaseio.com',
    })
}

export { firebaseAdmin }
