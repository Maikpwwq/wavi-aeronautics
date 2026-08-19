'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import { motion, AnimatePresence } from 'framer-motion'

// Icons
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports'
import MovieCreationIcon from '@mui/icons-material/MovieCreation'
import LandscapeIcon from '@mui/icons-material/Landscape'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import MapIcon from '@mui/icons-material/Map'
import SecurityIcon from '@mui/icons-material/Security'
import GavelIcon from '@mui/icons-material/Gavel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import ExploreIcon from '@mui/icons-material/Explore'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SchoolIcon from '@mui/icons-material/School'

import withRoot from '@/modules/withRoot'

// Data for Equipment Use Cases extracted from catalog knowledge
const USE_CASES = [
  {
    id: 'deportivo',
    title: 'Deportivo & FPV Racing',
    category: 'Carreras y Acrobacia',
    icon: SportsMotorsportsIcon,
    color: '#00aCe4',
    bgGradient: 'linear-gradient(135deg, rgba(0, 172, 228, 0.12) 0%, rgba(0, 172, 228, 0.02) 100%)',
    description:
      'Vuelo inmersivo en primera persona (FPV) con velocidades superiores a 140 km/h. Reflejos extremos, destreza en circuitos de competencia y acrobacias freestyle.',
    recommendedGear: 'Kits FPV HD, Emisoras RadioMaster, Gafas FatShark / Walksnail, Baterías LiPo 6S.',
    link: '/tienda/drones-fpv-hd'
  },
  {
    id: 'publicidad',
    title: 'Publicidad & Cine',
    category: 'Producción Audiovisual',
    icon: MovieCreationIcon,
    color: '#ff6f00',
    bgGradient: 'linear-gradient(135deg, rgba(255, 111, 0, 0.12) 0%, rgba(255, 111, 0, 0.02) 100%)',
    description:
      'Tomas cinemáticas de alta velocidad y planos secuencia en 4K/6K. Cinemasters y cinelifters diseñados para portar cámaras profesionales en eventos, comerciales y películas.',
    recommendedGear: 'Drones VToL estabilizados, Transmisores Digitales VTX, Cámaras HD, Hélices de bajo ruido.',
    link: '/tienda/digital-vtx'
  },
  {
    id: 'agricultura',
    title: 'Agricultura de Precisión',
    category: 'Agroindustria & Ambiente',
    icon: AgricultureIcon,
    color: '#16a34a',
    bgGradient: 'linear-gradient(135deg, rgba(22, 163, 74, 0.12) 0%, rgba(22, 163, 74, 0.02) 100%)',
    description:
      'Diagnóstico de cultivos, análisis multiespectral de índice NDVI, aspersión focalizada y monitoreo de estrés hídrico para maximizar la productividad agrícola en el campo colombiano.',
    recommendedGear: 'Plataformas de gran autonomía, Sensores térmicos/multiespectrales, Controladores de vuelo avanzados.',
    link: '/tienda/drones'
  },
  {
    id: 'mapeo',
    title: 'Mapeo & Fotogrametría',
    category: 'Topografía & Ingeniería',
    icon: MapIcon,
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0.02) 100%)',
    description:
      'Generación de ortomosaicos georreferenciados, modelos digitales de terreno (DEM) 3D, curvas de nivel y cálculo volumétrico para obras civiles y minería.',
    recommendedGear: 'Drones con posicionamiento RTK/PPK, Software de procesamiento fotogramétrico, Telemetría de largo alcance.',
    link: '/tienda/software'
  },
  {
    id: 'inspeccion',
    title: 'Inspección & Seguridad',
    category: 'Monitoreo Industrial',
    icon: SecurityIcon,
    color: '#0284c7',
    bgGradient: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(2, 132, 199, 0.02) 100%)',
    description:
      'Supervisión de infraestructura crítica: torres de energía, paneles solares, techos, puentes y vigilancia perimetral sin poner en riesgo vidas humanas.',
    recommendedGear: 'Drones con zoom óptico y sensor térmico, Transmisores receptores de video protegidos, Motores de alto torque.',
    link: '/tienda/trasmisor-receptor'
  },
  {
    id: 'turismo',
    title: 'Excursión & Turismo',
    category: 'Exploración y Naturaleza',
    icon: LandscapeIcon,
    color: '#0d9488',
    bgGradient: 'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(13, 148, 136, 0.02) 100%)',
    description:
      'Exploración de la geografía y paisajes naturales de Colombia. Captura de tomas panorámicas en senderismo y expediciones respetando los ecosistemas protegidos.',
    recommendedGear: 'Kits portátiles ultralivianos (<249g), Baterías de repuesto, Cargadores portátiles.',
    link: '/tienda/accesorios'
  }
]

// RAC 100 Regulation Categories
const RAC100_PILLARS = [
  {
    title: 'Categoría Abierta (Recreativo & Formativo)',
    badge: 'Uso Personal / Recreativo',
    badgeColor: '#16a34a',
    icon: FlightTakeoffIcon,
    rules: [
      'Vuelo en línea de vista visual permanente (VLOS) hasta 120 metros (400 ft) de altura sobre el terreno.',
      'Aeronaves no tripuladas de hasta 25 kg de peso máximo de despegue.',
      'Registro obligatorio en el RUAS (Registro Único de Aeronaves No Tripuladas de la Aerocivil) para equipos de más de 250 g.',
      'Prohibido volar a menos de 9 km (5 NM) de aeropuertos y bases militares sin autorización ATC.',
      'Respeto irrestricto de la privacidad ciudadana y prohibición de volar sobre concentraciones de personas al aire libre.'
    ]
  },
  {
    title: 'Categoría Específica (Comercial & Profesional)',
    badge: 'Uso Comercial / Especializado',
    badgeColor: '#ff6f00',
    icon: GavelIcon,
    rules: [
      'Aplica para fotogrametría, publicidad, inspección técnica, filmación comercial o vuelos fuera de línea de vista (BVLOS).',
      'El piloto al mando debe contar con Certificado de Idoneidad emitido por un Centro de Instrucción Aeronáutica (CIA) avalado por Aerocivil.',
      'La empresa u operador debe estar acreditado ante la UAEAC con Manual de Operaciones y Análisis de Riesgos (SORA).',
      'Póliza de Responsabilidad Civil Extracontractual vigente que ampare daños a terceros en superficie.',
      'Aprobación de plan de vuelo y coordinación en espacios aéreos controlados mediante NOTAM o canales oficiales.'
    ]
  }
]

function ProductValues() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <Box
      component="section"
      id="guia-rac100-usos"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Decorative Gradients */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 172, 228, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 111, 0, 0.06) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Chip
            icon={<GavelIcon sx={{ fontSize: '1rem !important', color: '#00aCe4 !important' }} />}
            label="Aplicaciones & Marco Legal Colombia"
            size="small"
            sx={{
              fontWeight: 800,
              bgcolor: 'rgba(0, 172, 228, 0.1)',
              color: '#00aCe4',
              border: '1px solid rgba(0, 172, 228, 0.3)',
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}
          />
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 900,
              color: '#0f172a',
              fontSize: { xs: '1.85rem', sm: '2.4rem', md: '2.8rem' },
              letterSpacing: '-0.5px'
            }}
          >
            ¿Para qué puedes usar tu equipo?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              maxWidth: 720,
              mx: 'auto',
              mt: 1.5,
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              lineHeight: 1.6
            }}
          >
            Desde la emoción del FPV deportivo hasta la ingeniería de precisión. Conoce los campos de aplicación y opera siempre con seguridad bajo la normativa aeronáutica <strong>RAC 100</strong>.
          </Typography>
        </Box>

        {/* Interactive Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            centered
            sx={{
              bgcolor: '#ffffff',
              p: 0.75,
              borderRadius: 3,
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              '& .MuiTabs-indicator': {
                height: '100%',
                borderRadius: 2.5,
                bgcolor: '#00aCe4',
                zIndex: 0
              }
            }}
          >
            <Tab
              icon={<ExploreIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Casos de Uso & Aplicaciones"
              sx={{
                textTransform: 'none',
                fontWeight: 800,
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                zIndex: 1,
                borderRadius: 2.5,
                minHeight: 44,
                px: { xs: 2, sm: 3 },
                color: activeTab === 0 ? '#ffffff !important' : '#475569',
                transition: 'color 0.2s ease'
              }}
            />
            <Tab
              icon={<GavelIcon sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Normativa RAC 100 (Aerocivil)"
              sx={{
                textTransform: 'none',
                fontWeight: 800,
                fontSize: { xs: '0.85rem', sm: '0.95rem' },
                zIndex: 1,
                borderRadius: 2.5,
                minHeight: 44,
                px: { xs: 2, sm: 3 },
                color: activeTab === 1 ? '#ffffff !important' : '#475569',
                transition: 'color 0.2s ease'
              }}
            />
          </Tabs>
        </Box>

        {/* TAB 0: Use Cases Grid */}
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="use-cases"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                {USE_CASES.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Card
                        elevation={0}
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          borderRadius: 3.5,
                          border: '1px solid #e2e8f0',
                          bgcolor: '#ffffff',
                          background: item.bgGradient,
                          p: { xs: 2.5, sm: 3 },
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: `0 16px 32px rgba(0, 0, 0, 0.08)`,
                            borderColor: item.color
                          }
                        }}
                      >
                        <Box>
                          {/* Header with Icon & Category */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                bgcolor: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: item.color,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.04)'
                              }}
                            >
                              <Icon sx={{ fontSize: 28 }} />
                            </Box>
                            <Chip
                              label={item.category}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                bgcolor: '#ffffff',
                                color: item.color,
                                border: `1px solid ${item.color}40`
                              }}
                            />
                          </Box>

                          {/* Title & Description */}
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, lineHeight: 1.3 }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, mb: 2 }}>
                            {item.description}
                          </Typography>

                          {/* Recommended Gear */}
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: 'rgba(255, 255, 255, 0.8)',
                              backdropFilter: 'blur(4px)',
                              borderRadius: 2,
                              border: '1px solid rgba(226, 232, 240, 0.8)',
                              mb: 2.5
                            }}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155', display: 'block', mb: 0.5 }}>
                              🛠 Equipamiento Recomendado:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.4, display: 'block' }}>
                              {item.recommendedGear}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Action Link */}
                        <Button
                          component={Link}
                          href={item.link}
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            alignSelf: 'flex-start',
                            textTransform: 'none',
                            fontWeight: 800,
                            color: item.color,
                            p: 0,
                            '&:hover': {
                              bgcolor: 'transparent',
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          Ver equipos para {item.title.split('&')[0].trim()}
                        </Button>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            </motion.div>
          )}

          {/* TAB 1: RAC 100 Regulation Guide */}
          {activeTab === 1 && (
            <motion.div
              key="rac100-guide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={4}>
                {RAC100_PILLARS.map((pillar, idx) => {
                  const PillarIcon = pillar.icon
                  return (
                    <Grid item xs={12} md={6} key={idx}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: { xs: 3, sm: 4 },
                          borderRadius: 3.5,
                          border: '1px solid #e2e8f0',
                          bgcolor: '#ffffff',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
                        }}
                      >
                        <Box>
                          {/* Header */}
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Box
                                sx={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: '10px',
                                  bgcolor: `${pillar.badgeColor}15`,
                                  color: pillar.badgeColor,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <PillarIcon sx={{ fontSize: 24 }} />
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                {pillar.title}
                              </Typography>
                            </Box>
                            <Chip
                              label={pillar.badge}
                              size="small"
                              sx={{
                                fontWeight: 800,
                                bgcolor: `${pillar.badgeColor}15`,
                                color: pillar.badgeColor,
                                border: `1px solid ${pillar.badgeColor}40`
                              }}
                            />
                          </Box>

                          <Divider sx={{ mb: 2.5 }} />

                          {/* Rule points */}
                          <Stack spacing={1.75}>
                            {pillar.rules.map((rule, rIdx) => (
                              <Box key={rIdx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                                <CheckCircleIcon sx={{ fontSize: 18, color: pillar.badgeColor, mt: 0.3, flexShrink: 0 }} />
                                <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                                  {rule}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Box>

                        <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed #e2e8f0' }}>
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AssignmentTurnedInIcon sx={{ fontSize: 16, color: '#00aCe4' }} /> Fuente oficial: Unidad Administrativa Especial de Aeronáutica Civil (UAEAC).
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  )
                })}

                {/* Golden Rules Banner for Pilot Safety */}
                <Grid item xs={12}>
                  <Card
                    elevation={0}
                    sx={{
                      p: { xs: 3, sm: 4 },
                      borderRadius: 3.5,
                      bgcolor: '#0f172a',
                      color: '#ffffff',
                      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.25)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                          <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                          <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                            Reglas de Oro para Volar Seguro en Colombia
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, mb: 2 }}>
                          1. Nunca vueles sobre aglomeraciones o zonas residenciales sin permiso.<br />
                          2. Mantén contacto visual directo con tu aeronave en todo momento.<br />
                          3. Respeta el límite de altura de 120 metros AGL.<br />
                          4. No operes bajo los efectos del alcohol o sustancias psicoactivas.
                        </Typography>
                        <Chip
                          label="Cumplimiento RUAS obligatorio para drones >250g"
                          size="small"
                          sx={{
                            fontWeight: 800,
                            bgcolor: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            border: '1px solid rgba(245, 158, 11, 0.4)'
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Button
                          component={Link}
                          href="/tienda/escuela"
                          variant="contained"
                          color="primary"
                          startIcon={<SchoolIcon />}
                          sx={{
                            px: 3,
                            py: 1.25,
                            borderRadius: 2.5,
                            fontWeight: 800,
                            textTransform: 'none',
                            bgcolor: '#00aCe4',
                            color: '#ffffff',
                            boxShadow: '0 4px 16px rgba(0, 172, 228, 0.4)',
                            '&:hover': { bgcolor: '#0095c7' }
                          }}
                        >
                          Aprende con Escuela FPV
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  )
}

export default withRoot(ProductValues)
