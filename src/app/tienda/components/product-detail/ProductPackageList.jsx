import React from 'react'
import { Box, Typography } from '@mui/material'
import { BRAND_COLORS } from '../../innerTheme'

/**
 * Renders a list of package items from parsed data.
 * @param {{ items: string[] }} props
 */
export const ProductPackageList = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Consulta con soporte para más detalles sobre los componentes incluidos.
      </Typography>
    )
  }

  return (
    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {items.map((item, index) => (
        <Box 
          component="li" 
          key={index}
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            py: 1,
            borderBottom: index < items.length - 1 ? `1px solid ${BRAND_COLORS.border.light}` : 'none',
            '&::before': {
              content: '"✓"',
              color: BRAND_COLORS.primary,
              fontWeight: 'bold',
              mr: 1.5,
              fontSize: '1rem'
            }
          }}
        >
          <Typography variant="body1" sx={{ color: BRAND_COLORS.text.secondary }}>
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
