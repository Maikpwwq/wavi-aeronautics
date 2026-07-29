import React from 'react'
import Link from 'next/link'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@/modules/components/Typography'
import SecurityIcon from '@mui/icons-material/Security'

const styles = (theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  title: {
    paddingBottom: theme.spacing(4)
  }
})

const ShopConditions = () => {
  const classes = styles(theme)

  return (
    <Box maxWidth="md" sx={classes.container}>
      <Typography variant="h4" sx={classes.title} marked="center">
        Condiciones de la Compra
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', color: 'text.secondary' }}>
        « Envío Internacional. Productos, precios, stock y tiempos de entrega sujetos a cambios, como resultado de la actualización automática realizada diariamente. »
      </Typography>

      <Grid container spacing={3} sx={{ textAlign: 'left', my: 2 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#00aCe4' }}>
            Garantía Oficial de 30 Días
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nuestros proveedores ofrecen garantía de 30 días extendida a nuestros clientes, cubriendo defectos de fábrica.{' '}
            <Link href="/politica-de-garantia" style={{ color: '#00aCe4', fontWeight: 'bold' }}>
              Ver Política de Garantía →
            </Link>
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#00aCe4' }}>
            Derecho de Devolución
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Devoluciones permitidas dentro de los 5 días posteriores a la entrega del paquete.{' '}
            <Link href="/politica-de-devoluciones" style={{ color: '#00aCe4', fontWeight: 'bold' }}>
              Ver Política de Devoluciones →
            </Link>
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#00aCe4' }}>
            Tiempos de Envío
          </Typography>
          <Typography variant="body2" color="text.secondary">
            De 10 a 15 días hábiles a ciudades principales en Colombia con envío gratis.{' '}
            <Link href="/politica-de-envios" style={{ color: '#00aCe4', fontWeight: 'bold' }}>
              Ver Política de Envíos →
            </Link>
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#00aCe4' }}>
            Pagos Seguros con Mercado Pago
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Transacciones encriptadas procesadas mediante Mercado Pago SDK y PSE.{' '}
            <Link href="/politica-de-reembolso" style={{ color: '#00aCe4', fontWeight: 'bold' }}>
              Ver Política de Reembolso →
            </Link>
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, pt: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.85rem' }}>
        <SecurityIcon color="primary" fontSize="small" />
        <span>Pagos 100% seguros y respaldados por Mercado Pago & PSE.</span>
      </Box>
    </Box>
  )
}

export default withRoot(ShopConditions)
