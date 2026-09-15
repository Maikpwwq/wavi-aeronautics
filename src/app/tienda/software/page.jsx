'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Stack,
  Divider
} from '@mui/material'
import {
  SportsEsports,
  Layers,
  CheckCircle,
  OpenInNew,
  Tune,
  SettingsRemote,
  Bolt,
  WhatsApp,
  VerifiedUser,
  Computer,
  ShieldOutlined
} from '@mui/icons-material'
import withRoot from '@/modules/withRoot'

// Feature highlights for VelociDrone
const VELOCIDRONE_FEATURES = [
  'Física aerodinámica hiperrealista calibrada para quads de 5", cinelifters y micro drones.',
  'Soporte Plug & Play USB con radios RadioMaster, TBS Tango 2, FrSky y controles gamer.',
  'Pistas de competencia oficiales MultiGP y editor 3D de escenarios personalizados.',
  'Modo multijugador online en tiempo real y práctica offline sin conexión.',
  'Ahorra cientos de dólares en hélices, motores y repuestos practicando horas ilimitadas.'
]

// Feature highlights for Pix4D
const PIX4D_FEATURES = [
  'Generación de ortomosaicos georreferenciados de alta resolución espacial.',
  'Modelos 3D precisos, curvas de nivel y nubes de puntos densas (MDS / MDT).',
  'Cálculo volumétrico exacto de acopios, excavaciones y movimientos de tierra.',
  'Exportación nativa compatible con software CAD, BIM y GIS (Civil 3D, ArcGIS, QGIS).',
  'Ecosistema líder mundial para ingeniería civil, topografía, minería y agricultura.'
]

// Essential free firmware & configuration tools
const UTILITIES = [
  {
    title: 'Betaflight Configurator',
    tag: 'Control de Vuelo',
    tagColor: '#00aCe4',
    icon: Tune,
    description:
      'Herramienta indispensable para calibrar giroscopios, sintonizar filtros PID, configurar canales de receptor y actualizar firmware en controladoras de vuelo STM32.',
    link: 'https://github.com/betaflight/betaflight-configurator/releases',
    actionText: 'Descargar Betaflight'
  },
  {
    title: 'EdgeTX Companion',
    tag: 'Radio Transmisor',
    tagColor: '#ff6f00',
    icon: SettingsRemote,
    description:
      'Software de gestión para respaldar modelos, editar mezclas de sticks, actualizar el sistema operativo de tu radio y gestionar scripts LUA de telemetría.',
    link: 'https://edgetx.org/',
    actionText: 'Descargar EdgeTX'
  },
  {
    title: 'ESC Configurator',
    tag: 'Variadores Electrónicos',
    tagColor: '#10b981',
    icon: Bolt,
    description:
      'Configurador web para ESCs con firmware Bluejay y BLHeli_S/32. Permite invertir el sentido de giro de los motores y habilitar RPM filtering con DShot bidireccional.',
    link: 'https://esc-configurator.com/',
    actionText: 'Abrir ESC Configurator'
  }
]

function SoftwarePage() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 3, md: 5 },
        px: { xs: 1, sm: 2 }
      }}
    >
      <Container maxWidth="lg">
        {/* ================================================================= */}
        {/* HERO SECTION STANDARDIZED                                         */}
        {/* ================================================================= */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          {/* Eyebrow Badge */}
          <Chip
            label="Ecosistema Digital & Software"
            size="small"
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              bgcolor: 'rgba(0, 172, 228, 0.08)',
              color: '#0284c7',
              border: '1px solid rgba(0, 172, 228, 0.25)',
              px: 1.5,
              py: 0.5
            }}
          />

          {/* Main Title */}
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.9rem', sm: '2.6rem', md: '3.1rem' },
              letterSpacing: '-0.025em',
              color: '#0f172a',
              lineHeight: 1.18,
              mb: 1.5
            }}
          >
            Software Especializado para Drones & FPV
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

          {/* Subtitle */}
          <Typography
            variant="body1"
            component="p"
            sx={{
              color: '#475569',
              fontWeight: 400,
              fontSize: { xs: '0.98rem', sm: '1.12rem', md: '1.2rem' },
              lineHeight: 1.7,
              maxWidth: 760,
              mx: 'auto',
              textTransform: 'none'
            }}
          >
            Plataformas de entrenamiento inmersivo para dominar el vuelo FPV sin riesgo
            de accidentes y software avanzado de fotogrametría para modelado digital y topografía.
          </Typography>
        </Box>

        {/* ================================================================= */}
        {/* FEATURED SOFTWARE CARDS (VELOCIDRONE & PIX4D)                    */}
        {/* ================================================================= */}
        <Grid container spacing={4} sx={{ mb: { xs: 6, md: 9 } }}>
          {/* Card 1: VelociDrone */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: '#00aCe4',
                  boxShadow: '0 18px 36px rgba(0, 172, 228, 0.12)'
                }
              }}
            >
              {/* Header Visual Banner */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #0b172a 0%, #172554 60%, #00aCe4 100%)',
                  p: { xs: 3, sm: 3.5 },
                  color: '#ffffff',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2.5
                  }}
                >
                  <Chip
                    label="Simulador de Vuelo"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(0, 240, 255, 0.15)',
                      border: '1px solid rgba(0, 240, 255, 0.35)',
                      color: '#00F0FF',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}
                  >
                    <Computer sx={{ fontSize: '1rem', color: '#00aCe4' }} />
                    <span>PC / Mac</span>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 3,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00F0FF',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <SportsEsports sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: '1.4rem', sm: '1.65rem' },
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                        color: '#ffffff'
                      }}
                    >
                      VelociDrone FPV
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255, 255, 255, 0.75)', mt: 0.3 }}
                    >
                      Simulador de Carreras y Freestyle
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Card Body */}
              <CardContent
                sx={{
                  p: { xs: 3, sm: 3.5 },
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: '#334155',
                    fontSize: '0.98rem',
                    lineHeight: 1.65,
                    mb: 3
                  }}
                >
                  ¡Vive la acción de participar como piloto en carreras de drones FPV a
                  grandes velocidades! Desarrolla reflejos extremos en un ambiente 100%
                  seguro protegiendo tus dispositivos y tu inversión antes de volar quads reales.
                </Typography>

                {/* Features list */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#0f172a',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.06em',
                    mb: 2
                  }}
                >
                  Capacidades Destacadas
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
                  {VELOCIDRONE_FEATURES.map((feature, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.25
                      }}
                    >
                      <CheckCircle
                        sx={{
                          fontSize: '1.15rem',
                          color: '#00aCe4',
                          mt: 0.25,
                          flexShrink: 0
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#475569',
                          fontSize: '0.9rem',
                          lineHeight: 1.5
                        }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* Card Action */}
                <Box sx={{ mt: 'auto' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1.5
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <VerifiedUser sx={{ fontSize: '1rem', color: '#0284c7' }} />
                      <Typography
                        variant="caption"
                        sx={{ color: '#64748b', fontWeight: 600 }}
                      >
                        Licencia Oficial Permanente
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    component="a"
                    href="https://www.velocidrone.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    fullWidth
                    size="large"
                    endIcon={<OpenInNew />}
                    sx={{
                      background: 'linear-gradient(135deg, #00aCe4 0%, #0284c7 100%)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      py: 1.4,
                      borderRadius: 2.5,
                      boxShadow: '0 4px 14px rgba(0, 172, 228, 0.3)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                        boxShadow: '0 6px 20px rgba(0, 172, 228, 0.45)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Adquirir licencia VelociDrone
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: Pix4D */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: '#10b981',
                  boxShadow: '0 18px 36px rgba(16, 185, 129, 0.12)'
                }
              }}
            >
              {/* Header Visual Banner */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 60%, #10b981 100%)',
                  p: { xs: 3, sm: 3.5 },
                  color: '#ffffff',
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2.5
                  }}
                >
                  <Chip
                    label="Mapeo & Fotogrametría"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(52, 211, 153, 0.15)',
                      border: '1px solid rgba(52, 211, 153, 0.35)',
                      color: '#34d399',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}
                  >
                    <ShieldOutlined sx={{ fontSize: '1rem', color: '#34d399' }} />
                    <span>Nivel Profesional</span>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 3,
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#34d399',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <Layers sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: '1.4rem', sm: '1.65rem' },
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                        color: '#ffffff'
                      }}
                    >
                      Pix4D Digital Mapping
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'rgba(255, 255, 255, 0.75)', mt: 0.3 }}
                    >
                      Fotogrametría y Topografía 3D con Drones
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Card Body */}
              <CardContent
                sx={{
                  p: { xs: 3, sm: 3.5 },
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: '#334155',
                    fontSize: '0.98rem',
                    lineHeight: 1.65,
                    mb: 3
                  }}
                >
                  Plataforma líder para ingenieros, agrónomos y topógrafos. Transforma
                  fotografías e imágenes aéreas en ortomosaicos georreferenciados, modelos
                  digitales de elevación y nubes de puntos de precisión milimétrica.
                </Typography>

                {/* Features list */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#0f172a',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    letterSpacing: '0.06em',
                    mb: 2
                  }}
                >
                  Capacidades Destacadas
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
                  {PIX4D_FEATURES.map((feature, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.25
                      }}
                    >
                      <CheckCircle
                        sx={{
                          fontSize: '1.15rem',
                          color: '#10b981',
                          mt: 0.25,
                          flexShrink: 0
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#475569',
                          fontSize: '0.9rem',
                          lineHeight: 1.5
                        }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* Card Action */}
                <Box sx={{ mt: 'auto' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1.5
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <VerifiedUser sx={{ fontSize: '1rem', color: '#059669' }} />
                      <Typography
                        variant="caption"
                        sx={{ color: '#64748b', fontWeight: 600 }}
                      >
                        Licencias Comerciales y Educativas
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    component="a"
                    href="https://www.pix4d.com/es"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    fullWidth
                    size="large"
                    endIcon={<OpenInNew />}
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      py: 1.4,
                      borderRadius: 2.5,
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.45)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    Adquirir licencia Pix4D
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ================================================================= */}
        {/* ESSENTIAL FREE CONFIGURATION & FIRMWARE TOOLS                    */}
        {/* ================================================================= */}
        <Box sx={{ mb: { xs: 6, md: 9 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
            <Chip
              label="Utilidades Esenciales para tu Taller"
              size="small"
              sx={{
                mb: 1.5,
                fontWeight: 700,
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                bgcolor: 'rgba(255, 111, 0, 0.08)',
                color: '#e65100',
                border: '1px solid rgba(255, 111, 0, 0.25)',
                px: 1.5,
                py: 0.5
              }}
            />
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.6rem', sm: '2.1rem', md: '2.4rem' },
                color: '#0f172a',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
                mb: 1
              }}
            >
              Software de Configuración & Firmware Gratuito
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                maxWidth: 680,
                mx: 'auto',
                fontSize: { xs: '0.92rem', sm: '1rem' }
              }}
            >
              Herramientas de código abierto recomendadas y utilizadas por el equipo técnico
              de Wavi Aeronautics para calibrar y optimizar aeronaves.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {UTILITIES.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Grid key={index} size={{ xs: 12, md: 4 }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3.5,
                      border: '1px solid #e2e8f0',
                      bgcolor: '#ffffff',
                      p: { xs: 3, sm: 3.5 },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: item.tagColor,
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.06)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2.5
                      }}
                    >
                      <Box
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: 2.5,
                          bgcolor: `${item.tagColor}12`,
                          color: item.tagColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${item.tagColor}30`
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
                          bgcolor: '#f8fafc',
                          color: item.tagColor,
                          border: `1px solid ${item.tagColor}30`
                        }}
                      />
                    </Box>

                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        color: '#0f172a',
                        mb: 1.2
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        lineHeight: 1.6,
                        mb: 3,
                        flexGrow: 1
                      }}
                    >
                      {item.description}
                    </Typography>

                    <Button
                      component="a"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="medium"
                      endIcon={<OpenInNew sx={{ fontSize: '0.95rem !important' }} />}
                      sx={{
                        borderColor: '#cbd5e1',
                        color: '#334155',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        textTransform: 'none',
                        py: 1,
                        borderRadius: 2,
                        mt: 'auto',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: item.tagColor,
                          color: item.tagColor,
                          bgcolor: `${item.tagColor}08`
                        }
                      }}
                    >
                      {item.actionText}
                    </Button>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Box>

        {/* ================================================================= */}
        {/* WAVI TECHNICAL SUPPORT & ADVISORY BANNER                         */}
        {/* ================================================================= */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: 4,
            p: { xs: 3.5, sm: 5 },
            color: '#ffffff',
            border: '1px solid rgba(0, 172, 228, 0.25)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient Light Glow */}
          <Box
            sx={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 172, 228, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography
                variant="h4"
                component="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.4rem', sm: '1.8rem' },
                  letterSpacing: '-0.02em',
                  mb: 1.2,
                  color: '#ffffff'
                }}
              >
                ¿Dudas sobre licencias o configuración de tu control?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.75)',
                  fontSize: { xs: '0.92rem', sm: '1.02rem' },
                  lineHeight: 1.6,
                  maxWidth: 620
                }}
              >
                Nuestro equipo de pilotos e ingenieros te ayuda a conectar tu radio transmisor,
                configurar tu simulador o definir la mejor solución fotogramétrica para tus operaciones.
              </Typography>
            </Grid>

            <Grid
              size={{ xs: 12, md: 4 }}
              sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' }
              }}
            >
              <Button
                component="a"
                href="https://wa.me/573245464166?text=Hola%20Wavi%20Aeronautics,%20necesito%20asesor%C3%ADa%20sobre%20software%20y%20simuladores."
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="large"
                startIcon={<WhatsApp />}
                sx={{
                  bgcolor: '#25D366',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  py: 1.5,
                  px: 3,
                  borderRadius: 2.5,
                  boxShadow: '0 4px 16px rgba(37, 211, 102, 0.35)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#20ba5a',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(37, 211, 102, 0.45)'
                  }
                }}
              >
                Consultar por WhatsApp
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}

export default withRoot(SoftwarePage)
