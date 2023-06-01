'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@/modules/components/Typography'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'

const styles = (theme) => ({
  presentationProducts: {
    margin: `${theme.spacing(2)} ${theme.spacing(0)} !important`,
    padding: `${theme.spacing(0)} ${theme.spacing(2)} !important`,
    display: 'flex',
    flexDirection: 'column'
  },
  lisenceLink: {
    color: theme.palette.secondary.main,
    padding: `${theme.spacing(2)} ${theme.spacing(0)} !important`
  }
})

const Accesorios = (props) => {
  // const { classes } = props;
  const classes = styles(theme)
  useEffect(() => {}, [])

  return (
    <>
      <Box sx={classes.presentationProducts}>
        <Typography
          variant="h4"
          gutterBottom
          marked="center"
          align="center"
          className="pb-4 mb-4"
        >
          Simulador para vuelo de Drones.
        </Typography>
        <Typography variant="body1">
          ¡Vive la acción de participar como piloto en carreras de drones FPV,{' '}
          <br />
          vuela a grandes velocidades, incluye modos multijugador y fuera de
          línea!.
          <br />
          <br />
          Se precavido con tus dispositivos y tu inversión, realiza pruebas en
          un ambiente seguro.
        </Typography>
        <Link
          href="https://www.velocidrone.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={classes.lisenceLink}
        >
          Adquiere una licencia Velocidrone!
        </Link>
        <Typography
          variant="h4"
          gutterBottom
          marked="center"
          align="center"
          className="pb-4 mb-4"
        >
          Mapeo Digital
        </Typography>
        <Typography variant="body1">
          {' '}
          Software para mapeo por fotogrametría y modelado digital.
        </Typography>
        <Link
          href="https://www.pix4d.com/es"
          target="_blank"
          rel="noopener noreferrer"
          style={classes.lisenceLink}
        >
          Adquiere una licencia Pix4D!
        </Link>
      </Box>
    </>
  )
}

export default withRoot(Accesorios)
