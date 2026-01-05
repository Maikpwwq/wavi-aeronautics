import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete'
import GoogleMapsLoader from './GoogleMapsLoader'

const AddressModal = ({ open, onClose, onSave }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(30, 30, 40, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          borderRadius: 2
        }
      }}
    >
        <GoogleMapsLoader>
            <AddressFormContent onClose={onClose} onSave={onSave} />
        </GoogleMapsLoader>
    </Dialog>
  )
}

const AddressFormContent = ({ onClose, onSave }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'co' }, // Colombia default
    },
    debounce: 300,
  })

  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Colombia', // Default
    additionalInfo: ''
  })

  const handleSelect = async (address) => {
    setValue(address, false)
    clearSuggestions()

    try {
      const results = await getGeocode({ address })
      // Parse components
      const parsed = parseAddressComponents(results[0].address_components)
      
      setAddressData(prev => ({
        ...prev,
        street: parsed.street,
        city: parsed.city,
        state: parsed.state,
        zipCode: parsed.zipCode,
        country: parsed.country || 'Colombia'
      }))
      
    } catch (error) {
      console.error('Error: ', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setAddressData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (!addressData.street || !addressData.city) {
        // Basic validation
        return 
    }
    onSave(addressData)
    onClose()
  }

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
        color: 'white',
        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
        '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
        '&.Mui-focused fieldset': { borderColor: '#00ccff' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#00ccff' }
  }

  return (
    <>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        Registrar Dirección de Envío
      </DialogTitle>
      
      <DialogContent sx={{ mt: 2 }}>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {/* Google Autocomplete Search */}
            <Autocomplete
                freeSolo
                id="google-places-autocomplete"
                disableClearable
                options={data.map((suggestion) => suggestion.description)}
                onInputChange={(e, newValue) => setValue(newValue)}
                onChange={(e, newValue) => handleSelect(newValue)}
                inputValue={value}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Buscar dirección (Google Maps)"
                        placeholder="Ej: Carrera 7 # 32..."
                        variant="outlined"
                        fullWidth
                        disabled={!ready}
                        sx={textFieldSx}
                    />
                )}
            />

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: -1 }}>
                Selecciona una opción de la lista para autocompletar.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    name="street"
                    label="Dirección/Calle"
                    value={addressData.street}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    sx={textFieldSx}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    name="city"
                    label="Ciudad/Municipio"
                    value={addressData.city}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    sx={textFieldSx}
                />
                <TextField
                    name="state"
                    label="Departamento/Estado"
                    value={addressData.state}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    sx={textFieldSx}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    name="zipCode"
                    label="Código Postal"
                    value={addressData.zipCode}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    sx={textFieldSx}
                />
                <TextField
                    name="country"
                    label="País"
                    value={addressData.country}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    sx={textFieldSx}
                />
            </Box>

            <TextField
                name="additionalInfo"
                label="Información Adicional (Apto, Torre, etc.)"
                value={addressData.additionalInfo}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                multiline
                rows={2}
                sx={textFieldSx}
            />

        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Button onClick={onClose} sx={{ color: 'white' }}>
          Cancelar
        </Button>
        <Button 
            onClick={handleSubmit} 
            variant="contained" 
            sx={{ 
                bgcolor: '#00aCe4', 
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#0099cc' }
            }}
        >
          Guardar Dirección
        </Button>
      </DialogActions>
    </>
  )
}

export default AddressModal
