import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { auth } from '@/firebase/firebaseClient'
import { loginSuccess, logoutSuccess } from '@/store/states/user'

const AuthListener = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 1. Get basic auth data
        let userData = {
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

        // 2. Fetch additional data from Firestore (addresses, phone, etc.)
        try {
            const { doc, getDoc } = await import('firebase/firestore')
            const { firestore } = await import('@/firebase/firebaseClient')
            
            const userDocRef = doc(firestore, 'users', user.uid)
            const userDoc = await getDoc(userDocRef)

            if (userDoc.exists()) {
                const firestoreData = userDoc.data()
                // Merge firestore data (addresses, etc) with auth data
                userData = { ...userData, ...firestoreData }
            }
        } catch (error) {
            console.error("Error fetching user firestore data:", error)
        }

        // 3. Dispatch to Redux
        dispatch(loginSuccess(userData))

        // 4. Cart Merging Logic
        if (typeof window !== 'undefined') {
            const guestCartID = sessionStorage.getItem('cartID');
            // If we have a guest cart ID and it's different from the user ID (which becomes the new cart ID)
            if (guestCartID && guestCartID !== user.uid) {
                try {
                    const { mergeCarts } = await import('@/services/shoppingCartService');
                    await mergeCarts(guestCartID, user.uid);
                    console.log('Cart merged successfully');
                    sessionStorage.removeItem('cartID'); // Clear guest ID
                } catch (e) {
                    console.error('Failed to merge carts:', e); 
                }
            }
        }

        // 4. Persist to Session Storage
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('wavi_user', JSON.stringify(userData))
        }

      } else {
        dispatch(logoutSuccess())
        // Clear Session Storage
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('wavi_user')
        }
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  return null
}

export default AuthListener
