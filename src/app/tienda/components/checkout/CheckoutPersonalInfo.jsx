import React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'

const CheckoutPersonalInfo = ({ userInfo, handlePersonalInfo }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, height: '100%', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
         <PersonIcon color="primary" fontSize="large" />
         <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
           Información personal
         </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          id="userName"
          name="userName"
          label="Nombre de usuario"
          value={userInfo.userName}
          onChange={handlePersonalInfo}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="userMail"
          name="userMail"
          label="Correo de usuario"
          value={userInfo.userMail}
          onChange={handlePersonalInfo}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="userPhone"
          label="Celular"
          name="userPhone"
          value={userInfo.userPhone}
          onChange={handlePersonalInfo}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Paper>
  )
}

export default CheckoutPersonalInfo
