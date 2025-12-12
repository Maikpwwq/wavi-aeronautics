'use client'
import React from 'react'
import withRoot from '@/modules/withRoot'
import Typography from '@/modules/components/Typography'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import ErrorIcon from '@mui/icons-material/Error'
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
    color: '#f44336'
  },
  button: {
    marginTop: 30
  }
}

const PagoFallido = () => {
  return (
    <Box sx={{ backgroundColor: '#eaeff1', minHeight: '100vh' }}>
      <Container maxWidth="sm" sx={styles.container}>
        <ErrorIcon sx={styles.icon} />
        <Typography variant="h4" gutterBottom>
          Pago No Completado
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Hubo un problema al procesar tu pago.
          Por favor, verifica tus datos e intenta nuevamente.
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
      </Container>
    </Box>
  )
}

export default withRoot(PagoFallido)
