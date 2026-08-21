'use client'

import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import withRoot from '@/modules/withRoot'

const WHATSAPP_PHONE = '573204842897'
const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=Hola%20Wavi%20Aeronautics%2C%20tengo%20una%20pregunta%20sobre%20un%20producto`

// Floating container for persistent bottom-right widget
const FloatingWhatsAppContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3.5),
  right: theme.spacing(3.5),
  zIndex: 1350,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  cursor: 'pointer',
  textDecoration: 'none',
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(2.5),
    right: theme.spacing(2.5),
    gap: theme.spacing(1)
  }
}))

// Floating pill badge with "¡Escríbenos aquí!"
const FloatingBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#ffffff',
  color: '#0f172a',
  padding: '8px 16px',
  borderRadius: '24px',
  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
  border: '1px solid rgba(37, 211, 102, 0.3)',
  fontWeight: 700,
  fontSize: '0.875rem',
  letterSpacing: '0.2px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  userSelect: 'none',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
    transform: 'translateX(-4px)'
  },
  [theme.breakpoints.down('sm')]: {
    padding: '6px 12px',
    fontSize: '0.8rem'
  }
}))

// Online pulse dot indicator
const OnlineDot = styled(Box)({
  width: 9,
  height: 9,
  backgroundColor: '#25D366',
  borderRadius: '50%',
  position: 'relative',
  boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)',
  animation: 'whatsappPulse 2s infinite',
  '@keyframes whatsappPulse': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)'
    },
    '70%': {
      boxShadow: '0 0 0 10px rgba(37, 211, 102, 0)'
    },
    '100%': {
      boxShadow: '0 0 0 0 rgba(37, 211, 102, 0)'
    }
  }
})

// Circular WhatsApp Floating Action Button
const FloatingWhatsAppButton = styled('a')(({ theme }) => ({
  width: 58,
  height: 58,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  textDecoration: 'none',
  border: '2px solid rgba(255, 255, 255, 0.85)',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
    boxShadow: '0 12px 30px rgba(37, 211, 102, 0.65)',
    background: 'linear-gradient(135deg, #2ae06d 0%, #149c8d 100%)'
  },
  '&:active': {
    transform: 'scale(0.95)'
  },
  [theme.breakpoints.down('sm')]: {
    width: 52,
    height: 52
  }
}))

function ProductSmokingHero() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/* ============================================================ */}
      {/* 1. SECCIÓN INFORMATIVA EN PÁGINA (HERO CALLOUT) */}
      {/* ============================================================ */}
      <Container
        component="section"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: { xs: 6, sm: 8 },
          textAlign: 'center'
        }}
      >
        <Box
          sx={{
            border: '3px solid #0f172a',
            borderRadius: 1,
            py: { xs: 2, sm: 2.5 },
            px: { xs: 3, sm: 5 },
            mb: 2.5,
            transition: 'all 0.25s ease',
            '&:hover': {
              borderColor: '#00aCe4',
              transform: 'scale(1.02)'
            }
          }}
        >
          <Typography
            variant="h4"
            component="span"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.25rem', sm: '1.75rem' },
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#0f172a'
            }}
          >
            ¿Tienes preguntas? ¿Buscas ayuda?
          </Typography>
        </Box>

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            fontSize: '1.1rem',
            color: '#334155',
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <ChatBubbleOutlineIcon sx={{ color: '#25D366' }} />
          ¡Escríbenos aquí! Asesoría personalizada por WhatsApp
        </Typography>

        <Button
          variant="contained"
          component="a"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<WhatsAppIcon sx={{ fontSize: '1.75rem !important' }} />}
          sx={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1rem',
            px: 4,
            py: 1.25,
            borderRadius: '28px',
            textTransform: 'none',
            boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #22c35e 0%, #0f7a6e 100%)',
              boxShadow: '0 8px 25px rgba(37, 211, 102, 0.5)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          Iniciar Conversación WhatsApp
        </Button>
      </Container>

      {/* ============================================================ */}
      {/* 2. BOTÓN FLOTANTE FIJADO EN LA ESQUINA INFERIOR DERECHA */}
      {/*    Visible todo el tiempo durante el scroll del usuario      */}
      {/* ============================================================ */}
      <FloatingWhatsAppContainer
        component="a"
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp - ¡Escríbenos aquí!"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Floating Pill Label */}
        <FloatingBadge sx={{ transform: isHovered ? 'scale(1.04)' : 'scale(1)' }}>
          <OnlineDot />
          <Typography
            component="span"
            sx={{
              fontWeight: 800,
              fontSize: 'inherit',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            ¡Escríbenos aquí!
          </Typography>
        </FloatingBadge>

        {/* WhatsApp Circular FAB */}
        <Tooltip title="Chatear con un asesor de Wavi Aeronautics" arrow placement="left">
          <FloatingWhatsAppButton
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Chat"
          >
            <WhatsAppIcon sx={{ fontSize: { xs: 30, sm: 34 } }} />
          </FloatingWhatsAppButton>
        </Tooltip>
      </FloatingWhatsAppContainer>
    </>
  )
}

export default withRoot(ProductSmokingHero)
