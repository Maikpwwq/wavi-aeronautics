'use client'

import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

/**
 * PseBadge
 * Reusable trust badge displaying the official PSE logo with tooltip and subtle glow hover effects.
 */
export default function PseBadge({
  title = 'Pagos 100% Seguros con PSE y Mercado Pago',
  sx = {},
  imgSx = {},
  ...props
}) {
  return (
    <Tooltip title={title} arrow placement="bottom">
      <Box
        component="div"
        aria-label={title}
        sx={{
          display: { xs: 'none', sm: 'inline-flex' },
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'transparent',
          p: 0,
          transition: 'transform 0.25s ease, filter 0.25s ease',
          flexShrink: 0,
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.06)',
            filter: 'drop-shadow(0 2px 8px rgba(0, 172, 228, 0.5))'
          },
          ...sx
        }}
        {...props}
      >
        <Box
          component="img"
          src="/logos/pse-logo.png"
          alt="PSE Pagos Seguros en Línea"
          sx={{
            height: { sm: 34, md: 38 },
            width: 'auto',
            maxWidth: 120,
            display: 'block',
            objectFit: 'contain',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))',
            ...imgSx
          }}
        />
      </Box>
    </Tooltip>
  )
}

PseBadge.propTypes = {
  title: PropTypes.string,
  sx: PropTypes.object,
  imgSx: PropTypes.object
}
