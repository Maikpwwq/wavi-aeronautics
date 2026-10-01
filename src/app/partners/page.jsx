'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Divider
} from '@mui/material'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'
import GavelIcon from '@mui/icons-material/Gavel'
import TerminalIcon from '@mui/icons-material/Terminal'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import HandshakeIcon from '@mui/icons-material/Handshake'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PublicIcon from '@mui/icons-material/Public'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import EmailIcon from '@mui/icons-material/Email'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import CloseIcon from '@mui/icons-material/Close'
import StorefrontIcon from '@mui/icons-material/Storefront'
import SchoolIcon from '@mui/icons-material/School'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import MarketDominationPanel from './components/MarketDominationPanel'

const BRAND_CYAN = '#00aCe4'
const BRAND_CYAN_LIGHT = '#38bdf8'
const BRAND_ORANGE = '#ff6f00'
const BG_DARK_ROOT = '#070b14'
const BG_SURFACE = '#0f172a'
const BG_CARD = 'rgba(15, 23, 42, 0.75)'
const BORDER_SUBTLE = 'rgba(255, 255, 255, 0.08)'
const BORDER_CYAN = 'rgba(0, 172, 228, 0.35)'

const CODE_DISPATCH_SNIPPET = `// B2B Automated Dropship & Micro-Stock Order Dispatch
const orderPayload = {
  partnerId: "brand_tier_1_global",
  market: "CO", // Colombia & Andean Region
  fulfillment: "B2B_DROPSHIP",
  compliance: {
    dianTariffStatus: "PRE_CLEARED_DDP",
    aerocivilRac100: "VERIFIED_OPERATOR"
  },
  items: [
    {
      sku: "BNF-O3-6S-HD",
      qty: 1,
      routing: "GLOBAL_FACTORY_WAREHOUSE",
      declaredValueUsd: 489.00
    },
    {
      sku: "PROP-51433-PC",
      qty: 50,
      routing: "BOGOTA_MICRO_STOCK_DEPOT",
      type: "MICRO_STOCK_EXPEDITED"
    }
  ],
  settlement: {
    collectedCurrency: "COP", // Domestic PSE / Local Gateway
    settlementCurrency: "USD", // Direct Wire / Brand Settlement
    fxRiskAssumedBy: "WAVI_AERONAUTICS"
  },
  customerNotification: {
    language: "ES-CO",
    trackingProvider: "WAVI_EXPEDITED_TRACKING"
  }
};

// Seamless API routing directly to global warehouse
await WaviCore.dispatchOrder(orderPayload);`

const CODE_WEBHOOK_SNIPPET = `// Inbound Webhook: Real-time Factory Status to Local Customer
{
  "event": "factory.order.dispatched",
  "partnerId": "brand_tier_1_global",
  "airwayBill": "HKG-BOG-98210492",
  "carrier": "FEDEX_AERO_PRIORITY",
  "origin": "SHENZHEN_HK_HUB",
  "destination": "BOGOTA_AIRPORT_DIAN",
  "customsBroker": "WAVI_LOGISTICS_HOLDINGS",
  "estimatedLocalClearance": "48_HOURS",
  "domesticHandover": "INTERRAPIDISIMO_NACIONAL"
}`

const FRICTION_POINTS = [
  {
    icon: SecurityIcon,
    iconColor: '#f43f5e',
    tag: 'CUSTOMS & DUTIES',
    title: 'DIAN Customs Holds & 32% Cart Abandonment',
    description:
      'Direct cross-border shipments to Colombia face arbitrary DIAN customs holds, unexpected import tariffs, and complex tax ID verification. Consumers abandon orders upon arrival or refuse surprise COD duty bills.'
  },
  {
    icon: SpeedIcon,
    iconColor: '#fb923c',
    tag: 'LOGISTIC DISCONNECT',
    title: 'The 20-Day Shipping Barrier for Consumables',
    description:
      'FPV pilots crash and need replacement propellers, ELRS receivers, antennas, and LiPos immediately. A 21-day shipping delay destroys customer retention and diverts demand to low-grade local knockoffs.'
  },
  {
    icon: AccountBalanceIcon,
    iconColor: '#38bdf8',
    tag: 'BANKING RAILS',
    title: 'Payment Gateway & Foreign Exchange Failures',
    description:
      'Over 70% of Colombian online purchases use PSE (instant domestic bank debits) or local credit installments. International Stripe or PayPal forms trigger high fraud decline rates and prohibitive FX currency fees.'
  },
  {
    icon: GavelIcon,
    iconColor: '#eab308',
    tag: 'LEGAL RESTRICTIONS',
    title: 'Civil Aviation Regulatory Hesitation (RAC 100)',
    description:
      'Commercial operators and prosumer cinematographers require verified Aerocivil RAC 100 compliance and local documentation. Overseas storefronts cannot offer regulatory peace of mind to corporate buyers.'
  }
]

const INFRASTRUCTURE_PILLARS = [
  {
    icon: TerminalIcon,
    title: 'API & Webhook Inventory Routing',
    description:
      'Modern Next.js/Firebase architecture ready to consume JSON/CSV inventory feeds and push automated B2B dropship orders directly to your factory or Hong Kong logistics facility without manual intervention.'
  },
  {
    icon: Inventory2Icon,
    title: 'Two-Tier Hybrid Fulfillment Engine',
    description:
      'We operate a dual logistics pipeline: rapid 24-72h domestic micro-stocking for high-rotation crash parts (props, ELRS, antennas, batteries) paired with frictionless white-glove curated import for high-ticket BNF models.'
  },
  {
    icon: SupportAgentIcon,
    title: 'Certified UAS Pilot Support in Spanish',
    description:
      'Our team consists of active, licensed drone pilots. We handle pre-purchase consultation, Betaflight/ELRS binding support, and warranty triage in native Spanish—reducing international RMA overhead to near zero.'
  }
]

const PARTNERSHIP_MODELS = [
  {
    title: 'Tier 1 B2B Dropship Pipeline',
    badge: 'ZERO INITIAL MOQ',
    badgeColor: BRAND_CYAN,
    highlight: 'Core Partnership Model',
    description:
      'Immediate catalog distribution across Colombia with zero inventory risk or capital lockup for your brand.',
    perks: [
      'Zero initial Minimum Order Quantity (MOQ) to launch.',
      'Automated routing of pre-orders directly to your global warehouse.',
      'Wavi absorbs all local payment processing, FX risk, and DIAN customs clearing.',
      'Dedicated brand showcase on waviaeronautics.com with SEO optimization.',
      'Bilingual technical support and post-sales triage managed locally.'
    ],
    ctaText: 'Apply for Tier 1 Dropship',
    ctaAction: 'dropship'
  },
  {
    title: 'Strategic Demo Sponsorship & Brand Authority',
    badge: 'EXPEDITE LOCAL REACH',
    badgeColor: '#a855f7',
    highlight: 'High Brand Visibility',
    description:
      'Field testing, sanctioned race track placement, and high-impact Spanish video content creation.',
    perks: [
      'Provision of flagship BNF units at manufacturing cost or sponsored allocation.',
      'Hands-on demonstrations at Colombian drone racing events and flight schools.',
      'High-resolution cinematic footage, flight logs, and YouTube review coverage.',
      'Direct affiliate referral tracking linked to your official global store.',
      'Community trust building among competitive pilots and enterprise cinematographers.'
    ],
    ctaText: 'Explore Demo Sponsorship',
    ctaAction: 'demo'
  },
  {
    title: 'Consumable Micro-Stocking Depot',
    badge: 'FAST 24-72H TURNAROUND',
    badgeColor: BRAND_ORANGE,
    highlight: 'Ecosystem Loyalty',
    description:
      'Local buffer stock of high-wear parts in Bogotá ensuring pilots never abandon your platform.',
    perks: [
      'Buffer inventory of props, antennas, ELRS receivers, and LiPo batteries.',
      'Same-day and 24-72h domestic dispatch across all major Colombian cities.',
      'Prevents pilots from switching to third-party clone parts after crashes.',
      'Predictable recurring re-orders based on seasonal telemetry data.',
      'Consignment or wholesale stock replenishment agreements.'
    ],
    ctaText: 'Request Stocking Terms',
    ctaAction: 'stocking'
  }
]

const MARKET_METRICS = [
  {
    stat: '52M+',
    label: 'Population',
    sublabel: '2nd largest Spanish-speaking market in South America'
  },
  {
    stat: '0 MOQ',
    label: 'Initial Barrier',
    sublabel: 'Zero capital or inventory commitment to validate'
  },
  {
    stat: '24-72h',
    label: 'Micro-Stock SLA',
    sublabel: 'Rapid nationwide delivery for high-rotation consumables'
  },
  {
    stat: '100%',
    label: 'Customs Shield',
    sublabel: 'Full DIAN and Aerocivil RAC 100 regulatory insulation'
  }
]

export default function PartnersPage() {
  const [activeCodeTab, setActiveCodeTab] = useState('payload')
  const [copiedCode, setCopiedCode] = useState(false)
  const [intakeOpen, setIntakeOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState('Tier 1 B2B Dropship Pipeline')
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [formData, setFormData] = useState({
    brandName: '',
    contactName: '',
    email: '',
    website: '',
    interestModel: 'Tier 1 B2B Dropship Pipeline',
    message: ''
  })

  const handleCopyCode = async () => {
    try {
      const codeToCopy = activeCodeTab === 'payload' ? CODE_DISPATCH_SNIPPET : CODE_WEBHOOK_SNIPPET
      await navigator.clipboard.writeText(codeToCopy)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch {
      // Fallback
      setCopiedCode(false)
    }
  }

  const handleOpenIntake = (modelName = 'Tier 1 B2B Dropship Pipeline') => {
    setSelectedModel(modelName)
    setFormData((prev) => ({ ...prev, interestModel: modelName }))
    setIntakeOpen(true)
  }

  const handleCloseIntake = () => {
    setIntakeOpen(false)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`B2B Partnership Inquiry - ${formData.brandName || 'Brand'}`)
    const body = encodeURIComponent(
      `Hello Wavi Aeronautics Team,\n\n` +
      `We are interested in discussing partnership opportunities with Wavi Aeronautics.\n\n` +
      `Brand Name: ${formData.brandName}\n` +
      `Contact Name: ${formData.contactName}\n` +
      `Business Email: ${formData.email}\n` +
      `Website / Catalog: ${formData.website}\n` +
      `Partnership Model: ${formData.interestModel}\n\n` +
      `Notes / Details:\n${formData.message}\n\n` +
      `Best regards,\n${formData.contactName}`
    )

    // Open mail client
    window.location.href = `mailto:director@waviaeronautics.com?subject=${subject}&body=${body}`

    setIntakeOpen(false)
    setSnackbarMessage('Partnership inquiry draft generated. Opening email client...')
  }

  return (
    <Box
      component="main"
      sx={{
        bgcolor: BG_DARK_ROOT,
        color: '#f8fafc',
        minHeight: '100vh',
        fontFamily: "'Work Sans', sans-serif",
        overflowX: 'hidden',
        position: 'relative'
      }}
    >
      {/* ── Background Cyber Ambient Glows ── */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 1400,
          height: 600,
          background: 'radial-gradient(ellipse at top, rgba(0, 172, 228, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* ── Top Navigation Bar ── */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          bgcolor: 'rgba(7, 11, 20, 0.82)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${BORDER_SUBTLE}`
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              height: { xs: 68, md: 76 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2
            }}
          >
            {/* Brand Logo & Portal Tag */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <RocketLaunchIcon sx={{ color: BRAND_CYAN, fontSize: 26, mr: 1 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: 2,
                    color: '#ffffff',
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    textTransform: 'uppercase'
                  }}
                >
                  WAVI
                  <Box component="span" sx={{ color: BRAND_CYAN, fontWeight: 400 }}>
                    AERONAUTICS
                  </Box>
                </Typography>
              </Link>
              <Chip
                label="B2B PARTNERS"
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 172, 228, 0.12)',
                  color: BRAND_CYAN_LIGHT,
                  border: `1px solid ${BORDER_CYAN}`,
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  letterSpacing: 1,
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
              />
            </Box>

            {/* Navigation Anchors */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 3
              }}
            >
              <Link
                href="#friction"
                style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8' }}
              >
                The Friction
              </Link>
              <Link
                href="#infrastructure"
                style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8' }}
              >
                Infrastructure & API
              </Link>
              <Link
                href="#partnership-models"
                style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8' }}
              >
                Partnership Models
              </Link>
              <Link
                href="#market-domination-panel"
                style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8' }}
              >
                Market Domination & CAC
              </Link>
              <Link
                href="/tienda"
                target="_blank"
                style={{
                  color: BRAND_CYAN_LIGHT,
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <StorefrontIcon sx={{ fontSize: 16 }} />
                Storefront
              </Link>
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                variant="outlined"
                component="a"
                href="mailto:director@waviaeronautics.com?subject=Partnership%20Inquiry%20-%20LatAm%20Expansion"
                sx={{
                  color: '#e2e8f0',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  px: { xs: 1.5, sm: 2 },
                  display: { xs: 'none', sm: 'inline-flex' },
                  '&:hover': {
                    borderColor: BRAND_CYAN,
                    bgcolor: 'rgba(0, 172, 228, 0.08)'
                  }
                }}
              >
                Direct Email
              </Button>
              <Button
                variant="contained"
                onClick={() => handleOpenIntake('Tier 1 B2B Dropship Pipeline')}
                sx={{
                  bgcolor: BRAND_CYAN,
                  color: '#070b14',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textTransform: 'none',
                  px: { xs: 2, sm: 2.5 },
                  py: 0.9,
                  borderRadius: 1.5,
                  boxShadow: '0 0 20px rgba(0, 172, 228, 0.35)',
                  '&:hover': {
                    bgcolor: '#38bdf8',
                    boxShadow: '0 0 25px rgba(56, 189, 248, 0.55)'
                  }
                }}
              >
                Connect with Director
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ── HERO SECTION ── */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          px: 2,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          {/* Eyebrow Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              borderRadius: 50,
              bgcolor: 'rgba(0, 172, 228, 0.08)',
              border: `1px solid ${BORDER_CYAN}`,
              mb: 4
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: BRAND_CYAN,
                boxShadow: `0 0 10px ${BRAND_CYAN}`
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: BRAND_CYAN_LIGHT,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                fontSize: '0.75rem'
              }}
            >
              LATAM EXPANSION GATEWAY • COLOMBIA LOGISTICS HUB
            </Typography>
          </Box>

          {/* Main Headline */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.4rem', sm: '3.4rem', md: '4.2rem' },
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.12,
              color: '#ffffff',
              mb: 3,
              textTransform: 'none'
            }}
          >
            Unlock the Colombian FPV Market.{' '}
            <Box
              component="span"
              sx={{
                display: 'block',
                background: 'linear-gradient(135deg, #00aCe4 0%, #38bdf8 50%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Zero Friction. Zero Initial MOQ.
            </Box>
          </Typography>

          {/* Subtitle / Pitch */}
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              color: '#94a3b8',
              lineHeight: 1.7,
              maxWidth: 760,
              mx: 'auto',
              mb: 5,
              textTransform: 'none'
            }}
          >
            Wavi Aeronautics is the authorized logistics, regulatory, and technical distribution bridge
            for tier-1 UAS manufacturers entering Latin America. We absorb DIAN customs volatility,
            eliminate cross-border payment friction, and route orders through automated dropship pipelines.
          </Typography>

          {/* CTA Group */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => handleOpenIntake('Tier 1 B2B Dropship Pipeline')}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: BRAND_CYAN,
                color: '#070b14',
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'none',
                px: 4,
                py: 1.6,
                borderRadius: 2,
                boxShadow: '0 0 25px rgba(0, 172, 228, 0.4)',
                '&:hover': {
                  bgcolor: '#38bdf8',
                  boxShadow: '0 0 35px rgba(56, 189, 248, 0.65)'
                }
              }}
            >
              Initiate Brand Partnership
            </Button>

            <Button
              variant="outlined"
              size="large"
              component="a"
              href="#infrastructure"
              sx={{
                color: '#e2e8f0',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                px: 3.5,
                py: 1.6,
                borderRadius: 2,
                '&:hover': {
                  borderColor: BRAND_CYAN,
                  bgcolor: 'rgba(0, 172, 228, 0.08)'
                }
              }}
            >
              Inspect API Infrastructure
            </Button>
          </Stack>

          {/* Quick Sub-note */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 3,
              color: '#64748b',
              fontSize: '0.8rem'
            }}
          >
            Approval for your Tier 1 Affiliate / B2B Dropship program • Rapid onboarding within 48 business hours
          </Typography>
        </Container>

        {/* ── Key Metrics Banner ── */}
        <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 10 } }}>
          <Box
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.6)',
              border: `1px solid ${BORDER_SUBTLE}`,
              borderRadius: 3,
              p: { xs: 3, md: 4 },
              backdropFilter: 'blur(10px)'
            }}
          >
            <Grid container spacing={3}>
              {MARKET_METRICS.map((item, idx) => (
                <Grid size={{ xs: 6, md: 3 }} key={idx}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.6rem' },
                        fontWeight: 900,
                        color: BRAND_CYAN_LIGHT,
                        letterSpacing: '-0.02em',
                        mb: 0.5
                      }}
                    >
                      {item.stat}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#f8fafc',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textTransform: 'none',
                        mb: 0.5
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#64748b',
                        fontSize: '0.75rem',
                        display: 'block',
                        lineHeight: 1.3
                      }}
                    >
                      {item.sublabel}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* ── SECTION: THE FRICTION ── */}
      <Box
        id="friction"
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: 'rgba(11, 17, 32, 0.85)',
          borderTop: `1px solid ${BORDER_SUBTLE}`,
          borderBottom: `1px solid ${BORDER_SUBTLE}`
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Chip
              label="THE LATAM BOTTLENECK"
              size="small"
              sx={{
                bgcolor: 'rgba(244, 63, 94, 0.1)',
                color: '#fb7185',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: 1.2,
                mb: 2
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.9rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 800,
                color: '#ffffff',
                mb: 2,
                textTransform: 'none'
              }}
            >
              Why Global Drone Brands Lose Colombian Market Share
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#94a3b8',
                maxWidth: 720,
                mx: 'auto',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                textTransform: 'none'
              }}
            >
              The barrier to Latin American scale is never pilot demand—it is localized friction.
              Overseas fulfillment centers are simply not equipped to resolve these four systemic issues:
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {FRICTION_POINTS.map((item, idx) => {
              const IconComp = item.icon
              return (
                <Grid size={{ xs: 12, sm: 6, md: 6 }} key={idx}>
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: BG_SURFACE,
                      border: `1px solid ${BORDER_SUBTLE}`,
                      borderRadius: 2.5,
                      transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: 'rgba(0, 172, 228, 0.4)',
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: 'rgba(0, 0, 0, 0.4)',
                            border: `1px solid ${BORDER_SUBTLE}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <IconComp sx={{ color: item.iconColor, fontSize: 26 }} />
                        </Box>
                        <Chip
                          label={item.tag}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            color: '#cbd5e1',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            letterSpacing: 0.8
                          }}
                        />
                      </Box>

                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: '#ffffff',
                          fontSize: '1.25rem',
                          mb: 1.5,
                          textTransform: 'none'
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#94a3b8',
                          lineHeight: 1.65,
                          fontSize: '0.92rem',
                          textTransform: 'none'
                        }}
                      >
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        </Container>
      </Box>

      {/* ── SECTION: THE INFRASTRUCTURE & CODE MOCK ── */}
      <Box
        id="infrastructure"
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 6, lg: 8 }} alignItems="center">
            {/* Left Column: Technical Muscle Description */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Chip
                label="THE WAVI INFRASTRUCTURE"
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 172, 228, 0.1)',
                  color: BRAND_CYAN_LIGHT,
                  border: `1px solid ${BORDER_CYAN}`,
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: 1.2,
                  mb: 2
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.9rem', sm: '2.5rem', md: '2.8rem' },
                  fontWeight: 800,
                  color: '#ffffff',
                  mb: 2.5,
                  textTransform: 'none'
                }}
              >
                Engineered for High-Speed Hardware Distribution
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#94a3b8',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  mb: 4,
                  textTransform: 'none'
                }}
              >
                We do not operate as an ad-hoc local reseller. Wavi Aeronautics builds the programmatic
                and operational rails that allow global manufacturers to plug directly into the Colombian
                market without logistical liability.
              </Typography>

              <Stack spacing={3.5}>
                {INFRASTRUCTURE_PILLARS.map((sol, idx) => {
                  const IconComp = sol.icon
                  return (
                    <Box key={idx} sx={{ display: 'flex', gap: 2.5 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2,
                          bgcolor: 'rgba(0, 172, 228, 0.12)',
                          border: `1px solid ${BORDER_CYAN}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          mt: 0.5
                        }}
                      >
                        <IconComp sx={{ color: BRAND_CYAN_LIGHT, fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            mb: 0.5,
                            textTransform: 'none'
                          }}
                        >
                          {sol.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#94a3b8',
                            lineHeight: 1.6,
                            fontSize: '0.9rem',
                            textTransform: 'none'
                          }}
                        >
                          {sol.description}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
              </Stack>
            </Grid>

            {/* Right Column: Interactive Code Terminal Window */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Box
                sx={{
                  bgcolor: '#090d16',
                  border: '1px solid rgba(0, 172, 228, 0.35)',
                  borderRadius: 3,
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), 0 0 30px rgba(0, 172, 228, 0.12)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Luminous Top Gradient Strip */}
                <Box
                  sx={{
                    height: 2,
                    background: 'linear-gradient(90deg, #00aCe4 0%, #38bdf8 50%, #818cf8 100%)'
                  }}
                />

                {/* macOS / Terminal Header Bar */}
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    bgcolor: 'rgba(15, 23, 42, 0.95)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Traffic Light Dots */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#ef4444' }} />
                    <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                    <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#10b981' }} />
                  </Stack>

                  {/* Tabs */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={() => setActiveCodeTab('payload')}
                      sx={{
                        color: activeCodeTab === 'payload' ? BRAND_CYAN_LIGHT : '#64748b',
                        bgcolor: activeCodeTab === 'payload' ? 'rgba(0, 172, 228, 0.12)' : 'transparent',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        px: 1.5,
                        py: 0.4,
                        borderRadius: 1
                      }}
                    >
                      order-dispatch.ts
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setActiveCodeTab('webhook')}
                      sx={{
                        color: activeCodeTab === 'webhook' ? BRAND_CYAN_LIGHT : '#64748b',
                        bgcolor: activeCodeTab === 'webhook' ? 'rgba(0, 172, 228, 0.12)' : 'transparent',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        px: 1.5,
                        py: 0.4,
                        borderRadius: 1
                      }}
                    >
                      webhook-event.json
                    </Button>
                  </Stack>

                  {/* Copy Button */}
                  <Tooltip title={copiedCode ? 'Copied to clipboard!' : 'Copy Code'}>
                    <IconButton
                      size="small"
                      onClick={handleCopyCode}
                      sx={{ color: copiedCode ? '#34d399' : '#94a3b8' }}
                      aria-label="Copy sample integration payload"
                    >
                      {copiedCode ? <CheckIcon sx={{ fontSize: 18 }} /> : <ContentCopyIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Code Body */}
                <Box
                  component="pre"
                  sx={{
                    m: 0,
                    p: { xs: 2, sm: 3 },
                    fontFamily: "'Roboto Mono', 'Fira Code', 'Courier New', monospace",
                    fontSize: { xs: '0.75rem', sm: '0.82rem' },
                    lineHeight: 1.6,
                    color: '#e2e8f0',
                    overflowX: 'auto',
                    bgcolor: '#070b14'
                  }}
                >
                  <code>
                    {activeCodeTab === 'payload' ? CODE_DISPATCH_SNIPPET : CODE_WEBHOOK_SNIPPET}
                  </code>
                </Box>

                {/* Subliminal Signal Footer */}
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    bgcolor: 'rgba(15, 23, 42, 0.7)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.72rem' }}>
                    REST API • Webhook Event Sync • Automated CSV Feeds
                  </Typography>
                  <Chip
                    label="READY FOR INTEGRATION"
                    size="small"
                    sx={{
                      height: 20,
                      bgcolor: 'rgba(52, 211, 153, 0.1)',
                      color: '#34d399',
                      fontSize: '0.62rem',
                      fontWeight: 700
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── SECTION: PARTNERSHIP ARCHITECTURES ── */}
      <Box
        id="partnership-models"
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: 'rgba(11, 17, 32, 0.85)',
          borderTop: `1px solid ${BORDER_SUBTLE}`,
          borderBottom: `1px solid ${BORDER_SUBTLE}`
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Chip
              label="COMMERCIAL ARCHITECTURES"
              size="small"
              sx={{
                bgcolor: 'rgba(0, 172, 228, 0.1)',
                color: BRAND_CYAN_LIGHT,
                border: `1px solid ${BORDER_CYAN}`,
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: 1.2,
                mb: 2
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.9rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 800,
                color: '#ffffff',
                mb: 2,
                textTransform: 'none'
              }}
            >
              Zero Initial MOQ. Scalable Partnership Models.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#94a3b8',
                maxWidth: 720,
                mx: 'auto',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                textTransform: 'none'
              }}
            >
              We do not ask for favors; we trade regional volume commitments and marketing visibility for
              direct manufacturer dropship access and wholesale terms.
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {PARTNERSHIP_MODELS.map((model, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: BG_SURFACE,
                    border: `1px solid ${idx === 0 ? BORDER_CYAN : BORDER_SUBTLE}`,
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.25s ease',
                    boxShadow: idx === 0 ? '0 0 25px rgba(0, 172, 228, 0.15)' : 'none',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      borderColor: BRAND_CYAN,
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)'
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 3.5 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Top Chips */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip
                        label={model.badge}
                        size="small"
                        sx={{
                          bgcolor: `${model.badgeColor}15`,
                          color: model.badgeColor,
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          border: `1px solid ${model.badgeColor}40`
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                        {model.highlight}
                      </Typography>
                    </Box>

                    {/* Model Title */}
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        color: '#ffffff',
                        fontSize: '1.35rem',
                        mb: 1.5,
                        textTransform: 'none'
                      }}
                    >
                      {model.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#94a3b8',
                        lineHeight: 1.6,
                        mb: 3,
                        textTransform: 'none'
                      }}
                    >
                      {model.description}
                    </Typography>

                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.07)', mb: 3 }} />

                    {/* Perks List */}
                    <Stack spacing={1.75} sx={{ mb: 4, flexGrow: 1 }}>
                      {model.perks.map((perk, pIdx) => (
                        <Box key={pIdx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <CheckCircleIcon sx={{ color: BRAND_CYAN, fontSize: 18, mt: '2px', flexShrink: 0 }} />
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#cbd5e1',
                              fontSize: '0.85rem',
                              lineHeight: 1.5,
                              textTransform: 'none'
                            }}
                          >
                            {perk}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    {/* Button */}
                    <Button
                      variant={idx === 0 ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => handleOpenIntake(model.title)}
                      sx={{
                        bgcolor: idx === 0 ? BRAND_CYAN : 'transparent',
                        color: idx === 0 ? '#070b14' : '#e2e8f0',
                        borderColor: idx === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
                        fontWeight: 700,
                        textTransform: 'none',
                        py: 1.3,
                        borderRadius: 1.5,
                        '&:hover': {
                          bgcolor: idx === 0 ? '#38bdf8' : 'rgba(0, 172, 228, 0.1)',
                          borderColor: BRAND_CYAN
                        }
                      }}
                    >
                      {model.ctaText}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── SECTION: MARKET DOMINATION & CAC ASYMMETRY PANEL ── */}
      <MarketDominationPanel
        onInitiateDeal={({ tier }) => {
          handleOpenIntake(`Inventory Sponsorship ($${tier.investmentAmountUsd.toLocaleString()} USD)`)
        }}
      />

      {/* ── SECTION: WHY COLOMBIA & ANDEAN HUB ── */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              bgcolor: BG_SURFACE,
              border: `1px solid ${BORDER_CYAN}`,
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(7, 11, 20, 0.95) 100%)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 7 }}>
                <Chip
                  label="REGIONAL MARKET FOOTPRINT"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(0, 172, 228, 0.12)',
                    color: BRAND_CYAN_LIGHT,
                    border: `1px solid ${BORDER_CYAN}`,
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    mb: 2
                  }}
                />
                <Typography
                  variant="h3"
                  sx={{
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: { xs: '1.8rem', md: '2.4rem' },
                    mb: 2,
                    textTransform: 'none'
                  }}
                >
                  The Strategic Andean Drone Corridor
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#94a3b8',
                    lineHeight: 1.7,
                    fontSize: '1rem',
                    mb: 3,
                    textTransform: 'none'
                  }}
                >
                  Colombia boasts one of the most dynamic aerial cinematography, agricultural inspection,
                  and competitive FPV communities across South America. With zero domestic drone hardware
                  fabrication, local pilots and commercial enterprises rely entirely on premium overseas brands.
                </Typography>

                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: BRAND_CYAN, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                      <strong>Bogotá Air Logistics Hub:</strong> Direct air cargo transit from Miami (MIA) and Hong Kong (HKG).
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: BRAND_CYAN, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                      <strong>Active Community Footprint:</strong> Weekly flight sessions, sanctioned racing tournaments, and cinema workshops.
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: BRAND_CYAN, fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                      <strong>Andean Springboard:</strong> Established route for expansion into Ecuador, Peru, and Central America.
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  sx={{
                    p: 3.5,
                    borderRadius: 3,
                    bgcolor: 'rgba(7, 11, 20, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center'
                  }}
                >
                  <PublicIcon sx={{ color: BRAND_CYAN, fontSize: 50, mb: 1.5 }} />
                  <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mb: 1, textTransform: 'none' }}>
                    Zero-Friction Manufacturer Onboarding
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, lineHeight: 1.6, textTransform: 'none' }}>
                    Send us your product feed or affiliate/dropship partner agreement. We handle localization,
                    payment integration, and local pilot acquisition.
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleOpenIntake('Strategic Andean Corridor Partnership')}
                    sx={{
                      bgcolor: BRAND_CYAN,
                      color: '#070b14',
                      fontWeight: 700,
                      textTransform: 'none',
                      py: 1.3,
                      borderRadius: 1.5,
                      '&:hover': { bgcolor: '#38bdf8' }
                    }}
                  >
                    Open Partnership Dialogue
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* ── SECTION: FINAL CTA ── */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: '#070b14',
          borderTop: `1px solid ${BORDER_SUBTLE}`,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.4rem' },
              fontWeight: 900,
              color: '#ffffff',
              mb: 2.5,
              textTransform: 'none'
            }}
          >
            Stop Losing LatAm Market Share to Logistics.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#94a3b8',
              fontSize: '1.15rem',
              lineHeight: 1.7,
              maxWidth: 680,
              mx: 'auto',
              mb: 5,
              textTransform: 'none'
            }}
          >
            Connect with our Project Director for a 15-minute technical alignment call. We will review
            your catalog, configure your dropship API credentials, and activate your Colombian pipeline.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => handleOpenIntake('General B2B Inquiry')}
              startIcon={<HandshakeIcon />}
              sx={{
                bgcolor: '#ffffff',
                color: '#070b14',
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'none',
                px: 4,
                py: 1.6,
                borderRadius: 2,
                boxShadow: '0 0 25px rgba(255, 255, 255, 0.25)',
                '&:hover': {
                  bgcolor: '#e2e8f0',
                  boxShadow: '0 0 35px rgba(255, 255, 255, 0.45)'
                }
              }}
            >
              Initiate Partnership
            </Button>

            <Button
              variant="outlined"
              size="large"
              component="a"
              href="https://api.whatsapp.com/send?phone=573204842897&text=Hello%20Wavi%20Aeronautics%2C%20we%20are%20interested%20in%20discussing%20a%20B2B%20Tier-1%20manufacturer%20partnership."
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<WhatsAppIcon sx={{ color: '#25d366' }} />}
              sx={{
                color: '#e2e8f0',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                px: 3.5,
                py: 1.6,
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#25d366',
                  bgcolor: 'rgba(37, 211, 102, 0.08)'
                }
              }}
            >
              Direct WhatsApp Hotline
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* ── B2B PARTNER INTAKE DIALOG ── */}
      <Dialog
        open={intakeOpen}
        onClose={handleCloseIntake}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: BG_SURFACE,
            color: '#ffffff',
            border: `1px solid ${BORDER_CYAN}`,
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', textTransform: 'none' }}>
              B2B Partner Intake & Alignment
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Wavi Aeronautics • Latin America Distribution Hub
            </Typography>
          </Box>
          <IconButton onClick={handleCloseIntake} sx={{ color: '#94a3b8' }} aria-label="Close dialog">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Brand / Manufacturer Name"
              name="brandName"
              required
              fullWidth
              value={formData.brandName}
              onChange={handleFormChange}
              placeholder="e.g. GEPRC, iFlight, RadioMaster, Caddx..."
              InputLabelProps={{ sx: { color: '#94a3b8' } }}
              InputProps={{ sx: { color: '#ffffff', bgcolor: 'rgba(0, 0, 0, 0.3)' } }}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Contact Person & Title"
                  name="contactName"
                  required
                  fullWidth
                  value={formData.contactName}
                  onChange={handleFormChange}
                  placeholder="e.g. Alex Zhang, Sales Director"
                  InputLabelProps={{ sx: { color: '#94a3b8' } }}
                  InputProps={{ sx: { color: '#ffffff', bgcolor: 'rgba(0, 0, 0, 0.3)' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Official Business Email"
                  name="email"
                  type="email"
                  required
                  fullWidth
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="partner@yourbrand.com"
                  InputLabelProps={{ sx: { color: '#94a3b8' } }}
                  InputProps={{ sx: { color: '#ffffff', bgcolor: 'rgba(0, 0, 0, 0.3)' } }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Website or Product Catalog URL"
              name="website"
              fullWidth
              value={formData.website}
              onChange={handleFormChange}
              placeholder="https://yourbrand.com"
              InputLabelProps={{ sx: { color: '#94a3b8' } }}
              InputProps={{ sx: { color: '#ffffff', bgcolor: 'rgba(0, 0, 0, 0.3)' } }}
            />

            <TextField
              select
              label="Preferred Partnership Architecture"
              name="interestModel"
              fullWidth
              value={formData.interestModel}
              onChange={handleFormChange}
              InputLabelProps={{ sx: { color: '#94a3b8' } }}
              InputProps={{ sx: { color: '#ffffff', bgcolor: 'rgba(0, 0, 0, 0.3)' } }}
            >
              <MenuItem value="Tier 1 B2B Dropship Pipeline">Tier 1 B2B Dropship Pipeline (Zero Initial MOQ)</MenuItem>
              <MenuItem value="Strategic Demo Sponsorship & Brand Authority">Strategic Demo Sponsorship & Brand Authority</MenuItem>
              <MenuItem value="Consumable Micro-Stocking Depot">Consumable Micro-Stocking Depot (Props/ELRS/LiPos)</MenuItem>
              <MenuItem value="Comprehensive Hybrid Partnership">Comprehensive Hybrid Partnership</MenuItem>
            </TextField>

            <TextField
              label="Proposal Notes / Catalog Focus"
              name="message"
              multiline
              rows={3}
              fullWidth
              value={formData.message}
              onChange={handleFormChange}
              placeholder="Brief details about your product range (BNF cinewhoops, electronics, VToLs, accessories)..."
              InputLabelProps={{ sx: { color: '#94a3b8' } }}
              InputProps={{ sx: { color: '#ffffff', bgcolor: 'rgba(0, 0, 0, 0.3)' } }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1.5 }}>
            <Button onClick={handleCloseIntake} sx={{ color: '#94a3b8', textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: BRAND_CYAN,
                color: '#070b14',
                fontWeight: 700,
                textTransform: 'none',
                px: 3,
                py: 1,
                '&:hover': { bgcolor: '#38bdf8' }
              }}
            >
              Generate Inquiry & Connect
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* ── FOOTER ── */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#04070d',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          py: 6,
          px: 2
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 3,
              mb: 4
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <RocketLaunchIcon sx={{ color: BRAND_CYAN, fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', letterSpacing: 1.5 }}>
                  WAVI AERONAUTICS
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 440 }}>
                Licensed UAS Operations & Technical Distribution. Aerocivil RAC 100 Compliant.
                Headquarters in Bogotá D.C., Colombia.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <Link
                href="/tienda"
                style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <StorefrontIcon sx={{ fontSize: 16 }} />
                Consumer Storefront
              </Link>
              <Link
                href="/escuela"
                style={{
                  color: '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <SchoolIcon sx={{ fontSize: 16 }} />
                FPV Flight Academy
              </Link>
              <Link
                href="/politica-de-privacidad"
                style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}
              >
                Privacy Policy
              </Link>
              <Link
                href="/condiciones-del-servicio"
                style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}
              >
                Terms of Service
              </Link>
            </Stack>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)', mb: 3 }} />

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Typography variant="caption" sx={{ color: '#475569' }}>
              © {new Date().getFullYear()} Wavi Aeronautics. All rights reserved. B2B Manufacturer Division.
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569' }}>
              Director Desk: director@waviaeronautics.com • Bogotá, Colombia (UTC-5)
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ── Snackbar Notifications ── */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarMessage('')} sx={{ bgcolor: '#0f172a', color: '#38bdf8' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
