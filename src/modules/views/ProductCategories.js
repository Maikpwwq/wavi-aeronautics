'use client'

import React from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@/modules/components/Typography'
import Chip from '@mui/material/Chip'
import withRoot from '@/modules/withRoot'

import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import VideocamIcon from '@mui/icons-material/Videocam'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote'
import SensorsIcon from '@mui/icons-material/Sensors'
import TvIcon from '@mui/icons-material/Tv'
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull'
import SchoolIcon from '@mui/icons-material/School'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'

const DJI1 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-1.png?alt=media&token=f4f153a2-45fd-415d-884c-6964d3bb582b'
const DJI2 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-2.png?alt=media&token=6c6a1248-55dd-46dd-9826-85614adccf4f'
const DJI3 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-3.png?alt=media&token=51af91e6-309a-41a4-b099-e2cfdbd76063'
const DJI4 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-4.png?alt=media&token=f36f4370-e7a7-4f27-a294-b5dd2d328dc5'
const DJI5 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-5.png?alt=media&token=9ee3bd14-817d-48f0-adb6-d7a1aa1a6074'
const DJI6 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-6.png?alt=media&token=57e15e18-6f0d-4e5f-b822-f24eca3ea1be'
const DJI7 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-7.png?alt=media&token=b85e87ca-4639-45af-a006-33454fa9bf19'
const DJI8 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-8.png?alt=media&token=466ba883-f0d1-429d-bd9d-bc7f2ef6b5cb'
const DJI9 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-9.png?alt=media&token=860cfe8b-8eb2-4e1c-80e0-c7c98e4a850b'

const categories = [
  {
    title: 'Kit Drones',
    subtitle: 'Listos para ensamblar y volar',
    url: DJI1,
    href: '/tienda/kit-drones',
    icon: FlightTakeoffIcon,
    width: { xs: '100%', sm: '50%', md: '33.33%' }
  },
  {
    title: 'Drones FPV HD',
    subtitle: 'Transmisión digital de alta definición',
    url: DJI2,
    href: '/tienda/drones-fpv-hd',
    icon: VideocamIcon,
    width: { xs: '100%', sm: '50%', md: '33.33%' }
  },
  {
    title: 'Drones RC',
    subtitle: 'Acrobacia, freestyle y competición',
    url: DJI3,
    href: '/tienda/drones',
    icon: SportsEsportsIcon,
    width: { xs: '100%', sm: '100%', md: '33.33%' }
  },
  {
    title: 'Goggles FPV',
    subtitle: 'Inmersión visual en primera persona',
    url: DJI4,
    href: '/tienda/googles',
    icon: VisibilityIcon,
    width: { xs: '100%', sm: '50%', md: '30%' }
  },
  {
    title: 'Radio Control',
    subtitle: 'Emisoras y módulos ELRS / TBS',
    url: DJI5,
    href: '/tienda/radio-control',
    icon: SettingsRemoteIcon,
    width: { xs: '100%', sm: '50%', md: '40%' }
  },
  {
    title: 'Transmisores & VTX',
    subtitle: 'Antenas, módulos y receptores',
    url: DJI6,
    href: '/tienda/trasmisor-receptor',
    icon: SensorsIcon,
    width: { xs: '100%', sm: '100%', md: '30%' }
  },
  {
    title: 'Digital VTX',
    subtitle: 'Sistemas Walksnail, Caddx y DJI O3',
    url: DJI7,
    href: '/tienda/digital-vtx',
    icon: TvIcon,
    width: { xs: '100%', sm: '50%', md: '30%' }
  },
  {
    title: 'Accesorios & Baterías',
    subtitle: 'LiPo LiHV, hélices, marcos y herramientas',
    url: DJI8,
    href: '/tienda/accesorios',
    icon: BatteryChargingFullIcon,
    width: { xs: '100%', sm: '50%', md: '35%' }
  },
  {
    title: 'Escuela & Software',
    subtitle: 'Cursos profesionales y simuladores FPV',
    url: DJI9,
    href: '/tienda/escuela',
    icon: SchoolIcon,
    width: { xs: '100%', sm: '100%', md: '35%' }
  },
  {
    title: 'Promociones & Descuentos',
    subtitle: 'Ofertas exclusivas por tiempo limitado en equipos seleccionados',
    url: '/static/img/Portada-DJI-Mavic-Air-2.png',
    href: '/tienda/buscar?q=oferta',
    icon: LocalOfferIcon,
    isPromo: true,
    promoBadge: '¡Hasta 30% OFF!',
    width: '100%'
  }
]

function ProductCategories() {
  return (
    <Container sx={{ mt: 8, mb: 6 }} component="section">
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h4" marked="center" align="center" component="h2" sx={{ fontWeight: 800 }}>
          Categorías de Nuestra Tienda
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: 2,
            color: 'text.secondary',
            maxWidth: 680,
            mx: 'auto',
            fontSize: { xs: '0.95rem', md: '1.05rem' }
          }}
        >
          Explora nuestra selección completa de drones, gafas FPV, radiocontroles, componentes de transmisión y accesorios con garantía y envío nacional.
        </Typography>
      </Box>

      {/* Categories Grid */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 1.5, sm: 2 },
          justifyContent: 'center'
        }}
      >
        {categories.map((cat) => {
          const Icon = cat.icon
          const isPromo = cat.isPromo

          return (
            <Box
              key={cat.title}
              sx={{
                position: 'relative',
                display: 'block',
                borderRadius: 3,
                overflow: 'hidden',
                height: isPromo ? { xs: 200, sm: 220, md: 240 } : { xs: 180, sm: 220, md: 260 },
                width: {
                  xs: '100%',
                  sm: typeof cat.width === 'object' ? cat.width.sm : cat.width,
                  md: typeof cat.width === 'object' ? `calc(${cat.width.md} - 16px)` : `calc(${cat.width} - 16px)`
                },
                flexBasis: {
                  xs: '100%',
                  sm: typeof cat.width === 'object' ? cat.width.sm : cat.width,
                  md: typeof cat.width === 'object' ? `calc(${cat.width.md} - 16px)` : `calc(${cat.width} - 16px)`
                },
                boxShadow: isPromo
                  ? '0 8px 24px rgba(255, 111, 0, 0.35)'
                  : '0 4px 16px rgba(0, 0, 0, 0.12)',
                border: isPromo
                  ? '2px solid #ff6f00'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: isPromo
                    ? '0 16px 36px rgba(255, 111, 0, 0.45)'
                    : '0 12px 28px rgba(0, 172, 228, 0.3)',
                  borderColor: isPromo ? '#ff9100' : '#00aCe4',
                  '& .category-bg': {
                    transform: 'scale(1.08)'
                  },
                  '& .category-overlay': {
                    bgcolor: isPromo ? 'rgba(18, 12, 5, 0.55)' : 'rgba(10, 25, 45, 0.55)'
                  },
                  '& .category-arrow': {
                    transform: 'translateX(4px)',
                    color: isPromo ? '#ff9100' : '#00aCe4'
                  }
                }
              }}
            >
              <Link
                href={cat.href}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  width: '100%',
                  position: 'relative'
                }}
              >
                {/* Background Image with smooth zoom */}
                <Box
                  className="category-bg"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${cat.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />

                {/* Dark Gradient Overlay for Contrast */}
                <Box
                  className="category-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: isPromo
                      ? 'linear-gradient(180deg, rgba(20, 10, 0, 0.4) 0%, rgba(20, 10, 0, 0.85) 100%)'
                      : 'linear-gradient(180deg, rgba(10, 15, 25, 0.35) 0%, rgba(10, 15, 25, 0.85) 100%)',
                    transition: 'background-color 0.3s ease'
                  }}
                />

                {/* Card Content */}
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    p: { xs: 2, sm: 2.5 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%'
                  }}
                >
                  {/* Top Badges & Icon */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: { xs: 36, sm: 42 },
                        height: { xs: 36, sm: 42 },
                        borderRadius: '50%',
                        bgcolor: isPromo ? 'rgba(255, 111, 0, 0.35)' : 'rgba(0, 172, 228, 0.25)',
                        backdropFilter: 'blur(6px)',
                        border: isPromo ? '1px solid rgba(255, 111, 0, 0.6)' : '1px solid rgba(0, 172, 228, 0.5)',
                        color: isPromo ? '#ffb74d' : '#00aCe4'
                      }}
                    >
                      <Icon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </Box>

                    {isPromo && (
                      <Chip
                        icon={<LocalOfferIcon sx={{ fontSize: '1rem !important', color: '#ffffff !important' }} />}
                        label={cat.promoBadge}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          bgcolor: 'secondary.main',
                          color: '#ffffff',
                          boxShadow: '0 2px 8px rgba(255, 111, 0, 0.5)',
                          letterSpacing: 0.5,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase'
                        }}
                      />
                    )}
                  </Box>

                  {/* Bottom Text and CTA */}
                  <Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: isPromo ? { xs: '1.2rem', sm: '1.4rem' } : { xs: '1.05rem', sm: '1.2rem' },
                        lineHeight: 1.2,
                        textShadow: '0 2px 4px rgba(0,0,0,0.6)'
                      }}
                    >
                      {cat.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: { xs: '0.75rem', sm: '0.825rem' },
                        mt: 0.5,
                        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {cat.subtitle}
                    </Typography>

                    <Box
                      className="category-arrow"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mt: 1,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: isPromo ? '#ffb74d' : '#00aCe4',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <span>Ver productos</span>
                      <Box component="span" sx={{ fontSize: '1rem', lineHeight: 1 }}>→</Box>
                    </Box>
                  </Box>
                </Box>
              </Link>
            </Box>
          )
        })}
      </Box>
    </Container>
  )
}

export default withRoot(ProductCategories)

