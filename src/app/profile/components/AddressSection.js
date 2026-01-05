import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { motion, AnimatePresence } from 'framer-motion'
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { firestore as db } from '@/firebase/firebaseClient'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '@/store/states/user'
import AddressModal from './AddressModal'

const AddressSection = ({ user, addresses = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const dispatch = useDispatch()

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleSaveAddress = async (newAddress) => {
    try {
        if (!user?.uid) return

        const userRef = doc(db, 'users', user.uid)
        
        // Add to Firestore
        await updateDoc(userRef, {
            addresses: arrayUnion(newAddress)
        })

        // Update Redux State immediately
        const updatedUser = {
            ...user,
            addresses: [...addresses, newAddress]
        }
        dispatch(loginSuccess(updatedUser))

        handleCloseModal()
    } catch (error) {
        console.error("Error saving address: ", error)
    }
  }

  const handleDeleteAddress = async (addressToDelete) => {
    try {
        if (!user?.uid) return
        
        const userRef = doc(db, 'users', user.uid)
        
        // Remove from Firestore
        await updateDoc(userRef, {
            addresses: arrayRemove(addressToDelete)
        })

         // Update Redux State
         const updatedAddresses = addresses.filter(addr => 
            addr.street !== addressToDelete.street || addr.zipCode !== addressToDelete.zipCode
         )
         
         const updatedUser = {
            ...user,
            addresses: updatedAddresses
        }
        dispatch(loginSuccess(updatedUser))

    } catch (error) {
        console.error("Error deleting address: ", error)
    }
  }

  const handleSetDefault = async (addressToDefault) => {
      // In a real app, you might want to restructure data to have a "isDefault" flag
      // or move the default address to index 0.
      // For now, let's just make sure it's visually marked (if we had a flag).
      // Since the requirement says "Set as Default action", let's assume we update the array order or add a flag.
      // For simplicity in this array-of-objects structure without IDs, let's just move it to top.
      
      const otherAddresses = addresses.filter(addr => addr !== addressToDefault)
      const newAddresses = [addressToDefault, ...otherAddresses]

      try {
        const userRef = doc(db, 'users', user.uid)
        // Updating the whole array
        await updateDoc(userRef, {
            addresses: newAddresses
        })

        const updatedUser = { ...user, addresses: newAddresses }
        dispatch(loginSuccess(updatedUser))

      } catch (error) {
          console.error("Error setting default: ", error)
      }
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
          Direcciones de Envío
        </Typography>
        <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={handleOpenModal}
            sx={{
                borderColor: '#00aCe4',
                color: '#00aCe4',
                marginLeft: '1rem',
                '&:hover': {
                    borderColor: '#0099cc',
                    color: '#0099cc',
                    backgroundColor: 'rgba(0, 172, 228, 0.05)'
                }
            }}
        >
            Registrar Dirección
        </Button>
      </Box>

      {addresses.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', textAlign: 'center', py: 2 }}>
              No tienes direcciones registradas.
              <br/>
              Dale click a "Registrar Dirección" para agregar una nueva.
          </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <AnimatePresence>
                {addresses.map((addr, index) => (
                    <motion.div
                        key={`${addr.street}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                    >
                        <Card sx={{ 
                            bgcolor: 'background.paper', 
                            color: 'text.primary',
                            border: index === 0 ? '1px solid #00aCe4' : '1px solid rgba(0,0,0,0.1)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            position: 'relative'
                        }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', pb: '16px !important' }}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <LocationOnIcon sx={{ color: index === 0 ? '#00aCe4' : 'text.disabled', mt: 0.5 }} />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            {addr.street}
                                            {index === 0 && (
                                                <Chip label="Principal" size="small" sx={{ ml: 1, bgcolor: 'rgba(0, 172, 228, 0.1)', color: '#00aCe4', fontWeight: 'bold', height: 20, fontSize: '0.7rem' }} />
                                            )}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {addr.city}, {addr.state}, {addr.country}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                            {addr.zipCode}
                                            {addr.additionalInfo && ` • ${addr.additionalInfo}`}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    {index !== 0 && (
                                        <IconButton 
                                            size="small" 
                                            onClick={() => handleSetDefault(addr)}
                                            sx={{ color: 'text.disabled', '&:hover': { color: '#ffd700' } }}
                                            title="Establecer como principal"
                                        >
                                            <StarBorderIcon />
                                        </IconButton>
                                    )}
                                    {index === 0 && (
                                         <IconButton size="small" sx={{ color: '#ffd700', pointerEvents: 'none' }}>
                                            <StarIcon />
                                        </IconButton>
                                    )}
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleDeleteAddress(addr)}
                                        sx={{ color: 'text.disabled', '&:hover': { color: '#ff4444' } }}
                                        title="Eliminar"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </Box>
      )}

      {/* Address Modal */}
      <AddressModal 
        open={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveAddress} 
      />
    </Box>
  )
}

export default AddressSection
