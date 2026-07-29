'use client'

import React from 'react'
import Link from 'next/link'
import withRoot from '../withRoot'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '../components/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import PaymentMethods from '../components/PaymentMethods'

const socialLinks = [
  {
    label: 'WhatsApp',
    href: 'https://api.whatsapp.com/send?phone=573204842897',
    icon: WhatsAppIcon,
    hoverColor: '#25D366',
    hoverBg: 'rgba(37, 211, 102, 0.15)'
  },
  {
    label: 'Instagram @wavi.aeronautics',
    href: 'https://www.instagram.com/wavi.aeronautics/',
    icon: InstagramIcon,
    hoverColor: '#E1306C',
    hoverBg: 'rgba(225, 48, 108, 0.15)'
  },
  {
    label: 'Facebook @wavi.aeronautics',
    href: 'https://www.facebook.com/wavi.aeronautics/',
    icon: FacebookIcon,
    hoverColor: '#1877F2',
    hoverBg: 'rgba(24, 119, 242, 0.15)'
  }
]

const legalLinks = [
  { label: 'Términos y Condiciones', href: '/condiciones-del-servicio' },
  { label: 'Política de Privacidad', href: '/politica-de-privacidad' },
  { label: 'Política de Envíos', href: '/politica-de-envios' },
  { label: 'Política de Garantía', href: '/politica-de-garantia' },
  { label: 'Política de Reembolso', href: '/politica-de-reembolso' },
  { label: 'Política de Devoluciones', href: '/politica-de-devoluciones' }
]

function AppFooter () {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1e1e1f',
        color: 'rgba(255, 255, 255, 0.85)',
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 5 }
      }}
    >
      <Container maxWidth="lg">
        {/* === Three-Column Row === */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
            gap: { xs: 5, md: 6 }
          }}
        >
          {/* ── Column 1: Social ── */}
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
              Síguenos
            </Typography>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Tooltip key={social.label} title={social.label} arrow>
                    <IconButton
                      component="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          color: social.hoverColor,
                          transform: 'translateY(-2px) scale(1.1)',
                          bgcolor: social.hoverBg
                        }
                      }}
                    >
                      <Icon />
                    </IconButton>
                  </Tooltip>
                )
              })}
            </Box>

            <Typography
              variant="caption"
              sx={{ display: 'block', mt: 2, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, maxWidth: 220 }}
            >
              Tecnología aérea, drones y accesorios con envío internacional a Colombia.
            </Typography>
          </Box>

          {/* ── Column 2: Legal ── */}
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
              Documentación Legal
            </Typography>

            <Box component="nav" aria-label="Documentación legal">
              <Box
                component="ul"
                sx={{
                  m: 0,
                  p: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.75
                }}
              >
                {legalLinks.map((link) => (
                  <Box component="li" key={link.href}>
                    <Link
                      href={link.href}
                      style={{
                        color: 'rgba(255, 255, 255, 0.65)',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#00aCe4' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)' }}
                    >
                      {link.label}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* ── Column 3: Payment Methods ── */}
          <Box>
            <PaymentMethods />
          </Box>
        </Box>

        {/* === Copyright bar === */}
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mt: { xs: 5, md: 6 }, mb: 3 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            gap: 1
          }}
        >
          <Link
            href="https://maikpwwq.github.io/wavi-aeronautics/"
            style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.8rem' }}
          >
            Wavi Aeronautics © {new Date().getFullYear()}
          </Link>

          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
            Todos los derechos reservados
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default withRoot(AppFooter)
