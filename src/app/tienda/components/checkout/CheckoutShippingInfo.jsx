import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox'
import HomeIcon from '@mui/icons-material/Home'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import PublicIcon from '@mui/icons-material/Public'

const CheckoutShippingInfo = ({ shippingInfo, handleShippinfInfo }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, height: '100%', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
         <MarkunreadMailboxIcon color="secondary" fontSize="large" />
         <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
           Información de envío
         </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          id="shippingDirection"
          label="Dirección (Calle/Cra)"
          name="shippingDirection"
          value={shippingInfo.shippingDirection}
          onChange={handleShippinfInfo}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <HomeIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="shippingCiudad"
          label="Ciudad"
          name="shippingCiudad"
          value={shippingInfo.shippingCiudad}
          onChange={handleShippinfInfo}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationCityIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="shippingBarrio"
          label="Barrio"
          name="shippingBarrio"
          value={shippingInfo.shippingBarrio}
          onChange={handleShippinfInfo}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PublicIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="shippingPostalCode"
          name="shippingPostalCode"
          label="Código postal"
          value={shippingInfo.shippingPostalCode}
          onChange={handleShippinfInfo}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MarkunreadMailboxIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Paper>
  )
}

export default CheckoutShippingInfo
