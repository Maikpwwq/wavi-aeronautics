'use client'
import React from 'react'
import Container from '@mui/material/Container'
import Typography from '@/modules/components/Typography'
import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'

export default function PrivacyPolicy() {
  return (
    <>
      <AppAppBar />
      <Container sx={{ py: 6 }}>
        <Typography variant="h3" gutterBottom marked="center" align="center">
          Política de Privacidad
        </Typography>
        <Typography variant="body1" paragraph>
          [Aquí va el contenido de la Política de Privacidad de Wavi Aeronautics.]
        </Typography>
        <Typography variant="body1" paragraph>
          Esta página describe cómo recopilamos, usamos y protegemos su información personal.
        </Typography>
      </Container>
      <AppFooter />
    </>
  )
}
