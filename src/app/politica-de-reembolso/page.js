'use client'
import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@/modules/components/Typography'
import Divider from '@mui/material/Divider'
import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'

export default function RefundPolicy() {
  return (
    <>
      <AppAppBar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 6 }, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <Typography variant="h3" gutterBottom marked="center" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Política de Reembolso
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mb: 4 }}>
            Última actualización: {new Date().getFullYear()} — Wavi Aeronautics
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ color: 'text.primary', lineHeight: 1.8 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              1. Condiciones para la Solicitud de Reembolso
            </Typography>
            <Typography variant="body1" paragraph>
              En <strong>Wavi Aeronautics</strong> gestionamos los reembolsos de dinero en los siguientes escenarios:
            </Typography>
            <ul>
              <li>Cancelación del pedido solicitada antes de que el paquete sea despachado desde el origen.</li>
              <li>Devolución de producto aprobada dentro de los plazos y condiciones establecidos.</li>
              <li>Imposibilidad logística o falta de stock comprobada para efectuar la entrega del equipo adquirido.</li>
            </ul>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              2. Método de Procesamiento y Reembolso (Mercado Pago)
            </Typography>
            <Typography variant="body1" paragraph>
              Todos los desembolsos y devoluciones de dinero se realizan a través de la infraestructura segura de <strong>Mercado Pago</strong> utilizando el mismo medio de pago empleado en la compra original:
            </Typography>
            <ul>
              <li><strong>Pagos con Tarjeta de Crédito:</strong> El reembolso se acredita directamente en el extracto de la tarjeta. El tiempo de reflejo depende de la entidad bancaria emisora (normalmente de 5 a 15 días hábiles).</li>
              <li><strong>Pagos vía PSE / Débito Bancario:</strong> El saldo se abonará a la cuenta de Mercado Pago vinculada al correo del comprador o mediante reembolso directo a la cuenta bancaria de origen según los tiempos del sistema bancario nacional.</li>
            </ul>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              3. Tiempos de Procesamiento
            </Typography>
            <Typography variant="body1" paragraph>
              Una vez aprobada la solicitud de reembolso por parte del equipo contable de Wavi Aeronautics, la orden de reintegro se emite en un plazo máximo de 3 a 5 días hábiles.
            </Typography>
          </Box>
        </Paper>
      </Container>
      <AppFooter />
    </>
  )
}
