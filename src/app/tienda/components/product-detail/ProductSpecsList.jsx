import React from 'react'
import { Box, Typography } from '@mui/material'
import { BRAND_COLORS } from '../../innerTheme'

/**
 * Renders specifications as a structured description list.
 * @param {{ specs: Array<{label: string, value: string}> }} props
 */
export const ProductSpecsList = ({ specs }) => {
  if (!specs || specs.length === 0) {
    return (
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        No hay especificaciones adicionales listadas.
      </Typography>
    )
  }

  return (
    <Box 
      component="dl" 
      sx={{ 
        m: 0,
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 1,
        rowGap: 1.5
      }}
    >
      {specs.map((spec, index) => (
        <React.Fragment key={index}>
          <Box 
            component="dt" 
            sx={{ 
              fontWeight: 600, 
              color: BRAND_COLORS.text.primary,
              pr: 2,
              display: 'flex',
              alignItems: 'center',
              '&::before': {
                content: '"•"',
                color: BRAND_COLORS.primary,
                mr: 1
              }
            }}
          >
            {spec.label}
          </Box>
          <Box 
            component="dd" 
            sx={{ m: 0, color: BRAND_COLORS.text.secondary }}
          >
            {spec.value || '—'}
          </Box>
        </React.Fragment>
      ))}
    </Box>
  )
}
