'use client'

import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

/**
 * CategoryHeader
 * Componente reutilizable para estandarizar el encabezado de las categorías de la tienda.
 * Incluye título con peso y espaciado optimizado, barra de acento Wavi azul (#00aCe4)
 * y subtítulo descriptivo en Slate-600.
 */
export default function CategoryHeader({
  title,
  description,
  titleComponent = 'h1',
  variant = 'h4',
  sx = {},
  children
}) {
  const isSecondary = variant === 'h5' || titleComponent === 'h2'

  return (
    <Box sx={{ mb: 3, ...sx }}>
      {title && (
        <Typography
          variant={variant}
          component={titleComponent}
          sx={{
            fontWeight: 800,
            fontSize: isSecondary
              ? { xs: '1.35rem', sm: '1.6rem', md: '1.85rem' }
              : { xs: '1.5rem', sm: '1.85rem', md: '2.15rem' },
            letterSpacing: isSecondary ? '-0.02em' : '-0.025em',
            color: '#0f172a',
            lineHeight: isSecondary ? 1.25 : 1.2,
            mb: 1
          }}
        >
          {title}
        </Typography>
      )}

      <Box
        sx={{
          width: 44,
          height: 3.5,
          bgcolor: '#00aCe4',
          borderRadius: 2,
          mb: 1.5
        }}
      />

      {description && (
        <Typography
          variant="body1"
          component="p"
          sx={{
            color: '#475569',
            fontWeight: 400,
            fontSize: { xs: '0.92rem', sm: '0.98rem', md: '1.02rem' },
            lineHeight: 1.65,
            maxWidth: 820,
            mb: children ? 1.5 : 0
          }}
        >
          {description}
        </Typography>
      )}

      {children}
    </Box>
  )
}

CategoryHeader.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  titleComponent: PropTypes.string,
  variant: PropTypes.string,
  sx: PropTypes.object,
  children: PropTypes.node
}
