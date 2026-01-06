import React from 'react'
import { Box, Typography } from '@mui/material'
import { BRAND_COLORS } from '../../innerTheme'

/**
 * Single specification item with icon display
 * @param {{ icon: React.ElementType, label: string, value: string }} props
 */
export const SpecItem = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box 
      sx={{ 
        p: 1, 
        borderRadius: 2, 
        bgcolor: 'rgba(0, 188, 212, 0.1)', 
        color: BRAND_COLORS.accent,
        mr: 2,
        display: 'flex'
      }}
    >
      <Icon fontSize="small" />
    </Box>
    <Box>
      <Typography 
        variant="caption" 
        sx={{ 
          color: 'text.secondary', 
          fontWeight: 'bold', 
          display: 'block', 
          textTransform: 'uppercase' 
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
        {value}
      </Typography>
    </Box>
  </Box>
)
