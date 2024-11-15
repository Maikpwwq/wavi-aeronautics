import React, { useState } from 'react'
import Image from 'next/image'
// import PropTypes from 'prop-types'
import { getSubscribe } from '@/services/sharedServices'
// import FirebaseSubscribe from "@/services/FirebaseSubscribe.jsx";
import withRoot from '@/modules/withRoot'
import theme from '@/modules/theme'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid2'
import Typography from '../components/Typography'
import TextField from '../components/TextField'
import Snackbar from '../components/Snackbar'
import Button from '../components/Button'

import productCTAImageDots from 'public/static/themes/productCTAImageDots.png'
const PostalOfertas = '/static/img/Toma-Aerea-Ciudad.png'
// const PostalOfertas =
//     "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FToma-Aerea-Ciudad.png?alt=media&token=d16460b1-8e78-4f85-977f-afff44385b09";

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(10),
    marginBottom: 0,
    display: 'flex'
  },
  cardWrapper: {
    zIndex: 1
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme.palette.warning.main,
    padding: theme.spacing(8, 3)
  },
  textField: {
    width: '100%',
    margin: `${theme.spacing(3)} 0 ${theme.spacing(2)} 0 !important`,
    backgroundColor: theme.palette.common.white
  },
  button: {
    width: '100%',
    margin: `${theme.spacing(1, 0)} !important`,
    padding: `${theme.spacing(2, 0)} !important`
  },
  imagesWrapper: {
    position: 'relative'
  },
  imageDots: {
    position: 'absolute',
    top: -67,
    left: -67,
    right: 0,
    bottom: 0,
    width: '100%',
    background: `url(${productCTAImageDots})`
  },
  image: {
    position: 'absolute',
    top: -28,
    left: -28,
    right: 0,
    bottom: 0,
    width: '100%',
    maxWidth: 600,
    maxHeight: 400
  }
})

const Form = styled('form')({
  maxWidth: 400
})

function ProductCTA (props) {
  // const { classes } = props;
  const classes = styles(theme)
  const [open, setOpen] = useState(false)
  const [suscribeMail, setSuscribeMail] = useState({
    correo: ''
  })

  const handleSubmit = () => {
    // e.preventDefault();
    if (suscribeMail.correo) {
      console.log('subscribeMail', suscribeMail.correo)
      const subscription = getSubscribe(suscribeMail)
      // if (suscribeMail.correo !== "") {
      subscription.subscribe((response) => {
        console.log('subscribeObservable', response)
        // FirebaseSubscribe(suscribeMail.correo);
        setOpen(true) // open snackbar
        // });
        setSuscribeMail(null)
      })
    }
    // };
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Container sx={classes.root} component="section">
      <Grid container sx={{ width: '100%' }}>
        <Grid item sx={classes.cardWrapper} size={{ xs: 12, md: 6, lg: 5 }}>
          <Box sx={classes.card}>
            {/* onSubmit={handleSubmit} */}
            <Form sx={classes.cardContent}>
              <Typography variant="h2" component="h2" gutterBottom>
                Recibe nuestras ofertas
              </Typography>
              <Typography variant="h5">
                Descubre nuestras actualizaciones primero.
              </Typography>
              <TextField
                noBorder
                sx={classes.textField}
                // value={suscribeMail.correo}
                placeholder="Tu email"
                onChange={(e) => setSuscribeMail({ correo: e.target.value })}
              />
              <Button
                // type="submit"
                color="primary"
                variant="contained"
                sx={classes.button}
                onClick={handleSubmit}
              >
                Suscribirme!
              </Button>
            </Form>
          </Box>
        </Grid>
        <Grid item sx={classes.imagesWrapper} size={{ xs: 12, md: 6, lg: 7 }}>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={classes.imageDots} />
            <Image
              src={PostalOfertas}
              alt="Tomas aéreas rápidas y confiables"
              style={classes.image}
              width={500}
              height={360}
            />
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        onClose={handleClose}
        message="Te enviaremos nuestras mejores ofertas, una vez por mes."
      />
    </Container>
  )
}

ProductCTA.propTypes = {
  // classes: PropTypes.object.isRequired,
}

export default withRoot(ProductCTA)
