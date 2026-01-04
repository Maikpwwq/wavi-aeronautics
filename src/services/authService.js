
import { auth, firestore } from '@/firebase/firebaseClient'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { collection, doc, setDoc } from 'firebase/firestore'
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
  }
}

export default authService
