'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

/**
 * AdminGuard - Higher-Order Component for admin-only page protection
 * 
 * Checks if the current user has admin role before rendering children.
 * Redirects unauthorized users to the login page.
 */
const AdminGuard = ({ children }) => {
  const router = useRouter()
  const user = useSelector((state) => state.user)
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Give Redux a moment to hydrate from sessionStorage
    const checkAuth = async () => {
      // Small delay to allow sessionStorage hydration
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (!user) {
        // Not logged in
        console.log('[AdminGuard] No user found, redirecting to login')
        router.replace('/auth/sign-in?redirect=/admin')
        return
      }

      if (user.rol !== 'admin') {
        // Logged in but not admin
        console.log('[AdminGuard] User is not admin, redirecting to home')
        router.replace('/')
        return
      }

      // User is admin
      console.log('[AdminGuard] User authorized as admin')
      setIsAuthorized(true)
      setIsChecking(false)
    }

    checkAuth()
  }, [user, router])

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
