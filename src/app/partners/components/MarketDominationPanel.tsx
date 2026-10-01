'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SecurityIcon from '@mui/icons-material/Security'
import BoltIcon from '@mui/icons-material/Bolt'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import SpeedIcon from '@mui/icons-material/Speed'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SearchIcon from '@mui/icons-material/Search'

import type {
  CompetitorTrafficProfile,
  CacComparisonModel,
  TargetInventoryItem,
  SponsorshipTier,
  ReturnMechanismContract
} from '@/types/market'

const BRAND_CYAN = '#00aCe4'
const BRAND_CYAN_GLOW = '#38bdf8'
const BRAND_ORANGE = '#ff6f00'
const BRAND_ORANGE_GLOW = '#fb923c'
const BRAND_GREEN = '#10b981'
const BG_CARD = 'rgba(15, 23, 42, 0.85)'
const BORDER_SUBTLE = 'rgba(255, 255, 255, 0.08)'
const BORDER_CYAN = 'rgba(0, 172, 228, 0.35)'
const BORDER_ORANGE = 'rgba(255, 111, 0, 0.4)'

// Deterministic US number formatting for currency and metrics
const fmt = (n: number) => n.toLocaleString('en-US')

// ── 1. DATA: COMPETITOR AUDIT (EL VACÍO TÉCNICO) ──
const COMPETITOR_AUDIT: CompetitorTrafficProfile[] = [
  {
    name: 'JuandaStoreRC',
    type: 'legacy_storefront',
    costPerClickUsd: 1.85,
    estimatedMonthlyAdSpendUsd: 850,
    conversionRate: 1.2,
    infrastructureAudit: 'Catálogo legacy estático. Pedidos manuales por WhatsApp. Sin sincronización de inventario en tiempo real ni integración API.',
    cartAbandonmentRate: 74
  },
  {
    name: 'JJTronicShop',
    type: 'legacy_storefront',
    costPerClickUsd: 2.15,
    estimatedMonthlyAdSpendUsd: 1200,
    conversionRate: 1.4,
    infrastructureAudit: 'Tienda generalista de electrónica no especializada en FPV. Cero validación de protocolos de radio ni soporte de firmware.',
    cartAbandonmentRate: 68
  },
  {
    name: 'Wavi Aeronautics',
    type: 'wavi_technical_moat',
    costPerClickUsd: 0.0,
    estimatedMonthlyAdSpendUsd: 0,
    conversionRate: 4.8,
    infrastructureAudit: 'Infraestructura Next.js 16 + Dropship API. Micro-stocking local (24-72h) y asesoría técnica por pilotos certificados de UAS.',
    cartAbandonmentRate: 22
  }
]

// ── 2. DATA: CAC ASYMMETRY COMPARISON ──
const CAC_MODELS: CacComparisonModel[] = [
  {
    channelName: 'Pauta Transaccional Paga (Competencia)',
    costPerClick: 2.4,
    cacPerCustomer: 38.5,
    averageOrderValue: 72.0,
    paybackPeriodDays: 65,
    sustainabilityScore: 28,
    colorAccent: '#f43f5e'
  },
  {
    channelName: 'Canal Orgánico Wavi (Infraestructura Técnica)',
    costPerClick: 0.0,
    cacPerCustomer: 0.0,
    averageOrderValue: 124.0,
    paybackPeriodDays: 0,
    sustainabilityScore: 96,
    colorAccent: BRAND_CYAN_GLOW
  }
]

// ── 3. DATA: TARGET INVENTORY (HIGH VELOCITY CONSUMABLES) ──
const TARGET_INVENTORY: TargetInventoryItem[] = [
  {
    id: 'inv-rm-er',
    sku: 'RM-ER-ELRS-SYS',
    name: 'Receptores RadioMaster Serie ER (ELRS)',
    category: 'receivers',
    technicalSpecification: 'Módulos ER4, ER6-G y ER8 con telemetría de alto alcance y PWM nativo para quads de carreras y plataformas VToL.',
    rotationVelocityDays: 14,
    grossMarginPercent: 38,
    unitCostUsd: 22.5,
    marketDemandTier: 'CRITICAL_DAILY_ROTATION'
  },
  {
    id: 'inv-lipo-6s',
    sku: 'LIPO-6S-1500-140C',
    name: 'Baterías LiPo Alta Tasa de Descarga (6S 1300-1500mAh)',
    category: 'lipo_batteries',
    technicalSpecification: 'Celdas 130C-150C para freestyle de alta demanda. Consumible de desgaste térmico continuo (4-8 packs por piloto al mes).',
    rotationVelocityDays: 10,
    grossMarginPercent: 42,
    unitCostUsd: 34.0,
    marketDemandTier: 'CRITICAL_DAILY_ROTATION'
  },
  {
    id: 'inv-blade-ex5',
    sku: 'PROP-EX5-TWIN-REP',
    name: 'Reposición de Palas Individuales EX5 (Twin-Blade)',
    category: 'individual_rotor_blades',
    technicalSpecification: 'Configuración técnica de dos palas independientes por rotor para plataformas cinemáticas tipo EX5. Sustitución inmediata tras colisión.',
    rotationVelocityDays: 7,
    grossMarginPercent: 55,
    unitCostUsd: 4.8,
    marketDemandTier: 'HIGH_ACCIDENT_REPLACEMENT'
  }
]

// ── 4. DATA: SPONSORSHIP TIERS ──
const SPONSORSHIP_TIERS: SponsorshipTier[] = [
  {
    id: 'tier-pilot',
    investmentAmountUsd: 2500,
    targetedImpressions: 55000,
    projectedAnnualRoiPercent: 260,
    monthlyInventoryTurns: 2.2,
    capitalRecoveryPeriodMonths: 3.8,
    recommendedInventoryMix: '60% Palas EX5, 40% Receptores ER'
  },
  {
    id: 'tier-dominance',
    investmentAmountUsd: 5000,
    targetedImpressions: 120000,
    projectedAnnualRoiPercent: 312,
    monthlyInventoryTurns: 2.8,
    capitalRecoveryPeriodMonths: 4.2,
    recommendedInventoryMix: '40% LiPos 6S, 35% Receptores ER, 25% Palas EX5'
  },
  {
    id: 'tier-institutional',
    investmentAmountUsd: 10000,
    targetedImpressions: 260000,
    projectedAnnualRoiPercent: 348,
    monthlyInventoryTurns: 3.1,
    capitalRecoveryPeriodMonths: 4.5,
    recommendedInventoryMix: '50% LiPos 6S, 30% Receptores ER, 20% Palas EX5'
  }
]

// ── 5. DATA: CONTRACT TERMS ──
const CONTRACT_TERMS: ReturnMechanismContract = {
  equityDilutionPercent: 0,
  controlRetentionPercent: 100,
  capitalRepaymentStructure: 'Retorno continuo del 100% del principal inyectado + rendimiento preferente fijo por cada transacción liquidada.',
  fixedYieldPerTransactionPercent: 18.5,
  liquidationHurdleRatePercent: 24.0,
  inventoryAllocationMandate: 'Capital asignado estrictamente a inventario de hardware crítico de reposición diaria.'
}

interface MarketDominationPanelProps {
  onSelectTier?: (tier: SponsorshipTier) => void
  onInitiateDeal?: (details: { tier: SponsorshipTier; notes: string }) => void
}

export default function MarketDominationPanel({
  onSelectTier,
  onInitiateDeal
}: MarketDominationPanelProps) {
  const [selectedTierId, setSelectedTierId] = useState<string>('tier-dominance')
  const [activeInventoryTab, setActiveInventoryTab] = useState<string>('all')

  const currentTier =
    SPONSORSHIP_TIERS.find((t) => t.id === selectedTierId) || SPONSORSHIP_TIERS[1]

  const filteredInventory =
    activeInventoryTab === 'all'
      ? TARGET_INVENTORY
      : TARGET_INVENTORY.filter((item) => item.category === activeInventoryTab)

  const handleTierChange = (tier: SponsorshipTier) => {
    setSelectedTierId(tier.id)
    if (onSelectTier) onSelectTier(tier)
  }

  const handleDealAction = () => {
    if (onInitiateDeal) {
      onInitiateDeal({
        tier: currentTier,
        notes: `Solicitud de Term Sheet para patrocinio de $${fmt(currentTier.investmentAmountUsd)} USD.`
      })
    } else {
      const subject = encodeURIComponent(
        `Term Sheet Request - Inventory Sponsorship ($${fmt(currentTier.investmentAmountUsd)} USD)`
      )
      const body = encodeURIComponent(
        `Hola Wavi Aeronautics,\n\n` +
          `Deseamos solicitar el Term Sheet detallado para el modelo de patrocinio de hardware de alta rotación (Cero Equity):\n\n` +
          `- Nivel Seleccionado: $${fmt(currentTier.investmentAmountUsd)} USD\n` +
          `- Impresiones Estimadas: ${fmt(currentTier.targetedImpressions)}\n` +
          `- ROI Proyectado: ${currentTier.projectedAnnualRoiPercent}%\n` +
          `- Mix Recomendado: ${currentTier.recommendedInventoryMix}\n\n` +
          `Quedamos atentos a coordinar una llamada de alineación técnica con el Director de Proyecto.`
      )
      window.location.href = `mailto:director@waviaeronautics.com?subject=${subject}&body=${body}`
    }
  }

  return (
    <Box
      id="market-domination-panel"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, sm: 3, md: 4 },
        bgcolor: '#050811',
        borderTop: `1px solid ${BORDER_CYAN}`,
        borderBottom: `1px solid ${BORDER_SUBTLE}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* ── Background Ambient Accent Line ── */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: 1,
          background: `radial-gradient(ellipse at center, ${BRAND_CYAN} 0%, rgba(0,0,0,0) 75%)`,
          pointerEvents: 'none'
        }}
      />

      <Box sx={{ maxWidth: 1240, mx: 'auto' }}>
        {/* ── SECTION HEADER ── */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Chip
            icon={<AutoGraphIcon sx={{ color: `${BRAND_CYAN} !important`, fontSize: 16 }} />}
            label="DATA DE DOMINIO DE MERCADO & ASIMETRÍA DEL CAC"
            size="small"
            sx={{
              bgcolor: 'rgba(0, 172, 228, 0.1)',
              color: BRAND_CYAN_GLOW,
              border: `1px solid ${BORDER_CYAN}`,
              fontWeight: 800,
              fontSize: '0.72rem',
              letterSpacing: 1.4,
              px: 1,
              py: 1.8,
              mb: 2.5
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.3rem' },
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              mb: 2,
              textTransform: 'none'
            }}
          >
            Market Domination Panel
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#94a3b8',
              fontSize: { xs: '1rem', md: '1.15rem' },
              maxWidth: 780,
              mx: 'auto',
              lineHeight: 1.7,
              textTransform: 'none'
            }}
          >
            Análisis cuantitativo de la oportunidad FPV en Colombia: explotación del vacío técnico,
            asimetría radical del CAC orgánico y mecanismo de patrocinio con 0% de dilución accionaria.
          </Typography>
        </Box>

        {/* ── 1. BLOQUE: EL VACÍO TÉCNICO ── */}
        <Box
          sx={{
            mb: { xs: 8, md: 10 },
            p: { xs: 3.5, sm: 4.5, md: 5 },
            bgcolor: BG_CARD,
            borderRadius: 3.5,
            border: `1px solid ${BORDER_CYAN}`,
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: 'rgba(0, 172, 228, 0.15)',
                  border: `1px solid ${BORDER_CYAN}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <SpeedIcon sx={{ color: BRAND_CYAN_GLOW, fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: '#ffffff',
                    fontSize: { xs: '1.25rem', md: '1.45rem' },
                    textTransform: 'none'
                  }}
                >
                  1. El Vacío Técnico (Contexto del Mercado)
                </Typography>
                <Typography variant="caption" sx={{ color: BRAND_CYAN_GLOW, fontWeight: 700 }}>
                  MONOPOLIZACIÓN DE DEMANDA ORGÁNICA HUÉRFANA
                </Typography>
              </Box>
            </Box>

            <Chip
              label="TRÁFICO DISPONIBLE: 92%"
              size="small"
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.12)',
                color: BRAND_GREEN,
                border: '1px solid rgba(16, 185, 129, 0.35)',
                fontWeight: 800,
                fontSize: '0.72rem',
                letterSpacing: 1
              }}
            />
          </Box>

          {/* Cita Central y Argumentación del Mercado */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2.5,
              bgcolor: 'rgba(7, 11, 20, 0.7)',
              borderLeft: `4px solid ${BRAND_CYAN}`,
              mb: 4
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: '#e2e8f0',
                fontSize: { xs: '0.98rem', md: '1.1rem' },
                lineHeight: 1.75,
                fontWeight: 500,
                textTransform: 'none'
              }}
            >
              &ldquo;El mercado FPV en Colombia no está saturado; está digitalmente abandonado. La
              intención de compra transaccional recae sobre solo dos tiendas legacy (JuandaStoreRC,
              jjtronicshop) con infraestructuras limitadas y nula integración técnica. Wavi Aeronautics no
              pelea por márgenes en un espacio abarrotado; entra a monopolizar un vacío técnico capturando
              el tráfico huérfano.&rdquo;
            </Typography>
          </Box>

          {/* ── Evidencia Visual SERP en Vivo (Google Colombia) ── */}
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 2.5,
              bgcolor: 'rgba(10, 14, 26, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              mb: 3.5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: 0.8 }}>
                  EVIDENCIA REAL DE BÚSQUEDA ORGÁNICA: GOOGLE SERP (COLOMBIA)
                </Typography>
              </Box>
              <Chip
                label="DUOPOLIO LEGACY ACTIVO"
                size="small"
                sx={{ bgcolor: 'rgba(255, 111, 0, 0.15)', color: BRAND_ORANGE_GLOW, fontSize: '0.62rem', fontWeight: 800 }}
              />
            </Box>

            {/* Mocked Search Bar */}
            <Box
              sx={{
                px: 2,
                py: 0.9,
                borderRadius: 50,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2.5
              }}
            >
              <Typography sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}>
                🔍 &quot;FPV Colombia&quot;
              </Typography>
              <Chip label="Búsqueda Transaccional Primaria" size="small" sx={{ height: 20, fontSize: '0.62rem', bgcolor: 'rgba(0, 172, 228, 0.15)', color: BRAND_CYAN_GLOW }} />
            </Box>

            {/* SERP Competitors Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {/* JJtronicshop */}
              <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.4)', borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                  https://jjtronicshop.com
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#93c5fd', fontWeight: 700, mb: 0.5 }}>
                  JJtronicshop | Drones FPV y Accesorios en Colombia
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', lineHeight: 1.4 }}>
                  &quot;Tienda FPV en Colombia: drones armados, baterias LiPo, radios y gafas FPV. Asesoria personalizada, envio nacional y garantia en todos los productos. Entrega por $15 k&quot;
                </Typography>
                <Typography variant="caption" sx={{ color: '#f43f5e', fontWeight: 700, display: 'block', mt: 1 }}>
                  ⚠️ Fricción: Sin API ni checkout directo, catálogo estático, sin soporte de firmware especializado.
                </Typography>
              </Box>

              {/* JuandaStore RC */}
              <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.4)', borderRadius: 2, border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
                  https://www.juandastorerc.com
                </Typography>
                <Typography variant="subtitle2" sx={{ color: '#93c5fd', fontWeight: 700, mb: 0.5 }}>
                  JuandaStore RC | Todo para drones FPV y radio control en ...
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', lineHeight: 1.4 }}>
                  &quot;Todo para drones FPV y radio control en Colombia - Tienda online de drones de carreras y Freestyle. Envíos al resto del país por sólo $22.000=&quot;
                </Typography>
                <Typography variant="caption" sx={{ color: '#f43f5e', fontWeight: 700, display: 'block', mt: 1 }}>
                  ⚠️ Fricción: Envíos manuales, coordinación por WhatsApp, sin stock express de consumibles críticos.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Audit Grid (CSS Grid puro) */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2.5
            }}
          >
            {COMPETITOR_AUDIT.map((item, idx) => {
              const isWavi = item.type === 'wavi_technical_moat'
              return (
                <Box
                  key={idx}
                  sx={{
                    p: 3,
                    borderRadius: 2.5,
                    bgcolor: isWavi ? 'rgba(0, 172, 228, 0.06)' : 'rgba(10, 14, 26, 0.65)',
                    border: `1px solid ${isWavi ? BORDER_CYAN : BORDER_SUBTLE}`,
                    position: 'relative',
                    transition: 'all 0.25s ease',
                    boxShadow: isWavi ? '0 0 25px rgba(0, 172, 228, 0.12)' : 'none',
                    '&:hover': {
                      borderColor: isWavi ? BRAND_CYAN_GLOW : 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        fontSize: '1.08rem',
                        color: isWavi ? '#ffffff' : '#94a3b8',
                        textTransform: 'none'
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Chip
                      label={isWavi ? 'INFRAESTRUCTURA TÉCNICA' : 'LEGACY RESELLER'}
                      size="small"
                      sx={{
                        bgcolor: isWavi ? 'rgba(0, 172, 228, 0.15)' : 'rgba(244, 63, 94, 0.12)',
                        color: isWavi ? BRAND_CYAN_GLOW : '#fb7185',
                        border: `1px solid ${isWavi ? BORDER_CYAN : 'rgba(244, 63, 94, 0.25)'}`,
                        fontSize: '0.62rem',
                        fontWeight: 800
                      }}
                    />
                  </Box>

                  {/* Métricas clave en Roboto Mono */}
                  <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Costo por Clic Transaccional:
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Roboto Mono', monospace",
                          fontWeight: 700,
                          color: isWavi ? BRAND_GREEN : BRAND_ORANGE_GLOW
                        }}
                      >
                        {item.costPerClickUsd === 0 ? '$0.00 USD (Orgánico)' : `$${item.costPerClickUsd} USD`}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Tasa de Conversión Estimada:
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Roboto Mono', monospace",
                          fontWeight: 700,
                          color: isWavi ? BRAND_CYAN_GLOW : '#94a3b8'
                        }}
                      >
                        {item.conversionRate}%
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Abandono por Fricción:
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "'Roboto Mono', monospace",
                          fontWeight: 700,
                          color: isWavi ? BRAND_GREEN : '#f43f5e'
                        }}
                      >
                        {item.cartAbandonmentRate}%
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography
                    variant="body2"
                    sx={{
                      color: isWavi ? '#cbd5e1' : '#64748b',
                      fontSize: '0.82rem',
                      lineHeight: 1.55,
                      textTransform: 'none'
                    }}
                  >
                    {item.infrastructureAudit}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Box>

        {/* ── 2. BLOQUE: LA ASIMETRÍA DEL CAC (DATA DISPLAY) ── */}
        <Box
          sx={{
            mb: { xs: 8, md: 10 },
            p: { xs: 3.5, sm: 4.5, md: 5 },
            bgcolor: BG_CARD,
            borderRadius: 3.5,
            border: `1px solid ${BORDER_SUBTLE}`,
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 111, 0, 0.12)',
                  border: `1px solid ${BORDER_ORANGE}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TrendingUpIcon sx={{ color: BRAND_ORANGE_GLOW, fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: '#ffffff',
                    fontSize: { xs: '1.25rem', md: '1.45rem' },
                    textTransform: 'none'
                  }}
                >
                  2. La Asimetría del CAC (Gráfico & Data Display)
                </Typography>
                <Typography variant="caption" sx={{ color: BRAND_ORANGE_GLOW, fontWeight: 700 }}>
                  INFOGRAFÍA CUANTITATIVA: ADQUISICIÓN TRADICIONAL VS. WAVI
                </Typography>
              </Box>
            </Box>

            <Chip
              label="EFICIENCIA DE CAPITAL: 3.4X"
              size="small"
              sx={{
                bgcolor: 'rgba(255, 111, 0, 0.15)',
                color: BRAND_ORANGE_GLOW,
                border: `1px solid ${BORDER_ORANGE}`,
                fontWeight: 800,
                fontSize: '0.72rem',
                letterSpacing: 1
              }}
            />
          </Box>

          {/* Visual Data Comparison Grid (CSS Grid puro) */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              mb: 4
            }}
          >
            {/* Competitor Paid CAC */}
            <Box
              sx={{
                p: 3.5,
                borderRadius: 3,
                bgcolor: 'rgba(10, 14, 26, 0.85)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                position: 'relative'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc', textTransform: 'none' }}>
                  Competidor X (Pauta Tradicional Google/Meta)
                </Typography>
                <Chip
                  label="CAC INSOSTENIBLE"
                  size="small"
                  sx={{ bgcolor: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', fontSize: '0.62rem', fontWeight: 800 }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, fontSize: '0.85rem' }}>
                Paga $1.85 – $3.40 por clic transaccional. Dependencia 100% artificial de subastas de anuncios que
                devoran el margen operativo del hardware.
              </Typography>

              {/* Data Metrics Bar */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    CAC Promedio por Piloto Adquirido:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 800, color: '#fb7185', fontSize: '0.95rem' }}
                  >
                    $38.50 USD
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ width: '85%', height: '100%', bgcolor: '#f43f5e', borderRadius: 1 }} />
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Retención a 90 días (Post-Campaña):
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: '#94a3b8' }}
                  >
                    8% (Cae al pausar ads)
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ width: '12%', height: '100%', bgcolor: '#94a3b8', borderRadius: 1 }} />
                </Box>
              </Box>
            </Box>

            {/* Wavi Aeronautics Organic CAC */}
            <Box
              sx={{
                p: 3.5,
                borderRadius: 3,
                bgcolor: 'rgba(0, 172, 228, 0.05)',
                border: `1px solid ${BORDER_CYAN}`,
                boxShadow: '0 0 30px rgba(0, 172, 228, 0.1)',
                position: 'relative'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff', textTransform: 'none' }}>
                  Wavi Aeronautics (Infraestructura Técnica)
                </Typography>
                <Chip
                  label="MOAT ORGÁNICO REAL"
                  size="small"
                  sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: BRAND_GREEN, fontSize: '0.62rem', fontWeight: 800 }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, fontSize: '0.85rem' }}>
                $0 CAC. Capturamos el volumen de tráfico transaccional orgánico mediante guías de vuelo,
                telemetría, tuning Betaflight y autoridad técnica local en español.
              </Typography>

              {/* Data Metrics Bar */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    CAC Promedio por Piloto Adquirido:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 800, color: BRAND_GREEN, fontSize: '0.95rem' }}
                  >
                    $0.00 USD (Inorgánico Cero)
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ width: '4%', height: '100%', bgcolor: BRAND_GREEN, borderRadius: 1 }} />
                </Box>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Retención a 90 días (Ecosistema Micro-Stock):
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: BRAND_CYAN_GLOW }}
                  >
                    68% (Consumibles Express)
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: 8, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ width: '68%', height: '100%', bgcolor: BRAND_CYAN, borderRadius: 1 }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ── HIGHLIGHT VISUAL CENTRAL & SIMULADOR DE PATROCINIO ── */}
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              bgcolor: 'rgba(7, 11, 20, 0.95)',
              border: `1px solid ${BORDER_CYAN}`,
              background: 'linear-gradient(135deg, rgba(7, 11, 20, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)',
              position: 'relative'
            }}
          >
            {/* Interactive Tier Switcher */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
                mb: 3
              }}
            >
              <Typography variant="subtitle2" sx={{ color: '#cbd5e1', fontWeight: 700, textTransform: 'none' }}>
                Simular Impacto por Nivel de Patrocinio de Inventario:
              </Typography>
              <Stack direction="row" spacing={1}>
                {SPONSORSHIP_TIERS.map((tier) => {
                  const isActive = tier.id === currentTier.id
                  return (
                    <Button
                      key={tier.id}
                      size="small"
                      onClick={() => handleTierChange(tier)}
                      sx={{
                        bgcolor: isActive ? BRAND_CYAN : 'rgba(255,255,255,0.05)',
                        color: isActive ? '#070b14' : '#94a3b8',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        fontFamily: "'Roboto Mono', monospace",
                        textTransform: 'none',
                        px: 2,
                        py: 0.6,
                        borderRadius: 1.5,
                        border: `1px solid ${isActive ? BRAND_CYAN : BORDER_SUBTLE}`,
                        '&:hover': {
                          bgcolor: isActive ? BRAND_CYAN_GLOW : 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      ${fmt(tier.investmentAmountUsd)} USD
                    </Button>
                  )
                })}
              </Stack>
            </Box>

            {/* Argumento Central Highlight */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'rgba(0, 172, 228, 0.08)',
                border: `1px solid ${BORDER_CYAN}`,
                mb: 3
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: { xs: '1.05rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  textTransform: 'none'
                }}
              >
                &ldquo;Un patrocinio de{' '}
                <Box
                  component="span"
                  sx={{
                    color: BRAND_CYAN_GLOW,
                    fontFamily: "'Roboto Mono', monospace",
                    fontWeight: 900
                  }}
                >
                  ${fmt(currentTier.investmentAmountUsd)} USD
                </Box>{' '}
                garantiza{' '}
                <Box
                  component="span"
                  sx={{
                    color: BRAND_GREEN,
                    fontFamily: "'Roboto Mono', monospace",
                    fontWeight: 900
                  }}
                >
                  +{fmt(currentTier.targetedImpressions)} impresiones directas
                </Box>{' '}
                a un público cautivo, ofreciendo un ROI del{' '}
                <Box
                  component="span"
                  sx={{
                    color: BRAND_ORANGE_GLOW,
                    fontFamily: "'Roboto Mono', monospace",
                    fontWeight: 900
                  }}
                >
                  {currentTier.projectedAnnualRoiPercent}%
                </Box>{' '}
                comparado con la pauta tradicional.&rdquo;
              </Typography>
            </Box>

            {/* Quantitative Data Ticker (CSS Grid puro) */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: 2
              }}
            >
              <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.4)', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  Rotación de Inventario:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "'Roboto Mono', monospace", color: BRAND_CYAN_GLOW, fontWeight: 800 }}
                >
                  {currentTier.monthlyInventoryTurns}x / mes
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.4)', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  Plazo Recuperación Principal:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "'Roboto Mono', monospace", color: BRAND_GREEN, fontWeight: 800 }}
                >
                  {currentTier.capitalRecoveryPeriodMonths} meses
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.4)', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  Costo Efectivo por Clic:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "'Roboto Mono', monospace", color: '#ffffff', fontWeight: 800 }}
                >
                  $0.00 CAC
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.4)', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                  Control Accionario Cedido:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontFamily: "'Roboto Mono', monospace", color: BRAND_ORANGE_GLOW, fontWeight: 900 }}
                >
                  0% Equity
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ── 3. BLOQUE: EL MECANISMO DE RETORNO (CERO EQUITY - ALTO AOV) ── */}
        <Box
          sx={{
            p: { xs: 3.5, sm: 4.5, md: 5 },
            bgcolor: BG_CARD,
            borderRadius: 3.5,
            border: `1px solid ${BORDER_ORANGE}`,
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(255, 111, 0, 0.1)',
            position: 'relative'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 111, 0, 0.15)',
                  border: `1px solid ${BORDER_ORANGE}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <SecurityIcon sx={{ color: BRAND_ORANGE_GLOW, fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: '#ffffff',
                    fontSize: { xs: '1.25rem', md: '1.45rem' },
                    textTransform: 'none'
                  }}
                >
                  3. El Mecanismo de Retorno (Cero Equity — Alto AOV)
                </Typography>
                <Typography variant="caption" sx={{ color: BRAND_ORANGE_GLOW, fontWeight: 700 }}>
                  ESTRUCTURA DE LIQUIDACIÓN DE CAPITAL & PATROCINIO DE HARDWARE
                </Typography>
              </Box>
            </Box>

            <Chip
              label="0% DILUCIÓN ACCIONARIA"
              size="small"
              sx={{
                bgcolor: 'rgba(255, 111, 0, 0.15)',
                color: BRAND_ORANGE_GLOW,
                border: `1px solid ${BORDER_ORANGE}`,
                fontWeight: 900,
                fontSize: '0.72rem',
                letterSpacing: 1.2
              }}
            />
          </Box>

          {/* Premisa del Modelo de Negocio */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body1"
              sx={{
                color: '#cbd5e1',
                lineHeight: 1.7,
                fontSize: '1rem',
                mb: 2,
                textTransform: 'none'
              }}
            >
              Rechazamos taxativamente la intromisión de capital a cambio de acciones. El ROI no depende de la
              venta ocasional y errática de un dron BNF ($450–$800 USD);{' '}
              <strong style={{ color: '#ffffff' }}>
                se sustenta matemáticamente en la alta rotación diaria de consumibles críticos
              </strong>{' '}
              que los pilotos rompen en cada sesión de vuelo.
            </Typography>
          </Box>

          {/* Target Inventory Matrix (CSS Grid puro) */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 800, textTransform: 'none' }}>
                Target Inventory (Hardware Crítico de Reposición Inmediata):
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  onClick={() => setActiveInventoryTab('all')}
                  sx={{
                    fontSize: '0.7rem',
                    color: activeInventoryTab === 'all' ? BRAND_CYAN_GLOW : '#64748b',
                    fontWeight: 700
                  }}
                >
                  Todos
                </Button>
                <Button
                  size="small"
                  onClick={() => setActiveInventoryTab('receivers')}
                  sx={{
                    fontSize: '0.7rem',
                    color: activeInventoryTab === 'receivers' ? BRAND_CYAN_GLOW : '#64748b',
                    fontWeight: 700
                  }}
                >
                  Receptores ER
                </Button>
                <Button
                  size="small"
                  onClick={() => setActiveInventoryTab('lipo_batteries')}
                  sx={{
                    fontSize: '0.7rem',
                    color: activeInventoryTab === 'lipo_batteries' ? BRAND_CYAN_GLOW : '#64748b',
                    fontWeight: 700
                  }}
                >
                  LiPos 6S
                </Button>
                <Button
                  size="small"
                  onClick={() => setActiveInventoryTab('individual_rotor_blades')}
                  sx={{
                    fontSize: '0.7rem',
                    color: activeInventoryTab === 'individual_rotor_blades' ? BRAND_CYAN_GLOW : '#64748b',
                    fontWeight: 700
                  }}
                >
                  Palas EX5
                </Button>
              </Stack>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 2.5
              }}
            >
              {filteredInventory.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    p: 3,
                    borderRadius: 2.5,
                    bgcolor: 'rgba(7, 11, 20, 0.75)',
                    border: `1px solid ${BORDER_SUBTLE}`,
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: BRAND_ORANGE_GLOW }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "'Roboto Mono', monospace",
                        color: BRAND_CYAN_GLOW,
                        fontWeight: 700
                      }}
                    >
                      {item.sku}
                    </Typography>
                    <Chip
                      label={`${item.rotationVelocityDays} DÍAS VELOCIDAD`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 111, 0, 0.12)',
                        color: BRAND_ORANGE_GLOW,
                        fontSize: '0.62rem',
                        fontWeight: 800
                      }}
                    />
                  </Box>

                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      color: '#ffffff',
                      fontSize: '1rem',
                      lineHeight: 1.35,
                      mb: 1,
                      textTransform: 'none'
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#94a3b8',
                      fontSize: '0.8rem',
                      lineHeight: 1.55,
                      mb: 2,
                      textTransform: 'none'
                    }}
                  >
                    {item.technicalSpecification}
                  </Typography>

                  <Box
                    sx={{
                      pt: 1.5,
                      borderTop: `1px solid ${BORDER_SUBTLE}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Margen Bruto de Línea:
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: "'Roboto Mono', monospace",
                        color: BRAND_GREEN,
                        fontWeight: 800,
                        fontSize: '0.9rem'
                      }}
                    >
                      +{item.grossMarginPercent}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Condiciones del Contrato (The Deal Architecture) */}
          <Box
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: 3,
              bgcolor: 'rgba(10, 14, 26, 0.9)',
              border: `1px solid ${BORDER_ORANGE}`,
              mb: 3
            }}
          >
            <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 800, mb: 2, textTransform: 'none' }}>
              Condiciones del Contrato de Patrocinio & Desembolso:
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2.5
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <CheckCircleOutlineIcon sx={{ color: BRAND_GREEN, fontSize: 20, mt: '2px', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  <strong>Inyección de Capital:</strong> El patrocinador inyecta capital estrictamente etiquetado para
                  stock inicial de hardware crítico (receptores ER, baterías LiPo y palas EX5).
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <CheckCircleOutlineIcon sx={{ color: BRAND_GREEN, fontSize: 20, mt: '2px', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  <strong>Aporte Operativo Wavi:</strong> Wavi aporta penetración de mercado inmediata, SEO de
                  intención de compra, gestión ante DIAN/aduanas y red de distribución nacional express.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <CheckCircleOutlineIcon sx={{ color: BRAND_GREEN, fontSize: 20, mt: '2px', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  <strong>Retorno Waterfall Fijo:</strong> Se devuelve el 100% del capital principal más un{' '}
                  <span style={{ color: BRAND_ORANGE_GLOW, fontWeight: 700 }}>rendimiento fijo acordado</span> sobre
                  cada transacción liquidada hasta saldar el monto total.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <CheckCircleOutlineIcon sx={{ color: BRAND_GREEN, fontSize: 20, mt: '2px', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  <strong>Cero Intromisión Accionaria:</strong> Wavi retiene el 100% del control operativo, técnico y
                  accionario. Cero dilución de equity y cero asientos en junta.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Deal Action CTA */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                Instrumento Legal: Contrato de Cuentas en Participación / Patrocinio de Inventario Comercial
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Jurisdicción: Bogotá D.C., Colombia • Liquidación transparente en USD vía Wire o USDT/USDC.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleDealAction}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: BRAND_ORANGE,
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.92rem',
                textTransform: 'none',
                px: 3.5,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 0 25px rgba(255, 111, 0, 0.4)',
                '&:hover': {
                  bgcolor: '#e65100',
                  boxShadow: '0 0 35px rgba(255, 111, 0, 0.65)'
                }
              }}
            >
              Solicitar Term Sheet (${fmt(currentTier.investmentAmountUsd)} USD)
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
