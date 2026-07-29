'use client'
import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@/modules/components/Typography'
import Divider from '@mui/material/Divider'
import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'

export default function WarrantyPolicy() {
  return (
    <>
      <AppAppBar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 6 }, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <Typography variant="h3" gutterBottom marked="center" align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
            Política de Garantía
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mb: 4 }}>
            Última actualización: {new Date().getFullYear()} — Wavi Aeronautics
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ color: 'text.primary', lineHeight: 1.8 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              1. Cobertura de Garantía
            </Typography>
            <Typography variant="body1" paragraph>
              En <strong>Wavi Aeronautics</strong> respaldamos la calidad de nuestras aeronaves, componentes FPV y equipos de radio control. Nuestros proveedores nos ofrecen una <strong>garantía de 30 días calendario</strong> a partir de la fecha de entrega del producto, la cual extendemos directamente a nuestros clientes.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              2. ¿Qué Cubre la Garantía?
            </Typography>
            <Typography variant="body1" paragraph>
              La garantía cubre exclusivamente:
            </Typography>
            <ul>
              <li>Defectos de fabricación en materiales o ensamblaje de origen.</li>
              <li>Fallas electrónicas preexistentes no provocadas por manipulación.</li>
              <li>Inconformidad o falta de partes incluidas en el empaque original.</li>
            </ul>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              3. Exclusiones de la Garantía
            </Typography>
            <Typography variant="body1" paragraph>
              La garantía <strong>no cubre</strong> daños derivados de:
            </Typography>
            <ul>
              <li>Colisiones, impactos, caídas o accidentes durante el vuelo de los drones FPV.</li>
              <li>Mala manipulación, modificaciones no autorizadas, soldaduras deficientes realizadas por el usuario o sobrevoltaje.</li>
              <li>Uso o almacenamiento inadecuado de baterías LiPo (descarga profunda, cortocircuito o sobrecarga).</li>
              <li>Exposición a agua, humedad o factores ambientales adversos no especificados para el equipo.</li>
            </ul>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3, mb: 1 }}>
              4. Procedimiento para Solicitar Garantía
            </Typography>
            <Typography variant="body1" paragraph>
              Para iniciar una reclamación de garantía, el cliente debe ponerse en contacto con nuestro equipo de soporte técnico dentro del plazo de 30 días, adjuntando fotografías o videos donde se evidencia la falla reportada y el número de factura/orden.
            </Typography>
          </Box>
        </Paper>
      </Container>
      <AppFooter />
    </>
  )
}
