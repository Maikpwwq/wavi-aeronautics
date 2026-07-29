'use client'
import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@/modules/components/Typography'
import Divider from '@mui/material/Divider'
import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'

export default function ReturnPolicy() {
  return (
    <>
      <AppAppBar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 6 }, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <Typography variant="h3" gutterBottom marked="center" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Política de Devoluciones
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mb: 4 }}>
            Última actualización: {new Date().getFullYear()} — Wavi Aeronautics
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ color: 'text.primary', lineHeight: 1.8 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              1. Plazo de Devolución (Derecho de Retracto)
            </Typography>
            <Typography variant="body1" paragraph>
              En caso de que el cliente decida no conservar el producto recibido por razones no asociadas a falla de garantía, podrá solicitar la devolución del mismo en un período <strong>no mayor a 5 días hábiles</strong> posteriores a la fecha de entrega del paquete.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              2. Requisitos del Producto
            </Typography>
            <Typography variant="body1" paragraph>
              Para que la devolución sea aceptada, el producto devuelto debe cumplir con las siguientes condiciones indispensables:
            </Typography>
            <ul>
              <li>Estar totalmente nuevo, sin señales de uso, vuelo ni montaje.</li>
              <li>Conservar sus empaques originales, sellos, protectores de cámara, manuales, hélices y accesorios completos.</li>
              <li>No haber sido modificado, soldado ni manipulado en su firma electrónica o software interno.</li>
            </ul>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              3. Costos de Envío de la Devolución
            </Typography>
            <Typography variant="body1" paragraph>
              Dado que los equipos incorporan logística de importación, en caso de ejercer el derecho de retracto, el comprador deberá asumir el costo del envío de retorno hacia la sede correspondiente. Este valor varía según el volumen y peso del producto devuelto.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              4. Proceso de Inspección
            </Typography>
            <Typography variant="body1" paragraph>
              Una vez recibido el paquete en nuestras instalaciones, nuestro equipo técnico realizará la verificación del estado físico y funcional. Tras validar el cumplimiento de los requisitos, se procederá a autorizar el reembolso o cambio correspondiente.
            </Typography>
          </Box>
        </Paper>
      </Container>
      <AppFooter />
    </>
  )
}
