'use client'

import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import { getAdminStats } from '@/services/adminService'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/utilities/priceUtils'

const StatCard = ({ title, value, icon, color, delay = 0 }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card 
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      sx={{ 
        height: '100%', 
        borderRadius: 4, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.3s ease'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold', color: '#1a2744' }}>
              {value}
            </Typography>
          </Box>
          <Box 
            sx={{ 
                p: 1.5, 
                ml: 1,
                borderRadius: 3, 
                backgroundColor: `${color}15`, 
                color: color,
                display: 'flex'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Grid>
)

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats()
        setStats(data)
      } catch (err) {
        console.error("Dashboard error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1a2744' }}>
        Dashboard General
      </Typography>

      <Grid container spacing={3}>
        <StatCard 
          title="Ingresos Totales" 
          value={formatCurrency(stats?.totalIncome || 0)} 
          icon={<TrendingUpIcon />} 
          color="#4caf50" 
          delay={0.1}
        />
        <StatCard 
          title="Pedidos Totales" 
          value={stats?.totalOrders || 0} 
          icon={<ShoppingBasketIcon />} 
          color="#2196f3" 
          delay={0.2}
        />
        <StatCard 
          title="Pedidos Pendientes" 
          value={stats?.pendingOrders || 0} 
          icon={<PendingActionsIcon />} 
          color="#ff9800" 
          delay={0.3}
        />
        <StatCard 
          title="Usuarios Registrados" 
          value={stats?.totalUsers || 0} 
          icon={<PeopleAltIcon />} 
          color="#9c27b0" 
          delay={0.4}
        />
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 4, minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
             <Typography variant="h6" color="text.secondary">
                Gráfico de Ventas (Próximamente)
             </Typography>
             <Typography variant="caption" sx={{ mt: 1, opacity: 0.6 }}>
                Integración con Recharts para visualización de ingresos mensuales
             </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 4, minHeight: 400 }}>
             <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Actividad Reciente
             </Typography>
             <Typography variant="body2" color="text.secondary">
                Resumen de las últimas transacciones y nuevos usuarios.
             </Typography>
             <Box sx={{ mt: 4, textAlign: 'center' }}>
                 {/* Placeholder for recent activity list */}
                 <Typography variant="caption" color="text.disabled">
                    No hay actividad crítica para reportar
                 </Typography>
             </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
