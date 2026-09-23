'use client'

import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import { BRAND_COLORS } from '@/app/tienda/innerTheme'

/**
 * Renders recommended drone uses as high-tech pill badges.
 * Returns null if uses array is empty or undefined.
 */
export const RecommendedUses = ({ uses = [] }) => {
  if (!Array.isArray(uses) || uses.length === 0) return null

  return (
    <Box data-testid="recommended-uses-section" sx={{ my: 1.5 }}>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1,
          color: BRAND_COLORS.text.secondary || '#546e7a',
          mb: 0.75
        }}
      >
        Usos recomendados
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
        {uses.map((useItem, index) => (
          <Box
            key={index}
            data-testid="recommended-use-pill"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: 4,
              bgcolor: 'rgba(0, 172, 228, 0.08)',
              border: '1px solid rgba(0, 172, 228, 0.25)',
              color: '#0284c7',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: 0.2,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 172, 228, 0.16)',
                borderColor: '#00aCe4'
              }
            }}
          >
            <FlightTakeoffIcon sx={{ fontSize: 14, color: '#00aCe4' }} />
            <span>{useItem}</span>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

RecommendedUses.propTypes = {
  uses: PropTypes.arrayOf(PropTypes.string)
}

export default RecommendedUses
