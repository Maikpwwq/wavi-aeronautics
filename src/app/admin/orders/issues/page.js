'use client'

import React, { useEffect, useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  Button, 
  Tooltip,
  IconButton
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import WarningIcon from '@mui/icons-material/Warning'
import { getOrders, updateOrderStatus } from '@/firebase/adminServices'

// Safe Currency Formatter
const safeFormatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

const ISSUE_STATUSES = ['pending', 'failed', 'verification_required']

export default function OrderIssues() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchIssues = async () => {
    setLoading(true)
    try {
      const { orders: data } = await getOrders(ISSUE_STATUSES, 50)
      
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
    fetchIssues()
  }, [])

  const handleForceApprove = async (id) => {
    if (confirm('¿Estás seguro de forzar la aprobación de este pedido? Pasará a estado "Pagado".')) {
        await updateOrderStatus(id, 'paid')
        fetchIssues()
    }
  }

  const handleCancel = async (id) => {
    if (confirm('¿Estás seguro de cancelar este pedido?')) {
        await updateOrderStatus(id, 'cancelled')
        fetchIssues()
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID Pedido', width: 200 },
    { 
        field: 'user', 
        headerName: 'Cliente', 
        width: 200, 
        valueGetter: (params) => {
             if (params && params.email) return params.email
             return params ? params.name || params.email || 'N/A' : 'N/A' 
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
      width: 150,
      renderCell: (params) => (
        <Chip 
            icon={<WarningIcon />} 
            label={params.value.toUpperCase()} 
            color="error" 
            variant="outlined" 
            size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Intervención',
      width: 200,
      renderCell: (params) => (
        <Box>
            <Tooltip title="Forzar Aprobación">
                <IconButton color="success" onClick={() => handleForceApprove(params.row.id)}>
                    <CheckCircleIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Cancelar Pedido">
                <IconButton color="error" onClick={() => handleCancel(params.row.id)}>
                    <CancelIcon />
                </IconButton>
            </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#d32f2f' }}>
        Atención Requerida
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Pedidos con problemas de pago o verificación pendiente.
      </Typography>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Paper>
    </Box>
  )
}
