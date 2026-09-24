'use client'

import React, { useState, useEffect, useMemo } from 'react'
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
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import CloseIcon from '@mui/icons-material/Close'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import SearchIcon from '@mui/icons-material/Search'

import { getCatalogBrands, getFallbackBrands } from '@/services/brandsService'

/**
 * BrandsMenuDialog Component
 * Displays a modal dialog with all store brands, matching the CategoriesMenuDialog visual style.
 * Clicking a brand redirects to /tienda/buscar?marca=[slug] with cross-category results.
 */
const BrandsMenuDialog = ({ open, onClose }) => {
  const [brands, setBrands] = useState(() => getFallbackBrands())
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let isMounted = true
    if (open) {
      getCatalogBrands()
        .then((data) => {
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setBrands(data)
          }
        })
        .catch((err) => {
          console.error('Error fetching catalog brands:', err)
        })
    } else {
      // Reset filter on close
      setSearchTerm('')
    }

    return () => {
      isMounted = false
    }
  }, [open])

  // Filtered brands based on user search in modal
  const filteredBrands = useMemo(() => {
    if (!searchTerm.trim()) return brands
    const term = searchTerm.toLowerCase().trim()
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(term) ||
        (b.tagline && b.tagline.toLowerCase().includes(term)) ||
        (b.aliases && b.aliases.some((a) => a.toLowerCase().includes(term)))
    )
  }, [brands, searchTerm])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="brands-dialog-title"
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
        id="brands-dialog-title"
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
            <LocalOfferIcon sx={{ fontSize: 22 }} />
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
              Marcas de la Tienda
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
              Explora componentes y equipos FPV por fabricante especializado
            </Typography>
          </Box>
        </Box>

        <IconButton
          aria-label="Cerrar menú de marcas"
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, sm: 3 } }}>
          {/* Quick Search Bar within Modal */}
          <Box>
            <TextField
              size="small"
              fullWidth
              placeholder="Buscar marca (ej. TBS, BetaFPV, GEPRC, DJI)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }
              }}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  '& fieldset': {
                    borderColor: '#e2e8f0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00aCe4'
                  }
                }
              }}
            />
          </Box>

          {/* Section Heading & Counter */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                variant="subtitle1"
                component="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '0.95rem', sm: '1.05rem' },
                  color: '#0f172a',
                  letterSpacing: '0.2px'
                }}
              >
                Todas las Marcas
              </Typography>
            </Box>

            <Chip
              label={`${filteredBrands.length} ${filteredBrands.length === 1 ? 'marca' : 'marcas'}`}
              size="small"
              sx={{
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 700,
                bgcolor: 'rgba(0, 172, 228, 0.08)',
                color: '#0284c7',
                border: '1px solid rgba(0, 172, 228, 0.2)'
              }}
            />
          </Box>

          {/* Brands Grid */}
          {filteredBrands.length > 0 ? (
            <Grid container spacing={{ xs: 1.25, sm: 1.75 }}>
              {filteredBrands.map((brand) => (
                <Grid
                  key={brand.id}
                  size={{ xs: 6, sm: 4, md: 3 }}
                >
                  <Box
                    component={Link}
                    href={`/tienda/buscar?marca=${encodeURIComponent(brand.slug)}`}
                    onClick={onClose}
                    data-testid={`brand-link-${brand.slug}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      minHeight: { xs: 90, sm: 105 },
                      p: { xs: 1.5, sm: 2 },
                      bgcolor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: '#00aCe4',
                        bgcolor: 'rgba(0, 172, 228, 0.03)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px -2px rgba(0, 172, 228, 0.15)',
                        '& .brand-arrow': {
                          color: '#00aCe4',
                          transform: 'translateX(3px)'
                        },
                        '& .brand-name': {
                          color: '#00aCe4'
                        }
                      }
                    }}
                  >
                    {/* Top Row: Name and Arrow */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 0.5, mb: 0.5 }}>
                      <Typography
                        className="brand-name"
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '0.86rem', sm: '0.92rem' },
                          color: '#0f172a',
                          lineHeight: 1.3,
                          transition: 'color 0.2s ease'
                        }}
                      >
                        {brand.name}
                      </Typography>

                      <ChevronRightIcon
                        className="brand-arrow"
                        sx={{
                          fontSize: 18,
                          color: '#94a3b8',
                          transition: 'all 0.2s ease',
                          flexShrink: 0,
                          mt: 0.2
                        }}
                      />
                    </Box>

                    {/* Middle/Bottom: Tagline or Products count */}
                    <Box sx={{ mt: 'auto', pt: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#64748b',
                          fontSize: { xs: '0.68rem', sm: '0.74rem' },
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {brand.tagline || 'Componentes y accesorios FPV'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                py: 5,
                textAlign: 'center',
                color: '#64748b'
              }}
            >
              <Typography variant="body2" sx={{ fontSize: '0.92rem' }}>
                No se encontraron marcas coincidentes con &quot;{searchTerm}&quot;.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

BrandsMenuDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default BrandsMenuDialog
