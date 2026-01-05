'use client'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import withRoot from '@/modules/withRoot'
import Typography from '@/modules/components/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
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
    marginBottom: 20,
    color: '#4caf50'
  },
  button: {
    marginTop: 30
  }
}


const PagoExitosoContent = () => {
  const searchParams = useSearchParams()
  const { shoppingCart, removeFromCart } = useContext(ShowCartContext)
  const [orderCreated, setOrderCreated] = useState(false)
  
  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id')
  const externalReference = searchParams.get('external_reference')
  const status = searchParams.get('status')

  useEffect(() => {
    const processOrder = async () => {
      // Create order if payment is approved and not already created
      if (status === 'approved' && !orderCreated && shoppingCart.productos.length > 0) {
        try {
          const user = auth.currentUser
          const orderData = {
            userId: user?.uid || 'guest',
            userEmail: user?.email || searchParams.get('payer_email') || 'guest@example.com',
            userName: user?.displayName || searchParams.get('payer_name') || 'Invitado',
            paymentId: paymentId,
            externalReference: externalReference,
            items: shoppingCart.productos.map(p => ({
              name: p.titulo,
              quantity: p.cantidad || 1,
              price: parseFloat(p.precio?.toString().replace(/[^0-9.-]+/g,"") || 0)
            })),
            total: shoppingCart.suma,
            status: 'processing',
            paymentMethod: 'card'
          }
          
          await createOrder(orderData)
          setOrderCreated(true)
          
          // Clear cart
          shoppingCart.productos.forEach(p => removeFromCart(p.productID))
        } catch (error) {
          console.error("Failed to create order after success:", error)
        }
      }
    }

    processOrder()
  }, [status, shoppingCart, removeFromCart, orderCreated, paymentId, externalReference])

  return (
    <>
      <CheckCircleIcon sx={styles.icon} />
      <Typography variant="h4" gutterBottom>
        ¡Pago Exitoso!
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Tu pago ha sido procesado correctamente.
        Pronto recibirás un correo de confirmación.
      </Typography>
      {paymentId && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          ID de Pago: {paymentId}
        </Typography>
      )}
      {externalReference && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Referencia: {externalReference}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button
            component={Link}
            href="/orders"
            variant="outlined"
            color="primary"
        >
            Ver mis pedidos
        </Button>
        <Button
            component={Link}
            href="/tienda"
            variant="contained"
            color="primary"
        >
            Volver a la Tienda
        </Button>
      </Box>
    </>
  )
}

const PagoExitoso = () => {
  return (
    <Box sx={{ backgroundColor: '#eaeff1', minHeight: '100vh' }}>
      <Container maxWidth="sm" sx={styles.container}>
        <Suspense fallback={<CircularProgress />}>
          <PagoExitosoContent />
        </Suspense>
      </Container>
    </Box>
  )
}

export default withRoot(PagoExitoso)

