'use client'

import React, { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Divider,
  Stack,
  Alert
} from '@mui/material'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Icons
import RefreshIcon from '@mui/icons-material/Refresh'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import StorefrontIcon from '@mui/icons-material/Storefront'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import RateReviewIcon from '@mui/icons-material/RateReview'
import StarIcon from '@mui/icons-material/Star'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart'
import CategoryIcon from '@mui/icons-material/Category'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import SellIcon from '@mui/icons-material/Sell'

import { getAdminStats } from '@/services/adminService'
import { formatCurrency } from '@/utilities/priceUtils'

// ============================================================
// Process KPI Card Component
// ============================================================
const ProcessKpiCard = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = '#00aCe4',
  href,
  badge,
  badgeColor = 'default',
  delay = 0
}) => {
  const CardWrapper = ({ children }) => {
    if (href) {
      return (
        <Link href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
          {children}
        </Link>
      )
    }
    return children
  }

  return (
    <CardWrapper>
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        sx={{
          height: '100%',
          borderRadius: 3.5,
          border: '1px solid rgba(0,0,0,0.06)',
          bgcolor: '#ffffff',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.25s ease',
          '&:hover': {
            transform: href ? 'translateY(-4px)' : 'none',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
            borderColor: `${accentColor}40`
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            bgcolor: accentColor
          }
        }}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {title}
              </Typography>
              {badge && (
                <Chip
                  label={badge}
                  size="small"
                  color={badgeColor}
                  sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }}
                />
              )}
            </Box>
            <Box
              sx={{
                p: 1.2,
                borderRadius: '12px',
                bgcolor: `${accentColor}14`,
                color: accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {icon}
            </Box>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', mb: 0.5 }}>
            {value}
          </Typography>

          {subtitle && (
            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {subtitle}
            </Typography>
          )}

          {href && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5, color: accentColor }}>
              <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>
                Gestionar
              </Typography>
              <ArrowForwardIcon sx={{ fontSize: 13 }} />
            </Box>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  )
}

// ============================================================
// Process Section Header Component
// ============================================================
const ProcessSectionHeader = ({ icon, title, description, linkHref, linkText }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2, mt: 4, flexWrap: 'wrap', gap: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: 'rgba(15, 23, 42, 0.05)',
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.1rem' }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
    {linkHref && (
      <Button
        component={Link}
        href={linkHref}
        size="small"
        endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
        sx={{ textTransform: 'none', fontWeight: 700, color: '#0284c7' }}
      >
        {linkText || 'Ver módulo completo'}
      </Button>
    )}
  </Box>
)

// ============================================================
// Main Admin Dashboard
// ============================================================
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState(null)

  const fetchStats = useCallback(async () => {
    try {
      setRefreshing(true)
      const data = await getAdminStats()
      setStats(data)
    } catch (err) {
      console.error('Dashboard stats fetch error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: 2 }}>
        <CircularProgress size={48} sx={{ color: '#00aCe4' }} />
        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
          Cargando métricas y KPIs por proceso...
        </Typography>
      </Box>
    )
  }

  // Count total actionable items for Admin Action Center
  const actionablePendingUsed = stats?.used?.pendingUsed || 0
  const actionableUnansweredQuestions = stats?.interactions?.unansweredQuestions || 0
  const actionablePendingReviews = stats?.interactions?.pendingReviews || 0
  const actionableIssueOrders = stats?.sales?.issueOrdersCount || 0
  const totalActionable = actionablePendingUsed + actionableUnansweredQuestions + actionablePendingReviews + actionableIssueOrders

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header with Title and Refresh */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Dashboard General
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            Supervisión integral de operaciones, marketplace de usados, soporte y transacciones
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Actualizar métricas en tiempo real">
            <Button
              variant="outlined"
              size="small"
              onClick={fetchStats}
              disabled={refreshing}
              startIcon={<RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />}
              sx={{
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 700,
                borderColor: '#cbd5e1',
                color: '#334155'
              }}
            >
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* ============================================================ */}
      {/* ACTION CENTER / TAREAS PENDIENTES */}
      {/* ============================================================ */}
      {totalActionable > 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3.5,
            border: '2px solid #fdba74',
            background: 'linear-gradient(135deg, rgba(255, 247, 237, 0.9) 0%, #ffffff 100%)',
            boxShadow: '0 4px 16px rgba(234, 88, 12, 0.06)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  bgcolor: 'rgba(234, 88, 12, 0.15)',
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <WarningAmberIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#9a3412' }}>
                  Centro de Acción Inmediata ({totalActionable} tareas pendientes)
                </Typography>
                <Typography variant="caption" sx={{ color: '#c2410c', fontWeight: 600 }}>
                  Elementos que requieren aprobación, respuesta o verificación técnica del administrador
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
            {actionablePendingUsed > 0 && (
              <Button
                component={Link}
                href="/admin/used-products"
                variant="outlined"
                sx={{
                  bgcolor: '#ffffff',
                  borderColor: '#fed7aa',
                  color: '#c2410c',
                  p: 1.5,
                  borderRadius: 2.5,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  textAlign: 'left'
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#ea580c', display: 'block' }}>
                    🏷️ Usados por Moderar
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {actionablePendingUsed} solicitudes
                  </Typography>
                </Box>
              </Button>
            )}

            {actionableUnansweredQuestions > 0 && (
              <Button
                component={Link}
                href="/admin/questions"
                variant="outlined"
                sx={{
                  bgcolor: '#ffffff',
                  borderColor: '#bae6fd',
                  color: '#0369a1',
                  p: 1.5,
                  borderRadius: 2.5,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  textAlign: 'left'
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0284c7', display: 'block' }}>
                    ❓ Preguntas sin Responder
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {actionableUnansweredQuestions} preguntas
                  </Typography>
                </Box>
              </Button>
            )}

            {actionablePendingReviews > 0 && (
              <Button
                component={Link}
                href="/admin/reviews"
                variant="outlined"
                sx={{
                  bgcolor: '#ffffff',
                  borderColor: '#fbcfe8',
                  color: '#be185d',
                  p: 1.5,
                  borderRadius: 2.5,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  textAlign: 'left'
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#db2777', display: 'block' }}>
                    ⭐ Opiniones por Aprobar
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {actionablePendingReviews} reseñas
                  </Typography>
                </Box>
              </Button>
            )}

            {actionableIssueOrders > 0 && (
              <Button
                component={Link}
                href="/admin/orders/issues"
                variant="outlined"
                sx={{
                  bgcolor: '#ffffff',
                  borderColor: '#fecaca',
                  color: '#b91c1c',
                  p: 1.5,
                  borderRadius: 2.5,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  textAlign: 'left'
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#dc2626', display: 'block' }}>
                    ⚠️ Incidencias en Pedidos
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {actionableIssueOrders} órdenes
                  </Typography>
                </Box>
              </Button>
            )}
          </Box>
        </Paper>
      ) : (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 3, fontWeight: 600 }}>
          🎉 ¡Excelente! No hay tareas urgentes pendientes de moderación en este momento.
        </Alert>
      )}

      {/* ============================================================ */}
      {/* 1. PROCESO DE VENTAS & PEDIDOS (E-COMMERCE) */}
      {/* ============================================================ */}
      <ProcessSectionHeader
        icon={<TrendingUpIcon />}
        title="1. Ventas, Facturación & Pedidos"
        description="Métricas de ingresos brutos, procesamiento de pagos y flujo de órdenes"
        linkHref="/admin/orders"
        linkText="Gestionar Pedidos"
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2 }}>
        <ProcessKpiCard
          title="Ingresos Totales"
          value={formatCurrency(stats?.sales?.totalIncome || 0)}
          subtitle="Ventas aprobadas y entregadas"
          icon={<MonetizationOnIcon />}
          accentColor="#16a34a"
          delay={0.05}
        />
        <ProcessKpiCard
          title="Total Pedidos"
          value={stats?.sales?.totalOrders || 0}
          subtitle={`${stats?.sales?.paidOrdersCount || 0} pagados / completados`}
          icon={<ReceiptLongIcon />}
          accentColor="#0284c7"
          href="/admin/orders"
          delay={0.1}
        />
        <ProcessKpiCard
          title="Pedidos Pendientes"
          value={stats?.sales?.pendingOrdersCount || 0}
          subtitle="En proceso o validación"
          icon={<PendingActionsIcon />}
          accentColor="#ea580c"
          href="/admin/orders"
          badge={stats?.sales?.pendingOrdersCount > 0 ? 'En curso' : null}
          badgeColor="warning"
          delay={0.15}
        />
        <ProcessKpiCard
          title="Problemas de Pedidos"
          value={stats?.sales?.issueOrdersCount || 0}
          subtitle="Verificación requerida o fallidos"
          icon={<ReportProblemIcon />}
          accentColor="#dc2626"
          href="/admin/orders/issues"
          badge={stats?.sales?.issueOrdersCount > 0 ? 'Atención' : null}
          badgeColor="error"
          delay={0.2}
        />
        <ProcessKpiCard
          title="Ticket Promedio"
          value={formatCurrency(stats?.sales?.averageTicket || 0)}
          subtitle="Promedio por pedido pagado"
          icon={<TrendingUpIcon />}
          accentColor="#0d9488"
          delay={0.25}
        />
      </Box>

      {/* ============================================================ */}
      {/* 2. PROCESO DE MARKETPLACE DE USADOS (RECOMMERCE) */}
      {/* ============================================================ */}
      <ProcessSectionHeader
        icon={<SellIcon />}
        title="2. Marketplace de Equipos Usados"
        description="Publicaciones C2B/C2C, flujo de moderación de segunda mano y valor del inventario"
        linkHref="/admin/used-products"
        linkText="Panel de Moderación de Usados"
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2 }}>
        <ProcessKpiCard
          title="Por Verificar"
          value={stats?.used?.pendingUsed || 0}
          subtitle="Esperando revisión de fotos/datos"
          icon={<FactCheckIcon />}
          accentColor="#ea580c"
          href="/admin/used-products"
          badge={stats?.used?.pendingUsed > 0 ? 'Pendiente' : null}
          badgeColor="warning"
          delay={0.1}
        />
        <ProcessKpiCard
          title="Usados Verificados"
          value={stats?.used?.verifiedUsed || 0}
          subtitle="Activos y visibles en la tienda"
          icon={<CheckCircleOutlineIcon />}
          accentColor="#16a34a"
          href="/admin/used-products"
          delay={0.15}
        />
        <ProcessKpiCard
          title="Usados Vendidos"
          value={stats?.used?.soldUsed || 0}
          subtitle="Completados con éxito"
          icon={<StorefrontIcon />}
          accentColor="#0284c7"
          delay={0.2}
        />
        <ProcessKpiCard
          title="Rechazados / Inactivos"
          value={stats?.used?.disabledUsed || 0}
          subtitle="No cumplen criterios técnicos"
          icon={<CancelOutlinedIcon />}
          accentColor="#64748b"
          href="/admin/used-products"
          delay={0.25}
        />
        <ProcessKpiCard
          title="Valor Inventario Usados"
          value={formatCurrency(stats?.used?.totalUsedInventoryValue || 0)}
          subtitle="Suma de equipos verificados"
          icon={<MonetizationOnIcon />}
          accentColor="#7c3aed"
          delay={0.3}
        />
      </Box>

      {/* ============================================================ */}
      {/* 3. PROCESO DE INTERACCIONES, PREGUNTAS Y OPINIONES */}
      {/* ============================================================ */}
      <ProcessSectionHeader
        icon={<QuestionAnswerIcon />}
        title="3. Interacciones, Soporte Técnico & Reseñas"
        description="Consultas técnicas de clientes antes de compra y feedback posterior"
        linkHref="/admin/questions"
        linkText="Moderar Preguntas y Opiniones"
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        <ProcessKpiCard
          title="Preguntas sin Responder"
          value={stats?.interactions?.unansweredQuestions || 0}
          subtitle="Dudas técnicas en fichas de producto"
          icon={<QuestionAnswerIcon />}
          accentColor="#0284c7"
          href="/admin/questions"
          badge={stats?.interactions?.unansweredQuestions > 0 ? 'Sin Respuesta' : null}
          badgeColor="info"
          delay={0.1}
        />
        <ProcessKpiCard
          title="Preguntas Respondidas"
          value={stats?.interactions?.answeredQuestions || 0}
          subtitle={`De un total de ${stats?.interactions?.totalQuestions || 0} consultas`}
          icon={<CheckCircleOutlineIcon />}
          accentColor="#16a34a"
          href="/admin/questions"
          delay={0.15}
        />
        <ProcessKpiCard
          title="Opiniones Pendientes"
          value={stats?.interactions?.pendingReviews || 0}
          subtitle="Esperando aprobación de moderador"
          icon={<RateReviewIcon />}
          accentColor="#db2777"
          href="/admin/reviews"
          badge={stats?.interactions?.pendingReviews > 0 ? 'Por Moderar' : null}
          badgeColor="secondary"
          delay={0.2}
        />
        <ProcessKpiCard
          title="Calificación Promedio"
          value={`${stats?.interactions?.averageRating || '5.0'} ★`}
          subtitle={`Basado en ${stats?.interactions?.approvedReviews || 0} opiniones aprobadas`}
          icon={<StarIcon />}
          accentColor="#eab308"
          href="/admin/reviews"
          delay={0.25}
        />
      </Box>

      {/* ============================================================ */}
      {/* 4. PROCESO DE CATÁLOGO & INVENTARIO */}
      {/* ============================================================ */}
      <ProcessSectionHeader
        icon={<Inventory2Icon />}
        title="4. Catálogo de Productos & Inventario"
        description="Estado del inventario de drones nuevos, accesorios y disponibilidad"
        linkHref="/admin/products"
        linkText="Gestionar Catálogo"
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        <ProcessKpiCard
          title="Total de Productos"
          value={stats?.catalog?.totalProducts || 0}
          subtitle="En base de datos de catálogo"
          icon={<Inventory2Icon />}
          accentColor="#0f172a"
          href="/admin/products"
          delay={0.1}
        />
        <ProcessKpiCard
          title="Productos Activos"
          value={stats?.catalog?.activeProducts || 0}
          subtitle="Disponibles en tienda pública"
          icon={<CheckCircleOutlineIcon />}
          accentColor="#16a34a"
          href="/admin/products"
          delay={0.15}
        />
        <ProcessKpiCard
          title="Agotados / Sin Stock"
          value={stats?.catalog?.outOfStockProducts || 0}
          subtitle="Requieren reabastecimiento"
          icon={<RemoveShoppingCartIcon />}
          accentColor="#ea580c"
          href="/admin/products"
          badge={stats?.catalog?.outOfStockProducts > 0 ? 'Agotado' : null}
          badgeColor="warning"
          delay={0.2}
        />
        <ProcessKpiCard
          title="Categorías Activas"
          value={stats?.catalog?.activeCategoriesCount || 0}
          subtitle="Con artículos publicados"
          icon={<CategoryIcon />}
          accentColor="#6366f1"
          href="/admin/products"
          delay={0.25}
        />
      </Box>

      {/* ============================================================ */}
      {/* 5. PROCESO DE USUARIOS & COMUNIDAD */}
      {/* ============================================================ */}
      <ProcessSectionHeader
        icon={<ManageAccountsIcon />}
        title="5. Usuarios & Clientes"
        description="Crecimiento de la comunidad aeronáutica y clientes recurrentes"
        linkHref="/admin/users"
        linkText="Ver Lista de Usuarios"
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        <ProcessKpiCard
          title="Usuarios Registrados"
          value={stats?.users?.totalUsers || 0}
          subtitle="Cuentas creadas en la plataforma"
          icon={<PeopleAltIcon />}
          accentColor="#9333ea"
          href="/admin/users"
          delay={0.1}
        />
        <ProcessKpiCard
          title="Clientes con Compras"
          value={stats?.users?.activeBuyers || 0}
          subtitle="Usuarios con al menos un pedido pagado"
          icon={<ShoppingBagIcon />}
          accentColor="#0284c7"
          delay={0.15}
        />
        <ProcessKpiCard
          title="Tasa de Conversión de Usuario"
          value={
            stats?.users?.totalUsers > 0
              ? `${Math.round(((stats?.users?.activeBuyers || 0) / stats?.users?.totalUsers) * 100)}%`
              : '0%'
          }
          subtitle="Proporción de usuarios que han comprado"
          icon={<TrendingUpIcon />}
          accentColor="#16a34a"
          delay={0.2}
        />
      </Box>
    </Box>
  )
}
