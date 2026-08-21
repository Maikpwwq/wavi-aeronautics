'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
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
import VisibilityIcon from '@mui/icons-material/Visibility'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import PolicyIcon from '@mui/icons-material/Policy'
import VerifiedIcon from '@mui/icons-material/Verified'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import LabelImportantIcon from '@mui/icons-material/LabelImportant'

import withRoot from '@/modules/withRoot'

// Data for Equipment Use Cases
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

// Modalidades de Alcance Visual según RAC 100
const OPERATIONAL_RANGES = [
  {
    title: 'VLOS (Visual Line of Sight)',
    badge: 'Hasta 750 m',
    badgeBg: '#0284c7',
    desc: 'Línea de vista visual directa y permanente del piloto al mando sin ayuda óptica (máx. 120 m / 400 ft de altura AGL).'
  },
  {
    title: 'EVLOS (Extended Visual Line of Sight)',
    badge: 'Hasta 3 km',
    badgeBg: '#8b5cf6',
    desc: 'Línea de vista extendida utilizando observadores visuales capacitados enlazados por radio cada 750 metros.'
  },
  {
    title: 'BVLOS (Beyond Visual Line of Sight)',
    badge: '> 3 km (Fuera de vista)',
    badgeBg: '#ea580c',
    desc: 'Vuelo a más de 3 km donde se pierde el contacto visual. Exige autorización de Aerocivil, transponder y análisis SORA.'
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
      {/* Decorative Gradients */}
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
              maxWidth: 760,
              mx: 'auto',
              mt: 1.5,
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              lineHeight: 1.6
            }}
          >
            Desde la pasión del FPV deportivo hasta la ingeniería civil y comercial. Conoce las aplicaciones y opera legalmente bajo la normativa <strong>RAC 100 de la Aeronáutica Civil</strong>.
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
              label="Comparativa Normativa RAC 100"
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

        {/* TAB 0: Use Cases Grid (3x2 on desktop md) */}
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div
              key="use-cases"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)'
                  },
                  gap: { xs: 2.5, sm: 3 },
                  alignItems: 'stretch'
                }}
              >
                {USE_CASES.map((item) => {
                  const Icon = item.icon
                  return (
                    <Card
                      key={item.id}
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
                          boxShadow: '0 16px 32px rgba(0, 0, 0, 0.08)',
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
                  )
                })}
              </Box>
            </motion.div>
          )}

          {/* TAB 1: Detailed RAC 100 Comparison (Recreational vs Commercial) */}
          {activeTab === 1 && (
            <motion.div
              key="rac100-guide"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Main Comparison: Open Category (Recreational) vs Specific Category (Commercial) */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: { xs: 3, md: 4 },
                  mb: 4,
                  alignItems: 'stretch'
                }}
              >
                {/* 1. Categoría Abierta */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 3.5,
                    border: '2px solid #86efac',
                    bgcolor: '#ffffff',
                    background: 'linear-gradient(180deg, rgba(240, 253, 244, 0.5) 0%, #ffffff 100%)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 24px rgba(22, 163, 74, 0.06)'
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            borderRadius: '12px',
                            bgcolor: 'rgba(22, 163, 74, 0.15)',
                            color: '#16a34a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FlightTakeoffIcon sx={{ fontSize: 26 }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
                            Categoría Abierta
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 800 }}>
                            Vuelo Recreativo & Formativo (Sin Lucro)
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label="Uso Personal / Hobby"
                        size="small"
                        sx={{ fontWeight: 800, bgcolor: 'rgba(22, 163, 74, 0.12)', color: '#15803d', border: '1px solid #86efac' }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                          <strong>Registro en el RUAS:</strong> Obligatorio registrar el dron ante el <em>Registro Único de Aeronaves No Tripuladas</em> de Aerocivil para equipos de más de 250 g hasta 25 kg.
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                          <strong>Permiso de Vuelo:</strong> <u>No requiere</u> solicitud previa de permiso de vuelo ante Aerocivil, siempre que se opere en espacio aéreo no controlado y fuera de zonas restringidas.
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                          <strong>Alcance VLOS:</strong> Vuelo en línea de vista visual permanente hasta <strong>750 metros</strong> de distancia y altura máxima de <strong>120 metros (400 ft) AGL</strong>.
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                          <strong>Visor Aerocivil:</strong> Obligatorio validar zonas en el <em>Visor Geográfico de Aerocivil</em>. Prohibido volar a menos de 9 km (5 NM) de aeropuertos o bases militares.
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#16a34a', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                          <strong>Sin Lucro:</strong> Prohibido cobrar o percibir retribución económica por los vuelos o contenidos capturados.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed #bbf7d0' }}>
                    <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VerifiedIcon sx={{ fontSize: 16 }} /> Ideal para aficionados, carreras FPV recreativas y fotografía de viaje.
                    </Typography>
                  </Box>
                </Paper>

                {/* 2. Categoría Específica */}
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 3.5,
                    border: '2px solid #fdba74',
                    bgcolor: '#ffffff',
                    background: 'linear-gradient(180deg, rgba(255, 247, 237, 0.6) 0%, #ffffff 100%)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 24px rgba(234, 88, 12, 0.06)'
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            borderRadius: '12px',
                            bgcolor: 'rgba(234, 88, 12, 0.15)',
                            color: '#ea580c',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <GavelIcon sx={{ fontSize: 26 }} />
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
                            Categoría Específica
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#ea580c', fontWeight: 800 }}>
                            Vuelo Comercial & Profesional (Con Lucro)
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label="Comercial / Lucro"
                        size="small"
                        sx={{ fontWeight: 800, bgcolor: 'rgba(234, 88, 12, 0.12)', color: '#c2410c', border: '1px solid #fdba74' }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#ea580c', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                          <strong>Explotador de UAS:</strong> Quien se lucre debe estar acreditado formalmente como <strong>Explotador de UAS</strong> ante Aerocivil (no basta con ser solo piloto).
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#ea580c', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                          <strong>Certificación CIAC:</strong> El piloto al mando debe contar con certificado de idoneidad emitido por un <em>Centro de Instrucción Aeronáutica Civil (CIAC)</em> avalado por la UAEAC.
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#ea580c', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                          <strong>Solicitud Permiso de Vuelo:</strong> <u>Requiere solicitud previa de Permiso de Vuelo</u> ante la Aerocivil para cada operación puntual, evento o zona controlada.
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#ea580c', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                          <strong>Póliza RCE:</strong> Obligatorio contar con póliza de <em>Responsabilidad Civil Extendida (RCE)</em> que ampare daños a terceros. Se pueden solicitar permisos por un solo día o anuales.
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#ea580c', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                          <strong>Bitácoras de Vuelo & Logbook:</strong> Registro estricto en la <em>Bitácora de Vuelo del Piloto</em> y el <em>Libro de Vuelo de la Aeronave</em> (horas, mantenimiento e inspecciones).
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#ea580c', mt: 0.2, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.5 }}>
                          <strong>Flota &gt; 3 Drones:</strong> Si el explotador excede 3 drones, debe registrar y designar ante Aerocivil a un <strong>Jefe de Pilotos UA</strong> y un <strong>Gerente de Seguridad Operacional</strong>.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed #fed7aa' }}>
                    <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PolicyIcon sx={{ fontSize: 16 }} /> Requerido para topografía, agricultura, filmación comercial y servicios industriales.
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              {/* Modalidades de Alcance Visual (VLOS / EVLOS / BVLOS) */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VisibilityIcon sx={{ color: '#00aCe4' }} /> Modalidades de Alcance Visual según RAC 100
                </Typography>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    gap: 2.5
                  }}
                >
                  {OPERATIONAL_RANGES.map((range, i) => (
                    <Card
                      key={i}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                        bgcolor: '#ffffff',
                        transition: 'transform 0.25s ease',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#0f172a' }}>
                          {range.title}
                        </Typography>
                        <Chip
                          label={range.badge}
                          size="small"
                          sx={{ fontWeight: 800, bgcolor: `${range.badgeBg}15`, color: range.badgeBg, border: `1px solid ${range.badgeBg}40`, fontSize: '0.72rem' }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.5 }}>
                        {range.desc}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              </Box>

              {/* Golden Rules Banner & Sanciones */}
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
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    gap: 3
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <WarningAmberIcon sx={{ color: '#f59e0b', fontSize: 30 }} />
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                        Reglas de Oro del Piloto & Explotador en Colombia
                      </Typography>
                    </Box>

                    <Stack spacing={1} sx={{ mt: 1.5, mb: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LabelImportantIcon sx={{ color: '#38bdf8', fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.5 }}>
                          <strong>Pegatina de Identificación Obligatoria:</strong> Tras registrar el dron en el RUAS, se debe adherir una <u>pegatina física con el identificador asignado</u> y enviar evidencia fotográfica por correo a Aerocivil para obtener la aprobación definitiva.
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LabelImportantIcon sx={{ color: '#38bdf8', fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.5 }}>
                          <strong>Visor Geográfico Aerocivil:</strong> Consulta permanente de zonas prohibidas, restringidas y helipuertos antes de encender el radiocontrol.
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LabelImportantIcon sx={{ color: '#38bdf8', fontSize: 18, mt: 0.3, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#cbd5e1', lineHeight: 1.5 }}>
                          <strong>Régimen Sancionatorio:</strong> Las infracciones de orden técnico y administrativo conllevan <u>multas económicas severas, inmovilización de equipos y retiro del certificado de idoneidad y explotación</u>.
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      <Chip
                        label="Registro RUAS + Pegatina visible"
                        size="small"
                        sx={{ fontWeight: 800, bgcolor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' }}
                      />
                      <Chip
                        label="Póliza RCE por día o anual"
                        size="small"
                        sx={{ fontWeight: 800, bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}
                      />
                      <Chip
                        label="Certificación CIAC Aerocivil"
                        size="small"
                        sx={{ fontWeight: 800, bgcolor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.4)' }}
                      />
                    </Stack>
                  </Box>

                  <Box sx={{ flexShrink: 0 }}>
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
                  </Box>
                </Box>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  )
}

export default withRoot(ProductValues)
