import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { auth } from '@/firebase/firebaseClient'
import { loginSuccess, logoutSuccess } from '@/store/states/user'

const AuthListener = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Extract only serializable data
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
          metadata: {
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime
          }
        }
        dispatch(loginSuccess(userData))
      } else {
        dispatch(logoutSuccess())
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  return null
}

export default AuthListener
