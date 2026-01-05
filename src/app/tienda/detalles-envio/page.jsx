'use client'
import React, { useState, useContext, useEffect } from 'react'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'
import GestionarMercadoPago from '@/app/tienda/components/GestionarMercadoPago'
import GestionarPSE from '@/app/tienda/components/GestionarPSE'
import Typography from '@/modules/components/Typography'
import { auth } from '@/firebase/firebaseClient'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'

// Import new modular components
import CheckoutPersonalInfo from '@/app/tienda/components/checkout/CheckoutPersonalInfo'
import CheckoutShippingInfo from '@/app/tienda/components/checkout/CheckoutShippingInfo'
import CheckoutOrderSummary from '@/app/tienda/components/checkout/CheckoutOrderSummary'

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
  const { shoppingCart, removeFromCart } = useContext(ShowCartContext)
  const productsCart = shoppingCart?.productos
  
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

  // Pre-fill form with logged-in user data from sessionStorage or Firebase Auth
  useEffect(() => {
    // Try to get full user data from sessionStorage (includes Firestore addresses)
    const storedUser = typeof window !== 'undefined' ? sessionStorage.getItem('wavi_user') : null;
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('[Checkout] User data from sessionStorage:', userData);
        
        // Pre-fill personal info
        setUserInfo(prev => ({
          ...prev,
          userName: userData.userName || userData.displayName || prev.userName,
          userMail: userData.userMail || userData.email || prev.userMail,
          userPhone: userData.phoneNumber || prev.userPhone
        }));
        
        // Pre-fill shipping info from addresses array (use first address if available)
        if (userData.addresses && userData.addresses.length > 0) {
          const primaryAddress = userData.addresses[0];
          setShippingInfo(prev => ({
            ...prev,
            shippingDirection: primaryAddress.street || prev.shippingDirection,
            shippingCiudad: primaryAddress.city || prev.shippingCiudad,
            shippingBarrio: primaryAddress.state || primaryAddress.additionalInfo || prev.shippingBarrio,
            shippingPostalCode: primaryAddress.zipCode || prev.shippingPostalCode
          }));
        }
      } catch (e) {
        console.error('[Checkout] Failed to parse wavi_user from sessionStorage:', e);
      }
    } else {
      // Fallback to Firebase Auth current user (basic info only)
      const user = auth.currentUser;
      if (user) {
        setUserInfo(prev => ({
          ...prev,
          userName: user.displayName || prev.userName,
          userMail: user.email || prev.userMail,
          userPhone: user.phoneNumber || prev.userPhone
        }));
      }
    }
  }, []);

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
            <Typography variant="h4" sx={classes.title} marked="center">
              Detalles de envío
            </Typography>
            <Grid container spacing={4} sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
              <Grid item xs={12} md={6}>
                  <CheckoutPersonalInfo 
                    userInfo={userInfo} 
                    handlePersonalInfo={handlePersonalInfo} 
                  />
              </Grid>

              <Grid item xs={12} md={6}>
                  <CheckoutShippingInfo 
                    shippingInfo={shippingInfo} 
                    handleShippinfInfo={handleShippinfInfo} 
                  />
              </Grid>
            </Grid>
          </Box>
          
          {/* Order Summary Section */}
          {!!productsCart && (
            <CheckoutOrderSummary 
              shoppingCart={shoppingCart}
              productsCart={productsCart}
              userInfo={userInfo}
              shippingInfo={shippingInfo}
              removeFromCart={removeFromCart}
            />
          )}

          {/* Payment Methods Section */}
          {!!productsCart && (
            <Box sx={{ width: '100%', mt: 4 }}>
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
