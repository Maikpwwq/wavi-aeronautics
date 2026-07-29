'use client'
import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@/modules/components/Typography'
import Divider from '@mui/material/Divider'
import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'

export default function ShippingPolicy() {
  return (
    <>
      <AppAppBar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 6 }, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <Typography variant="h3" gutterBottom marked="center" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Política de Envíos
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mb: 4 }}>
            Última actualización: {new Date().getFullYear()} — Wavi Aeronautics
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ color: 'text.primary', lineHeight: 1.8 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              1. Cobertura de Envíos
            </Typography>
            <Typography variant="body1" paragraph>
              En <strong>Wavi Aeronautics</strong> ofrecemos <strong>Envíos Gratis a toda Colombia</strong> en la mayoría de nuestras líneas de productos, componentes FPV y equipos de aeronáutica.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              2. Tiempos de Entrega Estimados
            </Typography>
            <Typography variant="body1" paragraph>
              Debido al origen de importación especializada de algunos componentes y al control logístico de aduanas, los tiempos de entrega promedio son:
            </Typography>
            <ul>
              <li><strong>Ciudades Principales en Colombia:</strong> De 10 a 15 días hábiles a partir de la confirmación del pago.</li>
              <li><strong>Otras Municipios y Zonas Especiales:</strong> De 12 a 18 días hábiles según la cobertura de las transportadoras nacionales.</li>
            </ul>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              3. Seguimiento del Pedido
            </Typography>
            <Typography variant="body1" paragraph>
              Una vez procesada la orden y asignada la guía de transporte, el cliente recibirá una notificación con el número de seguimiento para monitorear el estado de su envío en tiempo real.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              4. Eventualidades y Fuerza Mayor
            </Typography>
            <Typography variant="body1" paragraph>
              Los tiempos de entrega pueden verse afectados por trámites aduaneros extraordinarios, condiciones climáticas o eventos de fuerza mayor ajenos al control directo de Wavi Aeronautics. En dichos casos, mantendremos informado al comprador oportunamente.
            </Typography>
          </Box>
        </Paper>
      </Container>
      <AppFooter />
    </>
  )
}
