'use client'

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import SpeedIcon from '@mui/icons-material/Speed'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { BRAND_COLORS } from '@/app/tienda/innerTheme'

const DEFAULT_SHIPPING_OPTIONS = [
  {
    id: 'standard-national',
    name: 'Envío Estándar Nacional',
    estimatedDays: '24 a 72 horas hábiles',
    price: 0,
    isDefault: true,
    carrier: 'Coordinadora / Servientrega / Envía',
    description: 'Entrega asegurada puerta a puerta a nivel nacional una vez confirmado el pago.'
  },
  {
    id: 'express-urban',
    name: 'Envío Exprés Urbano',
    estimatedDays: '24 a 48 horas hábiles',
    price: 0,
    isDefault: false,
    carrier: 'Mensajería Especializada Wavi',
    description: 'Despacho prioritario con seguimiento en tiempo real para ciudades principales.'
  }
]

/**
 * Interactive Shipping Details Modal
 * Showcases available shipping methods with horizontal selectable option cards.
 * Ready for multi-carrier scaling.
 */
export const ShippingDetailsModal = ({
  open,
  onClose,
  shippingOptions = null,
  onSelectOption
}) => {
  const options = (Array.isArray(shippingOptions) && shippingOptions.length > 0)
    ? shippingOptions
    : DEFAULT_SHIPPING_OPTIONS

  const defaultSelected = options.find(opt => opt.isDefault)?.id || options[0]?.id || ''
  const [selectedId, setSelectedId] = useState(defaultSelected)

  const handleSelect = (id) => {
    setSelectedId(id)
    onSelectOption?.(id)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="shipping-details-dialog-title"
      data-testid="shipping-details-modal"
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: { xs: 1, sm: 2 },
          bgcolor: '#ffffff',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle
        id="shipping-details-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: 'rgba(0, 172, 228, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00aCe4'
            }}
          >
            <LocalShippingOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Envíos a nivel nacional
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Métodos de entrega asegurada para hardware FPV y drones
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Cerrar modal de envíos"
          data-testid="shipping-modal-close-btn"
          sx={{
            color: '#64748b',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.05)', color: '#0f172a' }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2, pb: 3 }}>
        <Typography variant="body2" sx={{ color: '#475569', mb: 3 }}>
          Todos nuestros despachos cuentan con póliza de seguro ante pérdidas o averías durante el trayecto. Selecciona la opción preferida:
        </Typography>

        {/* Horizontal Selectable Cards */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          data-testid="shipping-options-list"
          sx={{ mb: 3 }}
        >
          {options.map((option) => {
            const isSelected = selectedId === option.id

            return (
              <Box
                key={option.id}
                onClick={() => handleSelect(option.id)}
                data-testid={`shipping-option-${option.id}`}
                sx={{
                  flex: 1,
                  p: 2.5,
                  borderRadius: 3,
                  cursor: 'pointer',
                  border: isSelected
                    ? '2px solid #00aCe4'
                    : '1.5px solid #e2e8f0',
                  bgcolor: isSelected
                    ? 'rgba(0, 172, 228, 0.04)'
                    : '#ffffff',
                  boxShadow: isSelected
                    ? '0 8px 20px rgba(0, 172, 228, 0.15)'
                    : 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  '&:hover': {
                    borderColor: '#00aCe4',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isSelected ? (
                      <CheckCircleIcon sx={{ color: '#00aCe4', fontSize: 22 }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ color: '#94a3b8', fontSize: 22 }} />
                    )}
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      {option.name}
                    </Typography>
                  </Box>

                  {option.isDefault && (
                    <Chip
                      label="Recomendado"
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        bgcolor: 'rgba(76, 175, 80, 0.12)',
                        color: '#2e7d32'
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: '#0284c7' }}>
                  <SpeedIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {option.estimatedDays}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.85rem', mb: 2, minHeight: 40 }}>
                  {option.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                    {option.carrier || 'Transportadora certificada'}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: option.price === 0 ? '#16a34a' : '#0f172a' }}>
                    {option.price === 0 ? 'Envío Asegurado' : `$ ${option.price.toLocaleString('es-CO')} COP`}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Stack>

        {/* Trust Highlight Box */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: '#f8fafc',
            border: '1px dashed #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <VerifiedUserOutlinedIcon sx={{ color: '#00aCe4', fontSize: 24, flexShrink: 0 }} />
          <Typography variant="caption" sx={{ color: '#475569', lineHeight: 1.6 }}>
            <strong>Compromiso de entrega Wavi:</strong> Despachos en 24 a 72 horas hábiles una vez confirmado el pago. Incluye número de guía para rastreo satelital.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          data-testid="shipping-modal-confirm-btn"
          sx={{
            bgcolor: BRAND_COLORS.accent || '#00bcd4',
            color: '#ffffff',
            fontWeight: 700,
            borderRadius: 2.5,
            px: 3,
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#0097a7'
            }
          }}
        >
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ShippingDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  shippingOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      estimatedDays: PropTypes.string.isRequired,
      price: PropTypes.number,
      isDefault: PropTypes.bool,
      carrier: PropTypes.string,
      description: PropTypes.string
    })
  ),
  onSelectOption: PropTypes.func
}

export default ShippingDetailsModal
