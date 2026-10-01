/**
 * BannerTextColumn — Left column of the dynamic category banner.
 *
 * Displays the active category's icon badge, title, description,
 * a progress indicator (n/total), and a CTA button linking to the category page.
 *
 * Uses opacity + transform transitions controlled by the parent's
 * `isTransitioning` flag from useBannerCycle.
 */
'use client'

import React from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import VideocamIcon from '@mui/icons-material/Videocam'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote'
import SensorsIcon from '@mui/icons-material/Sensors'
import TvIcon from '@mui/icons-material/Tv'
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull'

/** Map iconName strings from categories.ts to actual MUI icon components */
const ICON_MAP = {
  FlightTakeoff: FlightTakeoffIcon,
  Videocam: VideocamIcon,
  SportsEsports: SportsEsportsIcon,
  Visibility: VisibilityIcon,
  SettingsRemote: SettingsRemoteIcon,
  Sensors: SensorsIcon,
  Tv: TvIcon,
  BatteryChargingFull: BatteryChargingFullIcon,
}

/**
 * @param {object} props
 * @param {string} props.title - Category title
 * @param {string} props.description - Category description
 * @param {string} props.href - Link to category page
 * @param {string} props.iconName - MUI icon name from categories.ts
 * @param {boolean} props.isTransitioning - Controls fade animation
 * @param {number} props.totalCategories - Total categories in rotation
 * @param {number} props.activeIndex - Current category index (0-based)
 */
export default function BannerTextColumn({
  title,
  description,
  href,
  iconName,
  isTransitioning,
  totalCategories,
  activeIndex,
}) {
  const Icon = ICON_MAP[iconName] || FlightTakeoffIcon

  return (
    <Box
      sx={{
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'translateY(14px)' : 'translateY(0)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        zIndex: 2,
        px: { xs: 2.5, md: 0 },
        py: { xs: 2, md: 0 },
      }}
    >
      {/* Category Badge + Progress */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 2.5, md: 3.5 } }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            bgcolor: 'rgba(0, 172, 228, 0.15)',
            border: '1px solid rgba(0, 172, 228, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Icon sx={{ color: '#00aCe4', fontSize: 22 }} />
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: '#64748b',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '0.7rem',
          }}
        >
          {activeIndex + 1} / {totalCategories}
        </Typography>
      </Box>

      {/* Title */}
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontWeight: 800,
          color: '#ffffff',
          fontSize: { xs: '1.55rem', sm: '1.95rem', md: '2.35rem' },
          letterSpacing: '-0.025em',
          lineHeight: 1.12,
          mb: { xs: 1.5, md: 2.5 },
          textTransform: 'none',
        }}
      >
        {title}
      </Typography>

      {/* Accent bar */}
      <Box
        sx={{
          width: 48,
          height: 3.5,
          bgcolor: '#00aCe4',
          borderRadius: 2,
          mb: { xs: 2, md: 3 },
        }}
      />

      {/* Description */}
      <Typography
        variant="body1"
        component="p"
        sx={{
          color: 'rgba(255, 255, 255, 0.72)',
          fontSize: { xs: '0.9rem', sm: '0.97rem', md: '1.04rem' },
          lineHeight: 1.65,
          maxWidth: 460,
          mb: { xs: 3.5, md: 5 },
          textTransform: 'none',
        }}
      >
        {description}
      </Typography>

      {/* CTA Button */}
      <Button
        component={Link}
        href={href}
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        sx={{
          bgcolor: '#00aCe4',
          color: '#fff',
          fontWeight: 700,
          textTransform: 'none',
          borderRadius: 2.5,
          px: 3.5,
          py: 1.1,
          fontSize: '0.9rem',
          letterSpacing: '0.01em',
          boxShadow: '0 4px 18px rgba(0, 172, 228, 0.35)',
          transition: 'all 0.25s ease',
          '&:hover': {
            bgcolor: '#0090c0',
            transform: 'translateX(3px)',
            boxShadow: '0 6px 24px rgba(0, 172, 228, 0.5)',
          },
        }}
      >
        Explorar categoría
      </Button>
    </Box>
  )
}
