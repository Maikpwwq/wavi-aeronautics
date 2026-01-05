'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import withRoot from '@/modules/withRoot'
import Typography from '@/modules/components/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import Button from '@mui/material/Button'
import Link from 'next/link'
import { useContext } from 'react'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import { createOrder } from '@/services/ordersService'
import { auth } from '@/firebase/firebaseClient'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    padding: '40px 20px'
  },
  icon: {
    fontSize: 80,
    marginBottom: 20
  },
  successIcon: {
    color: '#4caf50'
  },
  errorIcon: {
    color: '#f44336'
  },
  pendingIcon: {
    color: '#ff9800'
  },
  button: {
    marginTop: 30
  }
}


const PSEResultadoContent = () => {
  const searchParams = useSearchParams()
  const { shoppingCart, removeFromCart } = useContext(ShowCartContext)
  const [status, setStatus] = useState('loading')
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [orderCreated, setOrderCreated] = useState(false)

  useEffect(() => {
    const processResult = async () => {
      const collection_status = searchParams.get('collection_status')
      const payment_id = searchParams.get('payment_id') || searchParams.get('collection_id')
      const external_reference = searchParams.get('external_reference')
      const status_param = searchParams.get('status')

      const paymentStatus = collection_status || status_param || 'unknown'
      
      setPaymentInfo({
        paymentId: payment_id,
        externalReference: external_reference,
        status: paymentStatus
      })

      if (paymentStatus === 'approved') {
        setStatus('success')
        
        // Create order in Firestore if not already created in this session
        if (!orderCreated && shoppingCart.productos.length > 0) {
          try {
            const user = auth.currentUser
            const orderData = {
              userId: user?.uid || 'guest',
              paymentId: payment_id,
              externalReference: external_reference,
              items: shoppingCart.productos.map(p => ({
                name: p.titulo,
                quantity: p.cantidad || 1,
                price: parseFloat(p.precio?.toString().replace(/[^0-9.-]+/g,"") || 0)
              })),
              total: shoppingCart.suma,
              status: 'processing',
              paymentMethod: 'pse'
            }
            
            await createOrder(orderData)
            setOrderCreated(true)
            
            // Clear cart
            shoppingCart.productos.forEach(p => removeFromCart(p.productID))
          } catch (error) {
            console.error("Failed to create order after success:", error)
          }
        }
      } else if (paymentStatus === 'pending' || paymentStatus === 'in_process') {
        setStatus('pending')
      } else if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
        setStatus('error')
      } else {
        setStatus('pending')
      }
    }

    processResult()
  }, [searchParams, shoppingCart, removeFromCart, orderCreated])

  switch (status) {
    case 'loading':
      return (
        <>
          <CircularProgress size={60} />
          <Typography variant="h5" sx={{ mt: 3 }}>
            Procesando tu pago...
          </Typography>
        </>
      )
    
    case 'success':
      return (
        <>
          <CheckCircleIcon sx={{ ...styles.icon, ...styles.successIcon }} />
          <Typography variant="h4" gutterBottom>
            ¡Pago Exitoso!
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Tu pago PSE ha sido procesado correctamente.
          </Typography>
          {paymentInfo?.paymentId && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              ID de Pago: {paymentInfo.paymentId}
            </Typography>
          )}
          <Button
            component={Link}
            href="/tienda/drones-fpv-hd"
            variant="contained"
            color="primary"
            sx={styles.button}
          >
            Volver a la Tienda
          </Button>
        </>
      )
    
    case 'pending':
      return (
        <>
          <HourglassEmptyIcon sx={{ ...styles.icon, ...styles.pendingIcon }} />
          <Typography variant="h4" gutterBottom>
            Pago Pendiente
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Tu pago PSE está siendo procesado por el banco.
            Recibirás una confirmación cuando se complete.
          </Typography>
          {paymentInfo?.paymentId && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              ID de Pago: {paymentInfo.paymentId}
            </Typography>
          )}
          <Button
            component={Link}
            href="/tienda/drones-fpv-hd"
            variant="contained"
            color="primary"
            sx={styles.button}
          >
            Volver a la Tienda
          </Button>
        </>
      )
    
    case 'error':
      return (
        <>
          <ErrorIcon sx={{ ...styles.icon, ...styles.errorIcon }} />
          <Typography variant="h4" gutterBottom>
            Pago No Completado
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Hubo un problema con tu pago PSE.
            Por favor, intenta nuevamente.
          </Typography>
          <Button
            component={Link}
            href="/tienda/detalles-envio"
            variant="contained"
            color="primary"
            sx={styles.button}
          >
            Intentar de Nuevo
          </Button>
        </>
      )
    
    default:
      return null
  }
}

const PSEResultado = () => {
  return (
    <Box sx={{ backgroundColor: '#eaeff1', minHeight: '100vh' }}>
      <Container maxWidth="sm" sx={styles.container}>
        <Suspense fallback={<CircularProgress />}>
          <PSEResultadoContent />
        </Suspense>
      </Container>
    </Box>
  )
}

export default withRoot(PSEResultado)

