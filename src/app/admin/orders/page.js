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
  ListItemText
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { firestore } from '@/firebase/firebaseClient'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { formatCurrency } from '@/utilities/priceUtils'
import { updateOrderStatus } from '@/services/ordersService'
import { motion, AnimatePresence } from 'framer-motion'

const STATUS_OPTIONS = [
  { value: 'processing', label: 'Pendiente', color: 'warning' },
  { value: 'shipped', label: 'Enviado', color: 'info' },
  { value: 'delivered', label: 'Entregado', color: 'success' },
  { value: 'cancelled', label: 'Cancelado', color: 'error' }
]

const getStatusChip = (status) => {
  const option = STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0]
  return <Chip label={option.label} color={option.color} size="small" variant="outlined" />
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const ordersRef = collection(firestore, 'orders')
    const q = query(ordersRef, orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Flatten nested data for DataGrid if needed
        date: doc.data().createdAt?.toDate().toLocaleDateString() || 'Recent'
      }))
      setOrders(ordersData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleOpenModal = (order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const handleStatusChange = async (newStatus) => {
    if (!selectedOrder) return
    
    setUpdatingStatus(true)
    try {
      await updateOrderStatus(selectedOrder.id, newStatus)
      handleCloseModal()
    } catch (err) {
      console.error("Failed to update status:", err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID Pedido', width: 200 },
    { field: 'userEmail', headerName: 'Correo Cliente', width: 220 },
    { field: 'date', headerName: 'Fecha', width: 130 },
    { 
      field: 'total', 
      headerName: 'Total', 
      width: 150,
      renderCell: (params) => formatCurrency(params.value || 0)
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
      sortable: false,
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
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#1a2744' }}>
        Gestión de Pedidos
      </Typography>

      <Paper sx={{ height: 600, width: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          loading={loading}
          disableRowSelectionOnClick
          sx={{
             border: 'none',
             '& .MuiDataGrid-cell:focus': { outline: 'none' },
             '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f8f9fa',
                color: '#1a2744',
                fontWeight: 'bold'
             }
          }}
        />
      </Paper>

      {/* Order Details Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500, sx: { backgroundColor: 'rgba(0,0,0,0.8)' } }}
      >
        <Fade in={isModalOpen}>
          <Box 
            component={motion.div}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 600 },
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: 24,
              p: 4,
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {selectedOrder && (
              <>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Detalles del Pedido
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                  ID: {selectedOrder.id}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Cliente</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{selectedOrder.userName || 'N/A'}</Typography>
                        <Typography variant="body2">{selectedOrder.userEmail}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Fecha</Typography>
                        <Typography variant="body1">{selectedOrder.date}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Artículos</Typography>
                    <List disablePadding>
                        {selectedOrder.items?.map((item, index) => (
                            <ListItem key={index} disableGutters>
                                <ListItemText 
                                    primary={`${item.name} x ${item.quantity}`} 
                                    secondary={formatCurrency(item.price * item.quantity)}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f7fa', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(selectedOrder.total || 0)}
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <FormControl fullWidth>
                        <InputLabel>Actualizar Estado</InputLabel>
                        <Select
                            value={selectedOrder.status}
                            label="Actualizar Estado"
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={updatingStatus}
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleCloseModal} variant="outlined">
                        Cerrar
                    </Button>
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}
