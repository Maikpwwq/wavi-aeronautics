'use client'

import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { BRAND_COLORS } from '@/app/tienda/innerTheme'

/**
 * Interactive Quantity Selector for PDP
 * Dynamically bounded between 1 and maxStock.
 * Disables and displays 'Agotado' when stock <= 0 or disabled.
 */
export const QuantitySelector = ({
  quantity = 1,
  onQuantityChange,
  maxStock = 1,
  disabled = false
}) => {
  const isOutOfStock = disabled || maxStock <= 0

  const handleDecrement = (e) => {
    e?.stopPropagation?.()
    if (isOutOfStock || quantity <= 1) return
    onQuantityChange?.(quantity - 1)
  }

  const handleIncrement = (e) => {
    e?.stopPropagation?.()
    if (isOutOfStock || quantity >= maxStock) return
    onQuantityChange?.(quantity + 1)
  }

  if (isOutOfStock) {
    return (
      <Box
        data-testid="quantity-selector-out-of-stock"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 1,
          borderRadius: 2,
          bgcolor: 'rgba(211, 47, 47, 0.08)',
          border: '1px solid rgba(211, 47, 47, 0.3)',
          color: '#d32f2f',
          fontWeight: 700,
          fontSize: '0.875rem'
        }}
      >
        Agotado
      </Box>
    )
  }

  return (
    <Box
      data-testid="quantity-selector"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: `1.5px solid ${BRAND_COLORS.border.light || '#e2e8f0'}`,
        borderRadius: 2.5,
        bgcolor: '#ffffff',
        p: 0.5,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: BRAND_COLORS.accent
        }
      }}
    >
      <IconButton
        size="small"
        onClick={handleDecrement}
        disabled={quantity <= 1}
        aria-label="Disminuir cantidad"
        data-testid="quantity-decrement-btn"
        sx={{
          width: 32,
          height: 32,
          borderRadius: 2,
          color: BRAND_COLORS.text.primary,
          bgcolor: 'rgba(0, 0, 0, 0.03)',
          '&:hover': {
            bgcolor: 'rgba(0, 172, 228, 0.1)',
            color: BRAND_COLORS.primary
          },
          '&.Mui-disabled': {
            color: 'rgba(0, 0, 0, 0.25)',
            bgcolor: 'transparent'
          }
        }}
      >
        <RemoveIcon sx={{ fontSize: 16 }} />
      </IconButton>

      <Typography
        component="span"
        role="status"
        aria-live="polite"
        data-testid="quantity-display"
        sx={{
          minWidth: 40,
          textAlign: 'center',
          fontWeight: 800,
          fontSize: '1rem',
          color: BRAND_COLORS.text.primary,
          userSelect: 'none'
        }}
      >
        {quantity}
      </Typography>

      <IconButton
        size="small"
        onClick={handleIncrement}
        disabled={quantity >= maxStock}
        aria-label="Aumentar cantidad"
        data-testid="quantity-increment-btn"
        sx={{
          width: 32,
          height: 32,
          borderRadius: 2,
          color: BRAND_COLORS.text.primary,
          bgcolor: 'rgba(0, 0, 0, 0.03)',
          '&:hover': {
            bgcolor: 'rgba(0, 172, 228, 0.1)',
            color: BRAND_COLORS.primary
          },
          '&.Mui-disabled': {
            color: 'rgba(0, 0, 0, 0.25)',
            bgcolor: 'transparent'
          }
        }}
      >
        <AddIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  )
}

QuantitySelector.propTypes = {
  quantity: PropTypes.number,
  onQuantityChange: PropTypes.func,
  maxStock: PropTypes.number,
  disabled: PropTypes.bool
}

export default QuantitySelector
