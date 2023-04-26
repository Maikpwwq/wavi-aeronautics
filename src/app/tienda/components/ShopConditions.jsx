import React from 'react'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'
// import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@/modules/components/Typography'

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
    paddingBottom: theme.spacing(8)
  }
})

const ShopConditions = (props) => {
  // const { classes } = props;
  const classes = styles(theme)
  return (
    <>
      <Box maxWidth="md" sx={classes.container}>
        <br />
        <br />
        <Typography variant="h4" sx={classes.title} marked="center">
          Condiciones de la compra. </Typography>
        <br />
        <br />
        <Typography variant="body1" marked="center" gutterBottom>
          « Envío Internacional. Productos, precios, stock y tiempos de entrega
          sujetos a cambios, como resultado de la actualización automática
          realizada diariamente.»<br></br>
          <br></br>
          Nuestros proveedores nos ofrecen una garantía de 30 días la cual
          extendemos a nuestros clientes, esta cubre daños por defectos del
          material o errores en la fabricación. No cubre mala manipulación por
          parte del usuario.<br></br>
          <br></br>
          En caso de que ya no desee el producto recibido, puede realizar la
          devolución del mismo en un periodo no mayor a 5 días, a partir de su
          entrega. Para ello, deberá pagar el costo del retorno hacia USA. Este
          varia de acuerdo al tamaño y peso del producto.<br></br>
          <br></br>
          ------------------------------------------------------------------
          <br></br>
          ---------------------- TIEMPOS DE ENVIÓ --------------------------
          <br></br>
          ----------------------- DE 10 A 15 DÍAS --------------------------
          <br></br>
          -------------------- A CIUDADES PRINCIPALES ----------------------
          <br></br>
          ------------------------------------------------------------------
        </Typography>
      </Box>
    </>
  )
}

export default withRoot(ShopConditions)
