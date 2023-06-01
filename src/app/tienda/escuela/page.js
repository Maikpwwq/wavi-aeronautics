'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
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
          Clases de vuelo de Drones.
        </Typography>
        <Typography variant="body1">
          ¡Aprende a volar como un experto piloto de drones, conoce todo sobre
          el mundo del FPV!. <br />
          <br />
        </Typography>
        <Link
          href="https://api.whatsapp.com/send?phone=573196138057"
          target="_blank"
          rel="noopener noreferrer"
          style={classes.lisenceLink}
        >
          Programa una clase ahora. {' '}
          <WhatsAppIcon
            fontSize="large"
            alt="WhatsAppChat"
            style={{ color: '#9c27b0' }}
          />
        </Link>
      </Box>
    </>
  )
}

export default withRoot(Accesorios)
