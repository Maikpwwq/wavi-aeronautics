'use client'

import { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  InputAdornment,
  Chip
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import { getAllPromotions, createPromotion, deletePromotion, togglePromotionStatus } from '@/firebase/adminServices'

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Dialog State
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    value: '',
    type: 'percentage', // percentage | fixed
    active: true,
    description: ''
  })

  // Notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const fetchPromotions = async () => {
    setLoading(true)
    try {
      const data = await getAllPromotions()
      setPromotions(data)
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: 'Error al cargar promociones', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  const handleOpenDialog = () => {
    setFormData({
      code: '',
      value: '',
      type: 'percentage',
      active: true,
      description: ''
    })
    setOpenDialog(true)
  }

  const handleSave = async () => {
    try {
      const payload = {
        code: formData.code.toUpperCase(),
        value: parseFloat(formData.value),
        type: formData.type,
        active: formData.active,
        description: formData.description
      }

      await createPromotion(payload)
      setSnackbar({ open: true, message: 'Promoción creada', severity: 'success' })
      setOpenDialog(false)
      fetchPromotions()
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: 'Error al crear promoción', severity: 'error' })
    }
  }

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta promoción permanently?')) {
        try {
            await deletePromotion(id)
            setSnackbar({ open: true, message: 'Promoción eliminada', severity: 'success' })
            fetchPromotions()
        } catch (error) {
            console.error(error)
            setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' })
        }
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
        await togglePromotionStatus(id, !currentStatus)
        // Optimistic update
        setPromotions(prev => prev.map(p => p.id === id ? { ...p, active: !currentStatus } : p))
    } catch (error) {
        console.error(error)
        setSnackbar({ open: true, message: 'Error al cambiar estado', severity: 'error' })
    }
  }

  const columns = [
    { field: 'code', headerName: 'Código', width: 200, renderCell: (params) => <Chip label={params.value} color="primary" variant="outlined" /> },
    { 
        field: 'value', 
        headerName: 'Valor', 
        width: 150, 
        valueGetter: (params, row) => row.type === 'percentage' ? `${row.value}%` : `$${row.value}`
    },
    { field: 'description', headerName: 'Descripción', width: 250 },
    { 
      field: 'active', 
      headerName: 'Activo', 
      width: 100,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => handleToggleStatus(params.row.id, params.value)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 100,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
        </IconButton>
      )
    }
  ]

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Central de Promociones</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
            Nueva Promoción
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={promotions}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Promoción</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Código de Descuento"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              fullWidth
              InputProps={{
                  startAdornment: <InputAdornment position="start"><LocalOfferIcon /></InputAdornment>,
              }}
            />
            <TextField
              label="Porcentaje de Descuento"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              fullWidth
              InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              fullWidth
              multiline
              rows={2}
            />
             <FormControlLabel
                control={
                  <Switch 
                    checked={formData.active} 
                    onChange={(e) => setFormData({...formData, active: e.target.checked})} 
                  />
                }
                label="Activar Inmediatamente"
              />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}
