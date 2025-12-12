'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import withRoot from '@/modules/withRoot'
import Typography from '@/modules/components/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Button from '@mui/material/Button'
import Link from 'next/link'

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

const PagoExitoso = () => {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id')
  const externalReference = searchParams.get('external_reference')

  return (
    <Box sx={{ backgroundColor: '#eaeff1', minHeight: '100vh' }}>
      <Container maxWidth="sm" sx={styles.container}>
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
        <Button
          component={Link}
          href="/tienda"
          variant="contained"
          color="primary"
          sx={styles.button}
        >
          Volver a la Tienda
        </Button>
      </Container>
    </Box>
  )
}

export default withRoot(PagoExitoso)
