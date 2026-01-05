'use client'

import React, { useState } from 'react'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { auth } from '@/firebase/firebaseClient'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Backdrop from '@mui/material/Backdrop'
import LockResetIcon from '@mui/icons-material/LockReset'
import SecurityIcon from '@mui/icons-material/Security'
import { styled } from '@mui/material/styles'
import { motion } from 'framer-motion'
import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  maxWidth: '500px',
  margin: '0 auto',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
}))

const ModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
  outline: 'none'
}

const SecurityPage = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [strength, setStrength] = useState(0)

  // Calculate password strength
  const calculateStrength = (password) => {
    let score = 0
    if (!password) return 0
    if (password.length > 8) score += 25
    if (/[A-Z]/.test(password)) score += 25
    if (/[0-9]/.test(password)) score += 25
    if (/[^A-Za-z0-9]/.test(password)) score += 25
    return score
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value
    setNewPassword(val)
    setStrength(calculateStrength(val))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match")
      setLoading(false)
      return
    }

    if (strength < 50) {
      setError("Password is too weak")
      setLoading(false)
      return
    }

    const user = auth.currentUser

    if (user) {
      try {
        await updatePassword(user, newPassword)
        setSuccess("Password updated successfully")
        setNewPassword('')
        setConfirmPassword('')
        setStrength(0)
      } catch (error) {
        console.error("Error updating password", error)
        if (error.code === 'auth/requires-recent-login') {
          setModalOpen(true)
        } else {
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const handleReauth = async () => {
    setError('')
    setLoading(true)
    const user = auth.currentUser
    const credential = EmailAuthProvider.credential(user.email, currentPassword)

    try {
      await reauthenticateWithCredential(user, credential)
      setModalOpen(false)
      setCurrentPassword('')
      // Retry update
      await updatePassword(user, newPassword)
      setSuccess("Password updated successfully!")
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error("Re-auth failed", error)
      setError("Authentication failed. Please check your current password.")
    } finally {
      setLoading(false)
    }
  }

  const getStrengthColor = (val) => {
    if (val < 30) return 'error'
    if (val < 60) return 'warning'
    return 'success'
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f7' }}>
      <AppAppBar />
      <Box sx={{ p: { xs: 2, md: 4 }, mt: 8 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <StyledPaper>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
              <SecurityIcon fontSize="large" sx={{ mr: 1 }} />
              <Typography variant="h5" fontWeight="bold">
                Ajustes de Seguridad
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Gestiona tu seguridad y preferencias de contraseña usando el formulario a continuación.
            </Typography>
            
            <Divider sx={{ mb: 4 }} />

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Nueva Contraseña"
                  type="password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  error={strength > 0 && strength < 50}
                  helperText={strength > 0 && strength < 50 ? "Contraseña es muy débil" : ""}
                />
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={strength} 
                      color={getStrengthColor(strength)}
                      sx={{ height: 8, borderRadius: 5 }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {strength}%
                  </Typography>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Confirmar Nueva Contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 4 }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || !newPassword}
                startIcon={<LockResetIcon />}
                sx={{ 
                  height: 48,
                  bgcolor: 'black',
                  '&:hover': { bgcolor: '#333' }
                }}
              >
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </Button>
            </form>
          </StyledPaper>
        </motion.div>
      </Box>

      {/* Re-auth Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={modalOpen}>
          <Box sx={ModalStyle}>
            <Typography variant="h6" component="h2" gutterBottom>
              Verificar Identidad
            </Typography>
            <Typography sx={{ mb: 3 }} color="text.secondary">
              Por razones de seguridad, por favor ingresa tu contraseña actual para continuar.
            </Typography>
            <TextField
              fullWidth
              label="Contraseña Actual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => setModalOpen(false)} color="inherit">
                Cancelar
              </Button>
              <Button onClick={handleReauth} variant="contained" disabled={loading}>
                Confirmar
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <AppFooter />
    </Box>
  )
}

export default SecurityPage
