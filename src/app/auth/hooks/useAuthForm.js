import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sharingInformationService } from '@/services/sharing-information'

const useAuthForm = () => {
  const router = useRouter()
  const [sent, setSent] = useState(false)
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  // Helper to show alerts
  const handleAlert = (message, severity = 'success') => {
    setAlert({ open: true, message, severity })
  }

  // Handle closing snackbar
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') return
    setAlert((prev) => ({ ...prev, open: false }))
  }

  // Common success handler
  const handleSuccess = (userID, successMessage, redirectPath = '/tienda/drones') => {
      setSent(true)
      handleAlert(successMessage, 'success')
      // Persist session
      if (typeof window !== 'undefined' && !!userID) {
         sessionStorage.setItem('cartID', userID)
         sharingInformationService.setSubject({ userID }) // Ensure we notify app of login
         console.log('Session started for userID:', userID)
         // Optional: sessionStorage.setItem('cartUpdated', 'new id') if needed
         
         // Redirect after short delay or immediately? Original code was immediate.
         router.push(redirectPath)
      }
  }

  // Common error handler based on firebase codes
  const handleError = (errorCode, errorMessage) => {
      setSent(false)
      console.error('Auth Error:', errorCode, errorMessage)

      switch (errorCode) {
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            handleAlert('Estas credenciales son incorrectas.', 'error')
            break
        case 'auth/weak-password':
            handleAlert('Contraseña muy debil.', 'error')
            break
        case 'auth/missing-email':
            handleAlert('Falta un correo.', 'error')
            break
        default:
            handleAlert('Ha sucedido un error intente de nuevo.', 'error')
      }
  }

  return {
    sent,
    setSent,
    alert,
    handleAlert,
    handleCloseAlert,
    handleSuccess,
    handleError
  }
}

export default useAuthForm
