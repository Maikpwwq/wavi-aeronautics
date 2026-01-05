'use client'

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { firestore, auth } from '@/firebase/firebaseClient'
import { loginSuccess } from '@/store/states/user' // Re-using loginSuccess to update Redux state
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import LockIcon from '@mui/icons-material/Lock'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonIcon from '@mui/icons-material/Person'
import { styled } from '@mui/material/styles'
import { motion } from 'framer-motion'
import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'
import AddressSection from './components/AddressSection'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.8)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  height: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
      transform: 'translateY(-5px)'
  }
}))

const ProfilePage = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
      displayName: '',
      email: '',
      phoneNumber: ''
  })
  const [originalData, setOriginalData] = useState({})
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            
            const initialData = {
              displayName: data.userName || user.displayName || '',
              email: user.email || '',
              phoneNumber: data.phoneNumber || ''
            }
            
            setFormData(initialData)
            setOriginalData(initialData)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        } finally {
          setLoading(false)
        }
      } else if (!user) {
        // Redirect or handle unauthenticated state if needed
        setLoading(false) // Just stop loading for now
      }
    }

    fetchUserData()
  }, [user])

  useEffect(() => {
    // Check for dirty state
    const isChanged = JSON.stringify(formData) !== JSON.stringify(originalData)
    setIsDirty(isChanged)
  }, [formData, originalData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const userRef = doc(firestore, 'users', user.uid)
      
      const updateData = {
        userName: formData.displayName,
        phoneNumber: formData.phoneNumber
      }

      await updateDoc(userRef, updateData)
      
      // Update local state
      setOriginalData(formData)
      setIsDirty(false)
      
      // Update Redux state with new display name
      // This is a simplified update; in a real app, you might re-fetch or update the full object
      const updatedUser = { ...user, displayName: formData.displayName }
      dispatch(loginSuccess(updatedUser))

      alert('Perfil actualizado correctamente!')
    } catch (error) {
      console.error("Error updating profile:", error)
      alert('Ha sucedido un error intente de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
      return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <CircularProgress />
          </Box>
      )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f7' }}>
      <AppAppBar />
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto', mt: 8 }}>
        <Grid container spacing={4}>
          {/* User Overview */}
          <Grid item xs={12} md={4}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <StyledPaper elevation={0}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <Avatar
                          sx={{ width: 120, height: 120, mb: 2, bgcolor: 'secondary.main', fontSize: '3rem' }}
                      >
                          {formData.displayName ? formData.displayName.charAt(0).toUpperCase() : <PersonIcon fontSize="large" />}
                      </Avatar>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                          {formData.displayName || 'User'}
                      </Typography>
                      
                      {user?.addresses && user.addresses.length > 0 ? (
                         <Chip 
                            icon={<LocationOnIcon fontSize="small" />} 
                            label={`${user.addresses[0].city}, ${user.addresses[0].country}`}
                            variant="outlined" 
                            sx={{ mb: 2 }} 
                        />
                      ) : (
                        <Chip 
                            icon={<LocationOnIcon fontSize="small" />} 
                            label="Sin dirección principal"
                            variant="outlined" 
                            sx={{ mb: 2 }} 
                        />
                      )}

                      <Typography variant="body2" color="text.secondary">
                          Miembro desde {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                      </Typography>
                  </Box>
                  <Divider sx={{ my: 3 }} />
                  <Box>
                      <Typography variant="subtitle2" gutterBottom>
                          Estado de la Cuenta
                      </Typography>
                      <Chip label="Activo" color="success" size="small" />
                  </Box>
              </StyledPaper>
            </motion.div>
          </Grid>

          {/* Editable Form */}
          <Grid item xs={12} md={8}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <StyledPaper elevation={0}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h5" fontWeight="bold">
                          Editar Perfil                                                                                                                                                                                                                                                                                                                                                             
                      </Typography>
                      {isDirty && (
                          <Button
                              variant="contained"
                              sx={{
                                bgcolor: '#00aCe4',
                                '&:hover': {
                                  bgcolor: '#0099cc'
                                }
                              }}
                              startIcon={<SaveIcon />}
                              onClick={handleSave}
                              disabled={saving}
                          >
                              {saving ? 'Guardando...' : 'Guardar Cambios'}
                          </Button>
                      )}
                  </Box>

                  <Grid container spacing={3} sx={{ flexDirection: 'column', justifyContent: 'center' }}>
                      <Grid item xs={12}>
                          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Información Personal</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              fullWidth
                              label="Nombre"
                              name="displayName"
                              value={formData.displayName}
                              onChange={handleChange}
                              variant="outlined"
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              fullWidth
                              label="Correo electrónico"
                              name="email"
                              value={formData.email}
                              variant="outlined"
                              disabled
                              InputProps={{
                                  startAdornment: (
                                      <InputAdornment position="start">
                                          <LockIcon fontSize="small" color="disabled" />
                                      </InputAdornment>
                                  ),
                              }}
                              helperText="El correo electrónico no puede ser cambiado"
                          />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <TextField
                              fullWidth
                              label="Número de celular"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              variant="outlined"
                          />
                      </Grid>

                      <Grid item xs={12}>
                          <Divider sx={{ my: 3 }} />
                          {/* Modular Address Section */}
                          <AddressSection user={user} addresses={user.addresses || []} />
                      </Grid>
                  </Grid>
              </StyledPaper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
      <AppFooter />
    </Box>
  )
}

export default ProfilePage
