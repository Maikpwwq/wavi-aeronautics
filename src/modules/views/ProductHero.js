'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import withRoot from '@/modules/withRoot'
import theme from '@/modules/theme'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ProductHeroLayout from './ProductHeroLayout'

const MavicAir = '/static/img/Portada-DJI-Mavic-Air-2.png'

const styles = (theme) => ({
  background: {
    backgroundImage: 'url("/static/img/Portada-DJI-Mavic-Air-2.png")',
    backgroundColor: '#7fc7d9',
    backgroundPosition: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    zIndex: -2
  }
})

function ProductHero() {
  const classes = styles(theme)
  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <Image
        style={{ display: 'none' }}
        src={MavicAir}
        alt="increase priority"
        width={1300}
        height={650}
      />

      {/* Badge Chip */}
      <Chip
        icon={
          <FlightTakeoffIcon
            sx={{
              fontSize: '15px !important',
              color: 'rgba(255,255,255,0.9) !important',
            }}
          />
        }
        label="TIENDA OFICIAL DE TECNOLOGÍA AÉREA"
        size="small"
        sx={{
          mb: 2.5,
          fontWeight: 700,
          fontSize: '0.72rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          color: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(8px)',
          px: 1,
        }}
      />

      {/* Title */}
      <Typography
        variant="h2"
        component="h1"
        align="center"
        sx={{
          color: '#ffffff',
          fontWeight: 800,
          fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
          letterSpacing: '-0.02em',
          textTransform: 'none',
          mb: 1,
          textShadow: '0 2px 16px rgba(0,0,0,0.3)',
        }}
      >
        Encuentra tu Dron
      </Typography>

      {/* Accent bar */}
      <div
        style={{
          width: 60,
          height: 4,
          backgroundColor: '#00aCe4',
          borderRadius: 2,
          margin: '0 auto 20px',
        }}
      />

      {/* Subtitle */}
      <Typography
        variant="h5"
        component="p"
        align="center"
        sx={{
          color: 'rgba(255, 255, 255, 0.88)',
          fontWeight: 400,
          fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.2rem' },
          lineHeight: 1.7,
          maxWidth: 560,
          mx: 'auto',
          mb: { xs: 3, sm: 4 },
          textShadow: '0 1px 8px rgba(0,0,0,0.25)',
        }}
      >
        Tienda de drones, equipos FPV y tecnología VToL.
        <br />
        Todo lo que necesitas para tus proyectos.
      </Typography>

      {/* CTA Button */}
      <Button
        component={Link}
        href="/tienda/"
        variant="contained"
        size="large"
        endIcon={<ArrowForwardIcon />}
        sx={{
          minWidth: 220,
          py: 1.5,
          px: 4,
          borderRadius: 2.5,
          fontWeight: 700,
          fontSize: '0.95rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          bgcolor: '#00aCe4',
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(0, 172, 228, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: '#0090c0',
            boxShadow: '0 6px 28px rgba(0, 172, 228, 0.5)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        Ver Equipos
      </Button>

      {/* Tagline */}
      <Typography
        variant="body2"
        align="center"
        sx={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.82rem',
          fontWeight: 500,
          letterSpacing: '0.04em',
          mt: 3,
        }}
      >
        Tecnología aérea, drones y accesorios
      </Typography>
    </ProductHeroLayout>
  )
}

ProductHero.propTypes = {}

export default withRoot(ProductHero)
