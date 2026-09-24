'use client'

import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from 'next/link'

/**
 * ProductTaxonomy Component
 * Renders categories and tags as clickable comma-separated links
 * below the product info section on the PDP.
 */
const ProductTaxonomy = ({ categories = [], tags = [] }) => {
  if (categories.length === 0 && tags.length === 0) return null

  const linkSx = {
    color: '#475569',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'color 0.15s ease',
    '&:hover': {
      color: '#00aCe4',
      textDecoration: 'underline'
    }
  }

  return (
    <Box data-testid="product-taxonomy" sx={{ mb: 2 }}>
      {/* Categories */}
      {categories.length > 0 && (
        <Typography
          variant="body2"
          sx={{ fontSize: '0.85rem', color: '#64748b', mb: 0.75, lineHeight: 1.6 }}
        >
          <Box component="span" sx={{ fontWeight: 600, color: '#475569' }}>
            Categorías:{' '}
          </Box>
          {categories.map((cat, i) => (
            <React.Fragment key={cat}>
              <Box
                component={Link}
                href={`/tienda/buscar?q=${encodeURIComponent(cat)}`}
                sx={linkSx}
              >
                {cat}
              </Box>
              {i < categories.length - 1 && ', '}
            </React.Fragment>
          ))}
        </Typography>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <Typography
          variant="body2"
          sx={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}
        >
          <Box component="span" sx={{ fontWeight: 600, color: '#475569' }}>
            Etiquetas:{' '}
          </Box>
          {tags.map((tag, i) => (
            <React.Fragment key={tag}>
              <Box
                component={Link}
                href={`/tienda/buscar?q=${encodeURIComponent(tag)}`}
                sx={linkSx}
              >
                {tag}
              </Box>
              {i < tags.length - 1 && ', '}
            </React.Fragment>
          ))}
        </Typography>
      )}
    </Box>
  )
}

ProductTaxonomy.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string),
  tags: PropTypes.arrayOf(PropTypes.string)
}

export { ProductTaxonomy }
export default ProductTaxonomy
