'use client'

import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import CloseIcon from '@mui/icons-material/Close'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import StorefrontIcon from '@mui/icons-material/Storefront'

export const CATEGORY_GROUPS = [
  {
    id: 'drones-y-kits',
    name: 'Drones y Kits',
    categories: [
      {
        slug: 'kit-drones',
        name: "Kits de Drones FPV",
        href: '/tienda/kit-drones',
        badge: 'Iniciación & RTF',
        description: 'Todo lo necesario para despegar en primera persona desde el primer día.'
      },
      {
        slug: 'drones',
        name: 'Drones RC',
        href: '/tienda/drones',
        badge: 'BNF / PNP / RTF',
        description: 'Acrobáticos y de competición listos para vincular o ensamblar.'
      },
      {
        slug: 'drones-fpv-hd',
        name: 'Drones FPV HD',
        href: '/tienda/drones-fpv-hd',
        badge: 'Digital HD',
        description: 'Sistemas digitales de alta definición con máxima nitidez de imagen.'
      }
    ]
  },
  {
    id: 'equipo-vuelo-fpv',
    name: 'Equipo de Vuelo FPV',
    categories: [
      {
        slug: 'googles',
        name: 'Goggles FPV',
        href: '/tienda/googles',
        badge: 'Visión Inmersiva',
        description: 'Gafas de baja latencia con pantallas analógicas y digitales OLED.'
      },
      {
        slug: 'radio-control',
        name: 'Radio Control',
        href: '/tienda/radio-control',
        badge: 'Emisoras & Mandos',
        description: 'Controles ergonómicos con protocolos de largo alcance ELRS y TBS Crossfire.'
      }
    ]
  },
  {
    id: 'electronica-transmision',
    name: 'Electrónica y Transmisión',
    categories: [
      {
        slug: 'digital-vtx',
        name: 'Digital VTX',
        href: '/tienda/digital-vtx',
        badge: 'Video Digital',
        description: 'Módulos y cámaras HD Walksnail Avatar, Caddx Vista y DJI O3 Air Unit.'
      },
      {
        slug: 'trasmisor-receptor',
        name: 'Transmisor / Receptor',
        href: '/tienda/trasmisor-receptor',
        badge: 'RF & Antenas',
        description: 'Receptores de radio y transmisores de video con antenas de alta ganancia.'
      }
    ]
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    categories: [
      {
        slug: 'accesorios',
        name: 'Accesorios y Repuestos',
        href: '/tienda/accesorios',
        badge: 'LiPo & Hardware',
        description: 'Baterías LiPo de alto rendimiento, hélices, chasis de carbono y herramientas.'
      }
    ]
  }
]

const CategoriesMenuDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="categories-dialog-title"
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 3 },
          bgcolor: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          m: { xs: 1.5, sm: 3 }
        }
      }}
    >
      {/* ── Dialog Header ── */}
      <DialogTitle
        id="categories-dialog-title"
        sx={{
          m: 0,
          py: { xs: 2, sm: 2.5 },
          px: { xs: 2.5, sm: 4, md: 5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e2e8f0',
          bgcolor: '#0f172a',
          color: '#ffffff'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: '10px',
              bgcolor: 'rgba(0, 172, 228, 0.15)',
              color: '#00aCe4'
            }}
          >
            <StorefrontIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1.05rem', sm: '1.25rem' },
                color: '#ffffff',
                lineHeight: 1.2,
                display: 'block'
              }}
            >
              Categorías de la Tienda
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#94a3b8',
                fontSize: { xs: '0.72rem', sm: '0.8rem' },
                display: 'block',
                mt: 0.25
              }}
            >
              Explora todos nuestros productos y equipos FPV especializados
            </Typography>
          </Box>
        </Box>

        <IconButton
          aria-label="Cerrar menú de categorías"
          onClick={onClose}
          sx={{
            color: '#94a3b8',
            p: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#ffffff',
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </DialogTitle>

      {/* ── Dialog Content ── */}
      <DialogContent
        sx={{
          py: { xs: 2.5, sm: 3.5 },
          px: { xs: 2.5, sm: 4, md: 5 },
          bgcolor: '#f8fafc',
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#cbd5e1',
            borderRadius: '4px'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, sm: 3.5 } }}>
          {CATEGORY_GROUPS.map((group) => (
            <Box key={group.id} component="section" aria-labelledby={`group-title-${group.id}`}>
              {/* Group Heading */}
              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 4,
                      height: 18,
                      borderRadius: 1,
                      bgcolor: '#00aCe4'
                    }}
                  />
                  <Typography
                    id={`group-title-${group.id}`}
                    variant="subtitle1"
                    component="h3"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '0.95rem', sm: '1.05rem' },
                      color: '#0f172a',
                      letterSpacing: '0.2px'
                    }}
                  >
                    {group.name}
                  </Typography>
                </Box>
              </Box>

              {/* Category Cards Grid */}
              <Grid container spacing={{ xs: 1.25, sm: 1.75 }}>
                {group.categories.map((category) => (
                  <Grid
                    key={category.slug}
                    size={{ xs: 12, sm: 6, md: group.categories.length === 3 ? 4 : 6 }}
                  >
                    <Box
                      component={Link}
                      href={category.href}
                      onClick={onClose}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        p: { xs: 1.5, sm: 2 },
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                        position: 'relative',
                        '&:hover': {
                          borderColor: '#00aCe4',
                          bgcolor: 'rgba(0, 172, 228, 0.03)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px -2px rgba(0, 172, 228, 0.15)',
                          '& .category-arrow': {
                            color: '#00aCe4',
                            transform: 'translateX(3px)'
                          },
                          '& .category-name': {
                            color: '#00aCe4'
                          }
                        }
                      }}
                    >
                      {/* Top Row: Name and Chip */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
                        <Typography
                          className="category-name"
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: '0.88rem', sm: '0.95rem' },
                            color: '#0f172a',
                            lineHeight: 1.3,
                            transition: 'color 0.2s ease'
                          }}
                        >
                          {category.name}
                        </Typography>

                        <Chip
                          label={category.badge}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            bgcolor: 'rgba(0, 172, 228, 0.08)',
                            color: '#0284c7',
                            border: '1px solid rgba(0, 172, 228, 0.2)',
                            borderRadius: '6px',
                            flexShrink: 0
                          }}
                        />
                      </Box>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: '0.76rem', sm: '0.82rem' },
                          color: '#64748b',
                          lineHeight: 1.4,
                          mb: 1.25,
                          flexGrow: 1
                        }}
                      >
                        {category.description}
                      </Typography>

                      {/* Footer Row: Action hint */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pt: 0.5 }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.25,
                            color: '#00aCe4',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}
                        >
                          Ver productos
                          <ChevronRightIcon
                            className="category-arrow"
                            sx={{
                              fontSize: 16,
                              transition: 'transform 0.2s ease, color 0.2s ease'
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

CategoriesMenuDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default CategoriesMenuDialog
