'use client'

import React from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import SpeedIcon from '@mui/icons-material/Speed'
import BuildCircleIcon from '@mui/icons-material/BuildCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import withRoot from '@/modules/withRoot'

const VALUE_PROPOSITIONS = [
  {
    title: 'Tendencias & Vanguardia FPV',
    description: 'Acceso prioritario a los últimos lanzamientos de la industria: sistemas HD digitales, ecosistemas ELRS, radiocontroles de alta precisión y tecnología VToL.',
    icon: <RocketLaunchIcon sx={{ fontSize: 32 }} />,
    color: '#0284c7',
    badgeBg: 'rgba(2, 132, 199, 0.1)',
    highlights: ['Transmisión digital HD', 'Compatibilidad garantizada', 'Lanzamientos globales']
  },
  {
    title: 'Optimización de tu Tiempo',
    description: 'Configuraciones listas para volar (RTF/BNF), asesoría técnica experta y soporte integral para que te concentres exclusivamente en volar o producir sin demoras.',
    icon: <SpeedIcon sx={{ fontSize: 32 }} />,
    color: '#9333ea',
    badgeBg: 'rgba(147, 51, 234, 0.1)',
    highlights: ['Equipos pre-configurados', 'Despliegue inmediato', 'Asesoría especializada']
  },
  {
    title: 'Taller Técnico & Mantenimiento',
    description: 'Servicio de mantenimiento preventivo y correctivo, soldadura especializada de microelectrónica, calibración de sensores y repuestos originales con garantía.',
    icon: <BuildCircleIcon sx={{ fontSize: 32 }} />,
    color: '#16a34a',
    badgeBg: 'rgba(22, 163, 74, 0.1)',
    highlights: ['Diagnóstico electrónico', 'Calibración de software', 'Repuestos certificados']
  }
]

function ProductHowItWorks() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, maxWidth: 720, mx: 'auto' }}>
          <Chip
            label="VALOR AGREGADO WAVI"
            size="small"
            sx={{
              fontWeight: 800,
              letterSpacing: '1px',
              bgcolor: 'rgba(0, 172, 228, 0.12)',
              color: '#0284c7',
              mb: 2,
              px: 1
            }}
          />
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.5px',
              fontSize: { xs: '1.85rem', sm: '2.5rem' },
              mb: 2
            }}
          >
            Te Ofrecemos Respaldo Integral
          </Typography>
          <Box
            sx={{
              width: 60,
              height: 4,
              bgcolor: '#00aCe4',
              borderRadius: 2,
              mx: 'auto',
              mb: 2.5
            }}
          />
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6
            }}
          >
            Más que una tienda de drones, somos tu aliado técnico y comercial en Colombia para impulsar tus proyectos recreativos y profesionales.
          </Typography>
        </Box>

        {/* Value Cards Grid (3x1) without numbers */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 3, md: 4 },
            mb: { xs: 6, md: 8 }
          }}
        >
          {VALUE_PROPOSITIONS.map((item, idx) => (
            <Paper
              key={idx}
              elevation={0}
              sx={{
                p: { xs: 3.5, sm: 4 },
                borderRadius: 4,
                bgcolor: '#ffffff',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.04)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.09)',
                  borderColor: item.color
                }
              }}
            >
              {/* Header: Icon Only (Numbers Removed) */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: item.badgeBg,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 14px ${item.color}20`
                  }}
                >
                  {item.icon}
                </Box>
              </Box>

              {/* Title */}
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 800,
                  color: '#0f172a',
                  mb: 1.5,
                  fontSize: '1.2rem',
                  lineHeight: 1.3
                }}
              >
                {item.title}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  lineHeight: 1.65,
                  mb: 3,
                  flexGrow: 1
                }}
              >
                {item.description}
              </Typography>

              {/* Bullet highlights */}
              <Stack spacing={1} sx={{ pt: 2, borderTop: '1px solid #f1f5f9' }}>
                {item.highlights.map((highlight, hIdx) => (
                  <Box key={hIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 16, color: item.color }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
                      {highlight}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          ))}
        </Box>

        {/* Call to Action Buttons */}
        <Box sx={{ textAlign: 'center' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              component={Link}
              href="/tienda"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                background: 'linear-gradient(135deg, #00aCe4 0%, #0284c7 100%)',
                color: '#ffffff !important',
                fontWeight: 800,
                fontSize: '1rem',
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 8px 24px rgba(0, 172, 228, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0099cc 0%, #0369a1 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 28px rgba(0, 172, 228, 0.45)'
                }
              }}
            >
              Explorar Catálogo de Equipos
            </Button>

            {/* High-contrast 'Crear Cuenta de Piloto' button */}
            <Button
              component={Link}
              href="/auth/sign-up"
              variant="outlined"
              size="large"
              startIcon={<PersonAddAltIcon sx={{ color: '#0284c7 !important' }} />}
              sx={{
                border: '2px solid #0284c7 !important',
                color: '#0284c7 !important',
                bgcolor: '#ffffff !important',
                fontWeight: 800,
                fontSize: '1rem',
                px: 3.5,
                py: 1.4,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)',
                transition: 'all 0.25s ease',
                '& .MuiTypography-root, & span': {
                  color: '#0284c7 !important'
                },
                '&:hover': {
                  border: '2px solid #0284c7 !important',
                  bgcolor: 'rgba(2, 132, 199, 0.08) !important',
                  color: '#0369a1 !important',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(2, 132, 199, 0.18)'
                }
              }}
            >
              <Typography component="span" sx={{ fontWeight: 800, fontSize: '1rem', color: 'inherit !important' }}>
                Crear Cuenta de Piloto
              </Typography>
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default withRoot(ProductHowItWorks)
