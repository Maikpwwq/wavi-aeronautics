'use client'
import React from 'react'
import Container from '@mui/material/Container'
import Typography from '@/modules/components/Typography'
import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'

export default function DataDeletion() {
  return (
    <>
      <AppAppBar />
      <Container sx={{ py: 6 }}>
        <Typography variant="h3" gutterBottom marked="center" align="center">
          Eliminación de Datos de Usuario
        </Typography>
        <Typography variant="body1" paragraph>
          Conforme a las políticas de Facebook y otras plataformas, usted tiene derecho a solicitar la eliminación de sus datos personales almacenados en nuestra aplicación.
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Instrucciones para solicitar la eliminación:
        </Typography>
        <Typography variant="body1" component="ol">
          <li>Envíe un correo electrónico a soporte@waviaeronautics.com con el asunto "Solicitud de eliminación de datos".</li>
          <li>Incluya su nombre completo y la dirección de correo electrónico asociada a su cuenta.</li>
          <li>Nuestro equipo procesará su solicitud y eliminará sus datos en un plazo de 30 días.</li>
        </Typography>
      </Container>
      <AppFooter />
    </>
  )
}
