'use client'

import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import SecurityIcon from '@mui/icons-material/Security'

/**
 * PaymentMethods — displays accepted payment method logos in the footer.
 * Renders official Mercado Pago branding alongside a cohesive monochrome row of 
 * payment icons: PSE, PayPal, Visa, Mastercard, American Express, and Codensa.
 */
const paymentIcons = [
  {
    name: 'PSE',
    src: '/static/logos/PSE_color.svg',
    height: 22,
    filter: 'grayscale(100%) brightness(1.6) opacity(0.75)'
  },
  {
    name: 'PayPal',
    src: '/static/logos/paypal_gris.svg',
    height: 18,
    filter: 'brightness(1.1) opacity(0.75)'
  },
  {
    name: 'Visa',
    src: '/static/logos/visa_gris.svg',
    height: 16,
    filter: 'brightness(1.1) opacity(0.75)'
  },
  {
    name: 'Mastercard',
    src: '/static/logos/mastercard_gris.svg',
    height: 24,
    filter: 'brightness(1.1) opacity(0.75)'
  },
  {
    name: 'American Express',
    src: '/static/logos/americalexpress_gris.svg',
    height: 19,
    filter: 'brightness(1.1) opacity(0.75)'
  },
  {
    name: 'Codensa',
    src: '/static/logos/Codensa_whitebg.svg',
    height: 22,
    filter: 'grayscale(100%) opacity(0.8)'
  }
]

const PaymentMethods = () => {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          color: 'rgba(255, 255, 255, 0.95)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          mb: 2,
          fontSize: '0.8rem'
        }}
      >
        Aceptamos
      </Typography>

      {/* Mercado Pago Official Logo — horizontal color on white bg */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderRadius: 2,
          px: 1.5,
          py: 1,
          mb: 2.5,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      >
        <Box
          component="img"
          src="/static/logos/mercadopago-horizontal.svg"
          alt="Mercado Pago"
          sx={{
            height: 30,
            width: 'auto',
            display: 'block'
          }}
        />
      </Box>

      {/* Payment Method Logos Row (Grayscale / Monochrome Style) */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
          mb: 2
        }}
      >
        {paymentIcons.map((item) => (
          <Tooltip key={item.name} title={item.name} arrow placement="top">
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                '&:hover img': {
                  filter: 'grayscale(0%) brightness(1) opacity(1)',
                  transform: 'scale(1.08)'
                }
              }}
            >
              <Box
                component="img"
                src={item.src}
                alt={item.name}
                sx={{
                  height: item.height,
                  width: 'auto',
                  maxHeight: 26,
                  maxWidth: 65,
                  objectFit: 'contain',
                  filter: item.filter,
                  transition: 'all 0.25s ease'
                }}
              />
            </Box>
          </Tooltip>
        ))}
      </Box>

      {/* Security badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 2 }}>
        <SecurityIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', lineHeight: 1.3 }}>
          Pagos 100% seguros y encriptados
        </Typography>
      </Box>
    </Box>
  )
}

export default PaymentMethods
