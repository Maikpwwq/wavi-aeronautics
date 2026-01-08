
import { auth, firestore } from '@/firebase/firebaseClient'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { saveCartToFirestore } from './shoppingCartService'

/**
 * Service to handle authentication requests using Firebase Client SDK.
 */
const authService = {

  /**
   * Helper to handle consistent error objects.
   */
  _handleError(error) {
    console.error('Auth Service Error:', error)
    return {
      userID: null,
      errorCode: error.code || 'unknown',
      errorMessage: error.message || 'An unknown error occurred'
    }
  },

  /**
   * Sign In request
   * @param {Object} credentials - { email, password }
   */
  async signIn(credentials) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      const user = userCredential.user
      return { userID: user.uid }
    } catch (error) {
      return this._handleError(error)
    }
  },

  /**
   * Sign Up request
   * @param {Object} userInfo - { email, password, firstName, lastName }
   */
  async signUp(userInfo) {
    try {
      const { email, password, firstName, lastName } = userInfo
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      const displayName = `${firstName} ${lastName}`
      
      // Prepare user data for Firestore
      const userData = {
        userMail: user.email,
        userJoined: user.metadata.creationTime,
        userId: user.uid,
        userName: displayName
      }

      // Initialize empty cart
      await saveCartToFirestore(user.uid, [])
      
      // Save user profile
      const usersRef = collection(firestore, 'users')
      await setDoc(doc(usersRef, user.uid), userData, { merge: true })

      console.log('Se ha registrado un nuevo usuario a Firebase', displayName)
      return { userID: user.uid }
      
    } catch (error) {
      return this._handleError(error)
    }
  },
  /**
   * Send Password Reset Email
   * @param {string} email
   */
  async sendPasswordResetEmail(email) {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      return this._handleError(error)
    }
  },

  /**
   * Social Login (Google & Facebook)
   * @param {string} providerName - 'google' or 'facebook'
   */
  async signInWithSocial(providerName) {
    try {
      let provider
      if (providerName === 'google') {
        provider = new GoogleAuthProvider()
      } else if (providerName === 'facebook') {
        provider = new FacebookAuthProvider()
      } else {
        throw new Error('Provider not supported')
      }

      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      // Check if user exists
      const userDocRef = doc(firestore, 'users', user.uid)
      const userDoc = await getDoc(userDocRef)

      if (userDoc.exists()) {
        // User exists, update lastLogin
        await setDoc(userDocRef, {
          lastLogin: serverTimestamp()
        }, { merge: true })
      } else {
        // New user
        const newUser = {
          userId: user.uid,
          userMail: user.email,
          userName: user.displayName || '',
          userJoined: user.metadata.creationTime,
          role: 'user', // Default role
          lastLogin: serverTimestamp()
        }
        
        // Initialize empty cart
        await saveCartToFirestore(user.uid, [])

        // Save user profile
        await setDoc(userDocRef, newUser)
      }

      return { userID: user.uid }
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        return {
           userID: null,
           errorCode: error.code,
           errorMessage: 'Ya existe una cuenta con el mismo email pero con credenciales diferentes.'
        }
      }
      return this._handleError(error)
    }
  }
}

export default authService
