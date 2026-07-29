'use client'
import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@/modules/components/Typography'
import Divider from '@mui/material/Divider'
import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'

export default function TermsOfService() {
  return (
    <>
      <AppAppBar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 6 }, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <Typography variant="h3" gutterBottom marked="center" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Términos y Condiciones del Servicio
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mb: 4 }}>
            Última actualización: {new Date().getFullYear()} — Wavi Aeronautics
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ color: 'text.primary', lineHeight: 1.8 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              1. Aceptación de los Términos
            </Typography>
            <Typography variant="body1" paragraph>
              Al acceder y utilizar el portal web de <strong>Wavi Aeronautics</strong>, el usuario acepta cumplir plenamente con los presentes Términos y Condiciones del Servicio. Si no está de acuerdo con alguna parte de estos términos, le solicitamos abstenerse de realizar compras o navegar en la plataforma.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              2. Catálogo de Productos e Importación Internacional
            </Typography>
            <Typography variant="body1" paragraph>
              Nuestros productos, componentes FPV, precios, disponibilidad y stock están sujetos a actualizaciones periódicas automáticas. Debido a la naturaleza de importación internacional de varios componentes de aeronáutica de alta precisión, los precios calculados en pesos colombianos (COP) incorporan la tasa de cambio y tarifas logísticas vigentes.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              3. Procesamiento de Pagos
            </Typography>
            <Typography variant="body1" paragraph>
              Los pagos realizados en la tienda online son gestionados de forma segura a través del <strong>Mercado Pago SDK</strong> (tarjetas de crédito, débito) y canales electrónicos integrados como <strong>PSE</strong>. El pedido será confirmado una vez la plataforma de pago valide la transacción.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              4. Uso Responsable de Aeronaves No Tripuladas (Drones FPV)
            </Typography>
            <Typography variant="body1" paragraph>
              El comprador y usuario final es el único responsable legal del cumplimiento de las regulaciones aéreas locales (como el RAC 100 de la Aeronáutica Civil en Colombia), respetando zonas de restricción de vuelo (ZNVD), alturas máximas permitidas y normas de seguridad en la operación de drones. Wavi Aeronautics no se hace responsable por el uso inadecuado o no regulado de las aeronaves adquiridas.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              5. Ley Aplicable y Jurisdicción
            </Typography>
            <Typography variant="body1" paragraph>
              Estos términos se rigen e interpretan conforme a las leyes de la República de Colombia.
            </Typography>
          </Box>
        </Paper>
      </Container>
      <AppFooter />
    </>
  )
}
