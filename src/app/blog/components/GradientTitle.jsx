'use client'

import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Box } from '@mui/material'

/**
 * GradientTitle
 * Dynamically highlights designated keywords/phrases using a vibrant tech gradient
 * (Electric Cyan -> Purple/Fuchsia -> Neon Pink/Magenta) on high-contrast base text.
 */
export default function GradientTitle({
  text,
  highlight = [],
  variant = 'h2',
  component = 'h1',
  align = 'center',
  gradient = 'linear-gradient(135deg, #00F0FF 0%, #a855f7 50%, #FF007A 100%)',
  baseColor = '#FFFFFF',
  sx = {},
  ...rest
}) {
  const highlights = Array.isArray(highlight)
    ? highlight.filter(Boolean)
    : [highlight].filter(Boolean)

  if (!text || highlights.length === 0) {
    return (
      <Typography
        variant={variant}
        component={component}
        align={align}
        sx={{
          color: baseColor,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          ...sx
        }}
        {...rest}
      >
        {text}
      </Typography>
    )
  }

  // Escape special regex characters in highlight strings
  const escapedHighlights = highlights.map((h) =>
    h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )
  const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi')
  const parts = text.split(regex)

  return (
    <Typography
      variant={variant}
      component={component}
      align={align}
      sx={{
        color: baseColor,
        fontWeight: 800,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
        ...sx
      }}
      {...rest}
    >
      {parts.map((part, index) => {
        const isHighlight = highlights.some(
          (h) => h.toLowerCase() === part.toLowerCase()
        )

        if (isHighlight) {
          return (
            <Box
              key={index}
              component="span"
              sx={{
                background: gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                fontWeight: 900
              }}
            >
              {part}
            </Box>
          )
        }

        return <React.Fragment key={index}>{part}</React.Fragment>
      })}
    </Typography>
  )
}

GradientTitle.propTypes = {
  text: PropTypes.string.isRequired,
  highlight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  variant: PropTypes.string,
  component: PropTypes.string,
  align: PropTypes.string,
  gradient: PropTypes.string,
  baseColor: PropTypes.string,
  sx: PropTypes.object
}
