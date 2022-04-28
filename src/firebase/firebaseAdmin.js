import * as firebaseAdmin from 'firebase-admin'

// const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
// import serviceAccount from `${process.env.GOOGLE_APPLICATION_CREDENTIALS}`
import serviceAccount from '../../serviceAccountKey.json'

// use firebase dtabase instead
console.log(serviceAccount)
if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
        databaseURL: 'https://wavi-aeronautics-default-rtdb.firebaseio.com',
    })
}

export { firebaseAdmin }
