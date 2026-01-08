'use client'
import React from 'react'
import Container from '@mui/material/Container'
import Typography from '@/modules/components/Typography'
import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'

export default function TermsOfService() {
  return (
    <>
      <AppAppBar />
      <Container sx={{ py: 6 }}>
        <Typography variant="h3" gutterBottom marked="center" align="center">
          Condiciones del Servicio
        </Typography>
        <Typography variant="body1" paragraph>
          [Aquí van los términos y condiciones del servicio de Wavi Aeronautics.]
        </Typography>
        <Typography variant="body1" paragraph>
          Al utilizar nuestro sitio web, usted acepta cumplir con estos términos.
        </Typography>
      </Container>
      <AppFooter />
    </>
  )
}
