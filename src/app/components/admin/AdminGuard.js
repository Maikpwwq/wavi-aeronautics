'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { auth, firestore } from '@/firebase/firebaseClient'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

/**
 * AdminGuard - Higher-Order Component for admin-only page protection
 * 
 * Waits for Firebase auth state to be restored on page reload,
 * then verifies admin role from Firestore before rendering children.
 */
const AdminGuard = ({ children }) => {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // Not logged in
        console.log('[AdminGuard] No Firebase user, redirecting to login')
        router.replace('/auth/sign-in?redirect=/admin')
        return
      }

      // User is logged in, check if they have admin role in Firestore
      try {
        const userDocRef = doc(firestore, 'users', firebaseUser.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (!userDoc.exists()) {
          console.log('[AdminGuard] User document not found, redirecting to home')
          router.replace('/')
          return
        }

        const userData = userDoc.data()
        const isAdmin = userData.role === 'admin' || userData.rol === 'admin'

        if (!isAdmin) {
          console.log('[AdminGuard] User is not admin, redirecting to home')
          router.replace('/')
          return
        }

        // User is admin
        console.log('[AdminGuard] User authorized as admin')
        setIsAuthorized(true)
        setIsChecking(false)
      } catch (error) {
        console.error('[AdminGuard] Error checking admin status:', error)
        router.replace('/')
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [router])

  // Show loading spinner while checking auth
  if (isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#1a2744',
          color: 'white'
        }}
      >
        <CircularProgress size={60} sx={{ color: '#00bcd4', mb: 3 }} />
        <Typography variant="h6">
          Verificando permisos...
        </Typography>
      </Box>
    )
  }

  // If authorized, render children
  if (isAuthorized) {
    return <>{children}</>
  }

  // Should not reach here as redirect happens, but return null just in case
  return null
}

export default AdminGuard

