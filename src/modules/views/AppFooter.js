'use client'

import React from 'react'
import Link from 'next/link'
import withRoot from '@/modules/withRoot'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@/modules/components/Typography'
import Divider from '@mui/material/Divider'
import PaymentMethods from '@/modules/components/PaymentMethods'
import SocialContactIcons from '@/modules/components/SocialContactIcons'

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

            <SocialContactIcons size="medium" color="rgba(255, 255, 255, 0.7)" />

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
