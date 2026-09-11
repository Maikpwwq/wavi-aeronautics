'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { getSubscribe } from '@/services/sharedServices'
import withRoot from '@/modules/withRoot'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Snackbar from '@/modules/components/Snackbar'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import SendIcon from '@mui/icons-material/Send'

import productCTAImageDots from 'public/static/themes/productCTAImageDots.png'
const PostalOfertas = '/static/img/Toma-Aerea-Ciudad.png'

function ProductCTA() {
  const [open, setOpen] = useState(false)
  const [suscribeMail, setSuscribeMail] = useState({
    correo: ''
  })

  const handleSubmit = () => {
    if (suscribeMail.correo) {
      console.log('subscribeMail', suscribeMail.correo)
      const subscription = getSubscribe(suscribeMail)
      subscription.subscribe((response) => {
        console.log('subscribeObservable', response)
        setOpen(true)
        setSuscribeMail({ correo: '' })
      })
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box
      component="section"
      aria-label="Suscripción a ofertas"
      sx={{
        py: { xs: 6, sm: 8, md: 10 },
        position: 'relative',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 30%, #f1f5f9 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative ambient glow */}
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          top: '20%',
          right: '-5%',
          width: '500px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(0, 172, 228, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} sx={{ alignItems: 'center' }}>
          {/* Form Column */}
          <Grid size={{ xs: 12, md: 6, lg: 5 }} sx={{ position: 'relative', zIndex: 2 }}>
            <Box
              sx={{
                bgcolor: '#0f172a',
                borderRadius: 4,
                p: { xs: 4, sm: 5 },
                position: 'relative',
                zIndex: 2,
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              }}
            >
              {/* Card inner glow */}
              <Box
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(0, 172, 228, 0.15) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />

              <Chip
                icon={
                  <NotificationsActiveIcon
                    sx={{
                      fontSize: '15px !important',
                      color: '#00aCe4 !important',
                    }}
                  />
                }
                label="NEWSLETTER EXCLUSIVO"
                size="small"
                sx={{
                  mb: 2.5,
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  backgroundColor: 'rgba(0, 172, 228, 0.12)',
                  color: '#38bdf8',
                  border: '1px solid rgba(0, 172, 228, 0.3)',
                  px: 1,
                }}
              />

              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  mb: 1.5,
                  textTransform: 'none',
                  lineHeight: 1.2,
                }}
              >
                Recibe Nuestras Ofertas
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#94a3b8',
                  fontSize: { xs: '0.92rem', sm: '1rem' },
                  lineHeight: 1.6,
                  mb: 3.5,
                  maxWidth: 380,
                }}
              >
                Descubre nuestras actualizaciones, lanzamientos y descuentos exclusivos primero.
              </Typography>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="Tu email"
                value={suscribeMail?.correo || ''}
                onChange={(e) => setSuscribeMail({ correo: e.target.value })}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: 2.5,
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 172, 228, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00aCe4',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#64748b',
                    opacity: 1,
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
                onClick={handleSubmit}
                sx={{
                  py: 1.5,
                  borderRadius: 2.5,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  bgcolor: '#00aCe4',
                  color: '#ffffff',
                  boxShadow: '0 4px 16px rgba(0, 172, 228, 0.35)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#0090c0',
                    boxShadow: '0 6px 24px rgba(0, 172, 228, 0.5)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Suscribirme
              </Button>
            </Box>
          </Grid>

          {/* Image Column */}
          <Grid size={{ xs: 12, md: 6, lg: 7 }} sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative' }}>
              <Box
                aria-hidden="true"
                sx={{
                  position: 'absolute',
                  top: -24,
                  right: -24,
                  width: '100%',
                  height: '100%',
                  maxWidth: 580,
                  maxHeight: 380,
                  background: `url(${productCTAImageDots.src || productCTAImageDots})`,
                  mixBlendMode: 'multiply',
                  opacity: 0.6,
                  borderRadius: 4,
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />
              <Image
                src={PostalOfertas}
                alt="Tomas aéreas rápidas y confiables"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: '100%',
                  maxWidth: 600,
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 16,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                }}
                width={600}
                height={400}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={open}
        onClose={handleClose}
        message="Te enviaremos nuestras mejores ofertas, una vez por mes."
      />
    </Box>
  )
}

ProductCTA.propTypes = {}

export default withRoot(ProductCTA)
