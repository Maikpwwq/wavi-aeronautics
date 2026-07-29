'use client'
import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@/modules/components/Typography'
import Divider from '@mui/material/Divider'
import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'

export default function PrivacyPolicy() {
  return (
    <>
      <AppAppBar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 6 }, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <Typography variant="h3" gutterBottom marked="center" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Política de Privacidad
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mb: 4 }}>
            Última actualización: {new Date().getFullYear()} — Wavi Aeronautics
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ color: 'text.primary', lineHeight: 1.8 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              1. Identificación del Responsable del Tratamiento
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Wavi Aeronautics</strong> informa a los usuarios del sitio web sobre su política respecto del tratamiento y protección de los datos personales de los usuarios y clientes que puedan ser recabados por la navegación o contratación de servicios a través de su portal.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              2. Datos Recopilados y Finalidad
            </Typography>
            <Typography variant="body1" paragraph>
              Recopilamos información personal necesaria para procesar sus pedidos de drones, accesorios y componentes FPV, así como para gestionar la facturación y el envío de productos. Los datos recabados incluyen:
            </Typography>
            <ul>
              <li>Nombre completo y datos de identificación.</li>
              <li>Dirección de correo electrónico y teléfono de contacto.</li>
              <li>Dirección física para la entrega e importación de los equipos.</li>
              <li>Información de pago procesada de forma encriptada y segura a través de <strong>Mercado Pago SDK</strong> y pasarelas autorizadas (PSE).</li>
            </ul>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              3. Procesamiento Seguro de Pagos
            </Typography>
            <Typography variant="body1" paragraph>
              Wavi Aeronautics <strong>no almacena</strong> números de tarjetas de crédito ni credenciales bancarias en sus servidores. Todas las transacciones financieras son procesadas mediante la infraestructura certificada de <strong>Mercado Pago</strong> y pasarelas bancarias asociadas con estándares internacionales de encriptación (PCI-DSS).
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              4. Protección y Derechos del Usuario (Habeas Data)
            </Typography>
            <Typography variant="body1" paragraph>
              El usuario puede ejercer sus derechos de acceso, rectificación, cancelación y oposición (ARCO) sobre sus datos personales enviando una solicitud a través de nuestros canales de atención oficiales o mediante nuestro formulario de eliminación de datos de usuario.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              5. Modificaciones a la Política
            </Typography>
            <Typography variant="body1" paragraph>
              Wavi Aeronautics se reserva el derecho a modificar la presente política para adaptarla a novedades legislativas o jurisprudenciales.
            </Typography>
          </Box>
        </Paper>
      </Container>
      <AppFooter />
    </>
  )
}
