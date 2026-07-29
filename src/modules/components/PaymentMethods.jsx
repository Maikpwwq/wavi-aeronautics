'use client'

import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import SecurityIcon from '@mui/icons-material/Security'

/**
 * PaymentMethods — displays accepted payment method logos in the footer.
 * Uses the official Mercado Pago horizontal color SVG on a white rounded
 * container (per MP brand guidelines: min 60px height, protection area respected).
 */
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
          p: 1.5,
          mb: 2,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 180
        }}
      >
        <Box
          component="img"
          src="/static/logos/mercadopago-horizontal.svg"
          alt="Mercado Pago"
          sx={{
            height: 36,
            width: 'auto',
            display: 'block'
          }}
        />
      </Box>

      {/* Additional payment methods */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {/* PSE */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'rgba(255,255,255,0.08)',
            borderRadius: 1.5,
            px: 1.5,
            py: 0.75,
            transition: 'background-color 0.2s ease',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.14)' }
          }}
        >
          <AccountBalanceIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: 0.5 }}>
            PSE
          </Typography>
        </Box>

        {/* Credit / Debit Cards */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            bgcolor: 'rgba(255,255,255,0.08)',
            borderRadius: 1.5,
            px: 1.5,
            py: 0.75,
            transition: 'background-color 0.2s ease',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.14)' }
          }}
        >
          <CreditCardIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, letterSpacing: 0.5 }}>
            Tarjetas
          </Typography>
        </Box>
      </Box>

      {/* Security badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.5 }}>
        <SecurityIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', lineHeight: 1.3 }}>
          Pagos 100% seguros
        </Typography>
      </Box>
    </Box>
  )
}

export default PaymentMethods
