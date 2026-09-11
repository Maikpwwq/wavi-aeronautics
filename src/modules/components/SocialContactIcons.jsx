'use client'

import React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'

export const SOCIAL_LINKS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp Oficial',
    href: 'https://api.whatsapp.com/send?phone=573204842897',
    icon: WhatsAppIcon,
    hoverColor: '#25D366',
    hoverBg: 'rgba(37, 211, 102, 0.15)'
  },
  {
    id: 'instagram',
    label: 'Instagram @wavi.aeronautics',
    href: 'https://www.instagram.com/wavi.aeronautics/',
    icon: InstagramIcon,
    hoverColor: '#E1306C',
    hoverBg: 'rgba(225, 48, 108, 0.15)'
  },
  {
    id: 'facebook',
    label: 'Facebook @wavi.aeronautics',
    href: 'https://www.facebook.com/wavi.aeronautics/',
    icon: FacebookIcon,
    hoverColor: '#1877F2',
    hoverBg: 'rgba(24, 119, 242, 0.15)'
  }
]

export default function SocialContactIcons({
  size = 'medium',
  color = 'rgba(255, 255, 255, 0.85)',
  spacing = 0.5,
  sx = {}
}) {
  const iconSize = size === 'small' ? 16 : 22
  const buttonSize = size === 'small' ? 28 : 36

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing,
        ...sx
      }}
    >
      {SOCIAL_LINKS.map((item) => {
        const IconComponent = item.icon
        return (
          <Tooltip key={item.id} title={item.label} arrow placement="bottom">
            <IconButton
              component="a"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              sx={{
                color,
                width: buttonSize,
                height: buttonSize,
                p: 0,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  color: item.hoverColor,
                  bgcolor: item.hoverBg,
                  transform: 'translateY(-1.5px) scale(1.08)'
                }
              }}
            >
              <IconComponent sx={{ fontSize: iconSize }} />
            </IconButton>
          </Tooltip>
        )
      })}
    </Box>
  )
}

SocialContactIcons.propTypes = {
  size: PropTypes.oneOf(['small', 'medium']),
  color: PropTypes.string,
  spacing: PropTypes.number,
  sx: PropTypes.object
}
