import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
// import PropTypes from 'prop-types'
import withRoot from '../withRoot'
import theme from '../theme'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid2'
import Container from '@mui/material/Container'
import Button from '../components/Button'
import Typography from '../components/Typography'
import productCurvyLines from 'public/static/themes/productCurvyLines.png'
import productHowItWorks1 from 'public/static/themes/productHowItWorks1.svg'
import productHowItWorks2 from 'public/static/themes/productHowItWorks2.svg'
import productHowItWorks3 from 'public/static/themes/productHowItWorks3.svg'

const styles = (theme) => ({
  root: {
    display: 'flex',
    backgroundColor: theme.palette.secondary.light,
    overflow: 'hidden'
  },
  container: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(15),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5)
  },
  title: {
    paddingBottom: theme.spacing(8)
  },
  number: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium
  },
  image: {
    height: 70,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  curvyLines: {
    pointerEvents: 'none',
    position: 'absolute',
    top: -180,
    opacity: 0.7
  },
  beneficios: {
    marginBottom: `${theme.spacing(8)} !important`
  },
  button: {
    minWidth: 200
  }
})

function ProductHowItWorks (props) {
  // const { classes } = props;
  const classes = styles(theme)

  return (
    <Box sx={classes.root}>
      <Container sx={classes.container} style={{ textAlign: 'center' }}>
        <Image
          src={productCurvyLines}
          style={classes.curvyLines}
          alt="curvy lines"
          // style={{ position: "absolute" }}
          // width={100}
          // height={100}
          priority
        />
        <Typography
          variant="h4"
          marked="center"
          sx={classes.title}
          component="h2"
        >
          Te ofrecemos
        </Typography>
        <Box sx={classes.beneficios}>
          <Grid container spacing={5}>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Box sx={classes.item}>
                <Box sx={classes.number}>1.</Box>
                <Image
                  src={productHowItWorks1}
                  alt="tendencias"
                  style={classes.image}
                  width={100}
                  height={100}
                  priority
                />
                <Typography variant="h5" align="center">
                  {'Actualizaciones de las últimas tendencias del mercado.'}
                </Typography>
              </Box>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Box sx={classes.item}>
                <Box sx={classes.number}>2.</Box>
                <Image
                  src={productHowItWorks2}
                  alt="actividades"
                  style={classes.image}
                  width={100}
                  height={100}
                  priority
                />
                <Typography variant="h5" align="center">
                  {
                    'Mejorar el tiempo que inviertes en realizar tus actividades.'
                  }
                </Typography>
              </Box>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <Box sx={classes.item}>
                <Box sx={classes.number}>3.</Box>
                <Image
                  src={productHowItWorks3}
                  alt="equipos"
                  style={classes.image}
                  width={100}
                  height={100}
                  priority
                />
                <Typography variant="h5" align="center">
                  {
                    'Mantenimiento técnico preventivo y correctivo para tus equipos.'
                  }
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Button
          color="secondary"
          size="large"
          variant="contained"
          className="navlink"
          sx={classes.button}
        >
          <Link href="auth/sign-up/">{'Comenzar'}</Link>
        </Button>
      </Container>
    </Box>
  )
}

ProductHowItWorks.propTypes = {
  // classes: PropTypes.object.isRequired,
}

export default withRoot(ProductHowItWorks)
