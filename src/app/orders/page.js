'use client'

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchUserOrders } from '@/services/ordersService'
import { MOCK_ORDERS } from './constants'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import { styled } from '@mui/material/styles'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'

const StyledOrderCard = styled(motion(Card))(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: '16px',
  overflow: 'visible',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  border: '1px solid rgba(0,0,0,0.05)',
  backgroundColor: 'white',
  '&:hover': {
      boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
      zIndex: 1
  }
}))

const steps = ['En Proceso', 'Enviado', 'Entregado']

const getStepIndex = (status) => {
    switch (status?.toLowerCase()) {
        case 'processing':
        case 'pending':
            return 0
        case 'shipped':
        case 'on_way':
            return 1
        case 'delivered':
        case 'completed':
            return 2
        default:
            return 0
    }
}

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'processing':
        case 'pending':
            return 'warning'
        case 'shipped':
        case 'on_way':
            return 'info'
        case 'delivered':
        case 'completed':
            return 'success'
        case 'cancelled':
            return 'error'
        default:
            return 'default'
    }
}


const OrdersPage = () => {
    const user = useSelector((state) => state.user)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getOrders = async () => {
            if (user?.uid) {
                try {
                    const ordersData = await fetchUserOrders(user.uid)
                    
                    if (ordersData.length > 0) {
                        setOrders(ordersData)
                    } else {
                        // Fallback to mock data for demonstration if no real orders exist
                        console.log("No real orders found, showing mock data")
                        setOrders(MOCK_ORDERS)
                    }
                } catch (error) {
                    console.error("Error in OrdersPage:", error)
                    setOrders(MOCK_ORDERS)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }

        getOrders()
    }, [user])

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f7' }}>
            <AppAppBar />
            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1000px', mx: 'auto', mt: 8 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                    <ReceiptIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} /> 
                    Mis Pedidos
                </Typography>

                {orders.length === 0 ? (
                    <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
                        <LocalShippingIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            No se encontraron pedidos.
                        </Typography>
                        <Button variant="contained" href="/tienda/kit-drones" sx={{ mt: 2 }}>
                            Comenzar a comprar
                        </Button>
                    </Paper>
                ) : (
                    <Box component={motion.div} layout>
                        {orders.map((order, index) => (
                            <StyledOrderCard 
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Grid container spacing={3} alignItems="center">
                                        <Grid item xs={12} md={8}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="h6" fontWeight="bold" sx={{ mr: 2 }}>
                                                    {order.id}
                                                </Typography>
                                                <Chip 
                                                    label={order.status} 
                                                    color={getStatusColor(order.status)} 
                                                    size="small"
                                                    variant="filled"
                                                />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Pedido el {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                                            </Typography>
                                            
                                            <Box sx={{ mt: 2 }}>
                                                {order.items?.map((item, i) => (
                                                    <Typography key={i} variant="body2">
                                                        {item.quantity}x {item.name}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                            <Typography variant="h5" color="primary.main" fontWeight="bold">
                                                ${order.total?.toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 3 }} />

                                    <Box sx={{ width: '100%' }}>
                                        <Stepper activeStep={getStepIndex(order.status)} alternativeLabel>
                                            {steps.map((label) => (
                                                <Step key={label}>
                                                    <StepLabel>{label}</StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </Box>
                                </CardContent>
                            </StyledOrderCard>
                        ))}
                    </Box>
                )}
            </Box>
            <AppFooter />
        </Box>
    )
}

export default OrdersPage
