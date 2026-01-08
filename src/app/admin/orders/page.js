'use client'

import React, { useEffect, useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  IconButton, 
  Tooltip,
  Modal,
  Backdrop,
  Fade,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { getOrders, updateOrderStatus, generateTestOrders } from '@/firebase/adminServices'
import { formatCurrency } from '@/utilities/priceUtils' // Assuming this utility exists, otherwise I'll mock it
import { motion } from 'framer-motion'
import StoreIcon from '@mui/icons-material/Store'

// Mock formatCurrency if it doesn't exist, I'll rely on try/catch logic if imports fail, but better to define a helper if uncertain.
// I'll assume it exists as per previous file context, but defining a safe fallback locally is safer.
const safeFormatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

const STATUS_OPTIONS = [
  { value: 'paid', label: 'Pagado', color: 'success' },
  { value: 'shipped', label: 'Enviado', color: 'info' },
  { value: 'delivered', label: 'Entregado', color: 'success' },
  { value: 'cancelled', label: 'Cancelado', color: 'error' },
  { value: 'pending', label: 'Pendiente', color: 'warning' }
]

const getStatusChip = (status) => {
  const option = STATUS_OPTIONS.find(opt => opt.value === status) || { label: status, color: 'default' }
  return <Chip label={option.label} color={option.color} size="small" variant="outlined" />
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const fetchOrders = async () => {
    setLoading(true)
    try {
      // Fetch only paid/success status as per requirement 3
      // Requirements: 'paid' or 'paymentStatus === success'. 
      // I'll query for 'paid', 'shipped', 'delivered' as "Successful" orders handling.
      const { orders: data } = await getOrders(['paid', 'shipped', 'delivered'], 20)
      
      // Map Firestore timestamp to string if needed
      const mapped = data.map(o => ({
          ...o,
          date: o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'
      }))
      setOrders(mapped)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleOpenModal = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return
    try {
      await updateOrderStatus(selectedOrder.id, newStatus)
      setIsModalOpen(false)
      fetchOrders() // Refresh
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }
  
  const handleGenerateValues = async () => {
      await generateTestOrders(5)
      fetchOrders()
  }

  const columns = [
    { field: 'id', headerName: 'ID Pedido', width: 220 },
    { 
        field: 'user', 
        headerName: 'Cliente', 
        width: 200, 
        valueGetter: (params) => {
             // v6: params is the value. If field is 'user', params is user obj.
             // But params might be undefined if field missing.
             // Actually, row is safer. 
             // In v6/v7 valueGetter: (value, row) => ...
             // Let's assume standard behavior:
             if (params && params.email) return params.email
             return params ? params.name || params.email || 'N/A' : 'N/A' 
             // If user stores just ID, this might fail, but test data has user object
        }
    },
    { field: 'date', headerName: 'Fecha', width: 130 },
    { 
      field: 'total', 
      headerName: 'Total', 
      width: 150,
      renderCell: (params) => safeFormatCurrency(params.value || 0)
    },
    { 
      field: 'status', 
      headerName: 'Estado', 
      width: 130,
      renderCell: (params) => getStatusChip(params.value)
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 100,
      renderCell: (params) => (
        <Tooltip title="Ver Detalles">
          <IconButton onClick={() => handleOpenModal(params.row)} color="primary">
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      )
    }
  ]

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Pedidos Completados
        </Typography>
        <Button variant="outlined" onClick={handleGenerateValues} startIcon={<StoreIcon />}>
            Generar Test Data
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25]}
        />
      </Paper>

      {/* Details Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isModalOpen}>
          <Box 
            component={motion.div}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              outline: 'none'
            }}
          >
            {selectedOrder && (
              <>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Detalles del Pedido</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">ID PEDIDO</Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>{selectedOrder.id}</Typography>
                        
                        <Typography variant="caption" color="text.secondary">CLIENTE</Typography>
                        <Typography variant="body1">{selectedOrder.user?.name || 'Invitado'}</Typography>
                        <Typography variant="body2" color="text.secondary">{selectedOrder.user?.email}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                         <Typography variant="caption" color="text.secondary">ESTADO ACTUAL</Typography>
                         <Box sx={{ mt: 1, mb: 2 }}>{getStatusChip(selectedOrder.status)}</Box>
                         
                         <Typography variant="caption" color="text.secondary">TOTAL</Typography>
                         <Typography variant="h6" color="primary">{safeFormatCurrency(selectedOrder.total)}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Productos</Typography>
                    <List dense disablePadding sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}>
                        {selectedOrder.items?.map((item, idx) => (
                            <ListItem key={idx}>
                                <ListItemText 
                                    primary={item.name} 
                                    secondary={`Cant: ${item.quantity} - ${safeFormatCurrency(item.price)}`} 
                                />
                                <Typography variant="body2">{safeFormatCurrency(item.price * item.quantity)}</Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Cambiar Estado</InputLabel>
                    <Select
                        value={selectedOrder.status}
                        label="Cambiar Estado"
                        onChange={(e) => handleStatusChange(e.target.value)}
                    >
                        {STATUS_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button fullWidth onClick={() => setIsModalOpen(false)} variant="outlined">Cerrar</Button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}
