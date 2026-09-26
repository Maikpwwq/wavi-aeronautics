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
              2. Modalidades de Entrega
            </Typography>
            <Typography variant="body1" paragraph>
              En Wavi Aeronautics operamos con dos modalidades de entrega diseñadas para cubrir tanto la urgencia del piloto como la exclusividad del hardware especializado:
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1, fontSize: '1rem' }}>
              2.1 Repuestos Express (24 a 72 horas hábiles)
            </Typography>
            <Typography variant="body1" paragraph>
              Consumibles de alta rotación disponibles en <strong>stock local</strong>: hélices, receptores ELRS, baterías LiPo y antenas VTX. Estos son los componentes que todo piloto FPV necesita con urgencia después de un impacto. Despacho inmediato una vez confirmado el pago.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1, fontSize: '1rem' }}>
              2.2 Importación Curada Premium (15 a 21 días hábiles)
            </Typography>
            <Typography variant="body1" paragraph>
              Equipos de alto valor (drones completos, goggles, radios, frames, stacks, motores y sistemas VTX digitales) se gestionan mediante nuestro servicio de importación curada. Este servicio incluye:
            </Typography>
            <ul>
              <li><strong>Gestión aduanera integral:</strong> Nos encargamos de todos los trámites ante la DIAN.</li>
              <li><strong>Verificación de compatibilidad:</strong> Cada equipo es revisado antes del despacho.</li>
              <li><strong>Cumplimiento normativo:</strong> Orientación sobre la regulación RAC 100 de la Aerocivil aplicable a su equipo.</li>
              <li><strong>Riesgo aduanero asumido:</strong> Wavi Aeronautics asume la responsabilidad logística de la importación.</li>
            </ul>
            <Typography variant="body1" paragraph>
              El hardware pesado se importa por encargo con servicio de guante blanco. El consumible se entrega hoy.
            </Typography>

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
