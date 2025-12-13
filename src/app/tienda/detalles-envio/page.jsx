'use client'
import React, { useState, useContext, useEffect } from 'react'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'
import GestionarMercadoPago from '../components/GestionarMercadoPago'
import GestionarPSE from '../components/GestionarPSE'
import Typography from '@/modules/components/Typography'
import { auth } from '@/firebase/firebaseClient'

import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'

import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import HomeIcon from '@mui/icons-material/Home'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox'
import PublicIcon from '@mui/icons-material/Public'

const styles = (theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#eaeff1',
    overflow: 'hidden'
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  inputInfo: {
    paddingBottom: `${theme.spacing(2)} !important`,
    paddingTop: `${theme.spacing(2)} !important`
  },
  label: {
    paddingBottom: `${theme.spacing(2)} !important`,
    textAlign: 'start',
    fontWeight: 'bold !important',
    fontSize: '1.2rem !important'
  },
  envioContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0'
  },
  title: {
    paddingBottom: theme.spacing(4)
  }
})

const DetallesEnvio = (props) => {
  const classes = styles(theme)
  const { shoppingCart } = useContext(ShowCartContext)
  const productsCart = shoppingCart?.productos
  console.log('DetallesEnvio', productsCart)
  
  const [userInfo, setUserInfo] = useState({
    userName: '',
    userMail: '',
    userPhone: ''
  })

  const [shippingInfo, setShippingInfo] = useState({
    shippingDirection: '',
    shippingCiudad: '',
    shippingBarrio: '',
    shippingPostalCode: ''
  })
  // State to control visibility of payment methods
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)

  // Pre-fill form with logged-in user data
  useEffect(() => {
    const user = auth.currentUser
    if (user) {
      setUserInfo(prev => ({
        ...prev,
        userName: user.displayName || prev.userName,
        userMail: user.email || prev.userMail,
        userPhone: user.phoneNumber || prev.userPhone
      }))
    }
  }, [])

  const handlePersonalInfo = (event) => {
    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value
    })
  }

  const handleShippinfInfo = (event) => {
    setShippingInfo({
      ...shippingInfo,
      [event.target.name]: event.target.value
    })
  }

  return (
    <>
      <Box sx={classes.root}>
        <Container sx={classes.container}>
          <Box sx={classes.envioContainer}>
            {/* <NavLink to="/sign-in/">
          Sigue con los datos de tu cuenta!
        </NavLink>         */}
            <Typography variant="h4" sx={classes.title} marked="center">
              Detalles de envío
            </Typography>
            <Grid container spacing={4} sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
              <Grid item xs={12} md={6}>
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
              </Grid>

              <Grid item xs={12} md={6}>
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
              </Grid>
            </Grid>
          </Box>
          {!!productsCart && (
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column'
                // visibility: showResume ? "visible" : "hidden",
              }}
            >
              <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold', letterSpacing: 1 }}>
                   RESUMEN DE ORDEN
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={4}>
                   <Grid item xs={12} sm={6} sx={{ textAlign: 'left' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'primary.main' }}>
                         <PersonIcon sx={{ mr: 1 }} />
                         <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            CLIENTE
                         </Typography>
                      </Box>
                      <Typography variant="body1" gutterBottom>
                         <strong>Nombre:</strong> {userInfo.userName || 'N/A'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                         <strong>Email:</strong> {userInfo.userMail || 'N/A'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                         <strong>Teléfono:</strong> {userInfo.userPhone || 'N/A'}
                      </Typography>
                   </Grid>
                   <Grid item xs={12} sm={6} sx={{ textAlign: 'left' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'secondary.main' }}>
                         <HomeIcon sx={{ mr: 1 }} />
                         <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            ENVÍO
                         </Typography>
                      </Box>
                      <Typography variant="body1" gutterBottom>
                         <strong>Dirección:</strong> {shippingInfo.shippingDirection || 'N/A'}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                         <strong>Ciudad:</strong> {shippingInfo.shippingCiudad || 'N/A'} {shippingInfo.shippingBarrio ? `(${shippingInfo.shippingBarrio})` : ''}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                         <strong>C. Postal:</strong> {shippingInfo.shippingPostalCode || 'N/A'}
                      </Typography>
                   </Grid>
                </Grid>
              </Paper>
              <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
                Resumen productos:
              </Typography>
              <Box sx={{ mt: 3, mb: 3 }}>
                {productsCart.map((producto, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderBottom: '1px solid #e0e0e0',
                      py: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                       <Box
                          component="img"
                          src={producto.imagenes?.[0]}
                          alt={producto.titulo}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'contain',
                            borderRadius: 1,
                            backgroundColor: '#fff',
                            p: 0.5,
                            border: '1px solid #eee'
                          }}
                        />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                            {producto.titulo}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Cantidad: {producto.cantidad || 1}
                          </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', minWidth: '100px', textAlign: 'right' }}>
                      {producto.precio}
                    </Typography>
                  </Box>
                ))}
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid #333', pt: 2 }}>
                   <Typography variant="h6">
                      Total: {shoppingCart.suma ? `$ ${shoppingCart.suma.toLocaleString('es-CO')}` : 'Calculating...'}
                   </Typography>
                </Box>
              </Box>
              <GestionarMercadoPago
                shippingInfo={shippingInfo}
                userInfo={userInfo}
                onPaymentMethodReady={() => setShowPaymentMethods(true)}
                isOrderConfirmed={showPaymentMethods}
              />
              {showPaymentMethods && (
                <GestionarPSE
                  shippingInfo={shippingInfo}
                  userInfo={userInfo}
                />
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  )
}

export default withRoot(DetallesEnvio)
