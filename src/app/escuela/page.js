'use client'

import React from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import SchoolIcon from '@mui/icons-material/School'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import GavelIcon from '@mui/icons-material/Gavel'
import DevicesIcon from '@mui/icons-material/Devices'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

import withRoot from '@/modules/withRoot'
import ProductValues from '@/modules/views/ProductValues'
import RevealOnScroll from '@/modules/components/RevealOnScroll'

const HIGHLIGHTS = [
  {
    icon: DevicesIcon,
    tag: 'Fase 1: Simulación',
    color: '#00aCe4',
    bgGradient: 'linear-gradient(135deg, rgba(0, 172, 228, 0.12) 0%, rgba(0, 172, 228, 0.02) 100%)',
    title: 'Simulador & Fundamentos',
    description:
      'Entrenamiento inicial en simuladores FPV de alta precisión. Desarrolla reflejos y memoria muscular sin arriesgar tu equipo físico.'
  },
  {
    icon: FlightTakeoffIcon,
    tag: 'Fase 2: Vuelo Real',
    color: '#ff6f00',
    bgGradient: 'linear-gradient(135deg, rgba(255, 111, 0, 0.12) 0%, rgba(255, 111, 0, 0.02) 100%)',
    title: 'Modo Ángulo & Acro FPV',
    description:
      'Prácticas de campo en espacios seguros. Domina la transición de vuelo estabilizado por sensores al modo acrobático manual de alta velocidad.'
  },
  {
    icon: GavelIcon,
    tag: 'Fase 3: Normativa',
    color: '#16a34a',
    bgGradient: 'linear-gradient(135deg, rgba(22, 163, 74, 0.12) 0%, rgba(22, 163, 74, 0.02) 100%)',
    title: 'Seguridad Operacional & RAC 100',
    description:
      'Aprende protocolos pre-vuelo, manejo de baterías LiPo y la reglamentación de la Aerocivil para operar responsablemente en Colombia.'
  }
]

const Escuela = () => {
  return (
    <Box component="main" sx={{ bgcolor: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 55%, #ffffff 100%)',
          pt: { xs: 6, sm: 8, md: 10 },
          pb: { xs: 6, sm: 8, md: 10 }
        }}
      >
        {/* Ambient background glow */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '350px',
            background:
              'radial-gradient(ellipse at center, rgba(0, 172, 228, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header & Badging */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, px: 2 }}>
            <Chip
              icon={
                <SchoolIcon
                  sx={{
                    fontSize: '15px !important',
                    color: '#00aCe4 !important'
                  }}
                />
              }
              label="CONOCE MÁS SOBRE VUELO RECREATIVO & CAPACITACIÓN TÉCNICA BASICA"
              size="small"
              sx={{
                mb: 2,
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(0, 172, 228, 0.08)',
                color: '#0284c7',
                border: '1px solid rgba(0, 172, 228, 0.25)',
                px: 1
              }}
            />

            <Typography
              variant="h2"
              component="h1"
              align="center"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.25rem' },
                letterSpacing: '-0.025em',
                color: '#0f172a',
                mb: 1.5,
                lineHeight: 1.15
              }}
            >
              Vuelo de Drones & FPV
            </Typography>

            {/* Wavi Accent Bar */}
            <Box
              sx={{
                width: 60,
                height: 4,
                bgcolor: '#00aCe4',
                borderRadius: 2,
                mx: 'auto',
                mb: 3
              }}
            />

            <Typography
              variant="h5"
              component="p"
              align="center"
              sx={{
                color: '#475569',
                fontWeight: 400,
                fontSize: { xs: '0.98rem', sm: '1.12rem', md: '1.2rem' },
                lineHeight: 1.7,
                maxWidth: 700,
                mx: 'auto',
                mb: { xs: 3.5, sm: 4.5 }
              }}
            >
              ¡Vive la experiencia de volar! Conoce todo sobre el mundo de los drones y la tecnología FPV con entrenamiento práctico, personalizado y enfocado en la seguridad operativa.
            </Typography>

            {/* CTA Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                component="a"
                href="https://api.whatsapp.com/send?phone=573204842897&text=Hola%20Wavi%20Aeronautics,%20quiero%20informaci%C3%B3n%20para%20programar%20una%20clase%20de%20vuelo%20de%20drones."
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="large"
                startIcon={<WhatsAppIcon sx={{ fontSize: '1.3rem !important' }} />}
                sx={{
                  bgcolor: '#25D366',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  py: 1.5,
                  px: 3.5,
                  borderRadius: 2.5,
                  boxShadow: '0 4px 18px rgba(37, 211, 102, 0.35)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#20ba5a',
                    boxShadow: '0 6px 24px rgba(37, 211, 102, 0.5)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Programar mentoría
              </Button>

              <Button
                component="a"
                href="#guia-rac100-usos"
                variant="outlined"
                size="large"
                endIcon={<ArrowDownwardIcon />}
                sx={{
                  borderColor: '#cbd5e1',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  letterSpacing: '0.02em',
                  textTransform: 'none',
                  py: 1.5,
                  px: 3,
                  borderRadius: 2.5,
                  bgcolor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#00aCe4',
                    color: '#00aCe4',
                    bgcolor: 'rgba(0, 172, 228, 0.04)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Conoce lo básico sobre la Normativa RAC 100 & sus Usos
              </Button>
            </Stack>
          </Box>

          {/* Highlights / Program Pillars */}
          <Grid container spacing={3} sx={{ mt: { xs: 2, md: 4 } }}>
            {HIGHLIGHTS.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Grid key={index} size={{ xs: 12, md: 4 }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 3.5,
                      border: '1px solid #e2e8f0',
                      bgcolor: '#ffffff',
                      background: item.bgGradient,
                      p: { xs: 3, sm: 3.5 },
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 14px 28px rgba(0, 0, 0, 0.07)',
                        borderColor: item.color
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2.5,
                          bgcolor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: item.color,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                          border: '1px solid rgba(0,0,0,0.04)'
                        }}
                      >
                        <IconComponent sx={{ fontSize: 24 }} />
                      </Box>
                      <Chip
                        label={item.tag}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          bgcolor: '#ffffff',
                          color: item.color,
                          border: `1px solid ${item.color}35`
                        }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, fontSize: '1.08rem' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                      {item.description}
                    </Typography>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      </Box>

      {/* ProductValues section (RAC 100 Guide & Equipment Applications) */}
      <RevealOnScroll delay={150}>
        <ProductValues />
      </RevealOnScroll>

      {/* Bottom Booking Banner */}
      <Box
        component="section"
        sx={{
          py: { xs: 6, sm: 8 },
          bgcolor: '#0f172a',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Chip
            icon={<CheckCircleOutlineIcon sx={{ fontSize: '15px !important', color: '#38bdf8 !important' }} />}
            label="ATENCIÓN PERSONALIZADA"
            size="small"
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              px: 1
            }}
          />

          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.25rem' },
              color: '#ffffff',
              mb: 1.5
            }}
          >
            ¿Listo para iniciarte en el vuelo recreativo?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#94a3b8',
              maxWidth: 580,
              mx: 'auto',
              mb: 4,
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              lineHeight: 1.6
            }}
          >
            Agenda una mentoría con nosotros, diseñamos el mejor temario y horario para vos.
          </Typography>

          <Button
            component="a"
            href="https://api.whatsapp.com/send?phone=573204842897&text=Hola%20Wavi%20Aeronautics,%20deseo%20m%C3%A1s%20detalles%20sobre%20las%20clases%20de%20drones."
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            size="large"
            startIcon={<WhatsAppIcon />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              bgcolor: '#25D366',
              color: '#ffffff',
              boxShadow: '0 4px 18px rgba(37, 211, 102, 0.35)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#20ba5a',
                boxShadow: '0 6px 26px rgba(37, 211, 102, 0.5)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Chatear con un Piloto Certificado
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default withRoot(Escuela)

