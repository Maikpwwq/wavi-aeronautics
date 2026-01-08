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
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Tabs,
  Tab
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { getAllProducts, createProduct, updateProduct, toggleProductStatus } from '@/firebase/adminServices'

function ProductPanel() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Dialog State
  const [openDialog, setOpenDialog] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    active: true,
    discount: 0
  })

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getAllProducts()
      setProducts(data)
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: 'Error al cargar productos', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleOpenDialog = (product = null) => {
    if (product) {
      setCurrentProduct(product)
      setFormData({
        name: product.name || '',
        price: product.price || '',
        stock: product.stock || '',
        description: product.description || '',
        image: product.image || '',
        active: product.active !== undefined ? product.active : true,
        discount: product.discount || 0
      })
    } else {
      setCurrentProduct(null)
      setFormData({
        name: '',
        price: '',
        stock: '',
        description: '',
        image: '',
        active: true,
        discount: 0
      })
    }
    setOpenDialog(true)
  }

  const handleSave = async () => {
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        image: formData.image, // URL
        active: formData.active,
        discount: parseFloat(formData.discount)
      }

      if (currentProduct) {
        await updateProduct(currentProduct.id, payload)
        setSnackbar({ open: true, message: 'Producto actualizado', severity: 'success' })
      } else {
        await createProduct(payload)
        setSnackbar({ open: true, message: 'Producto creado', severity: 'success' })
      }
      
      setOpenDialog(false)
      fetchProducts()
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: 'Error al guardar producto', severity: 'error' })
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleProductStatus(id, !currentStatus)
      // Optimistic update
      setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !currentStatus } : p))
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: 'Error al cambiar estado', severity: 'error' })
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'name', headerName: 'Nombre', width: 200 },
    { 
      field: 'price', 
      headerName: 'Precio', 
      width: 100,
      valueFormatter: (params) => {
         // DataGrid v6+ valueFormatter params is the value itself usually
         // Safe check
         if (params.value == null) return ''
         return `$${params.value}`
      }
    },
    { field: 'stock', headerName: 'Stock', width: 100 },
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
    { field: 'discount', headerName: 'Descuento (%)', width: 120 },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params) => (
        <Button variant="outlined" size="small" onClick={() => handleOpenDialog(params.row)}>
          Editar
        </Button>
      )
    }
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Inventario</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>Nuevo Producto</Button>
      </Box>
      
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={products}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{currentProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nombre del Producto"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Precio ($)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                fullWidth
              />
              <TextField
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                fullWidth
              />
            </Box>
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="URL de Imagen"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              fullWidth
              helperText="Pega aquí el enlace directo a la imagen"
            />
             <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
               <TextField
                label="Descuento Individual (%)"
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                sx={{ width: '200px' }}
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={formData.active} 
                    onChange={(e) => setFormData({...formData, active: e.target.checked})} 
                  />
                }
                label="Producto Activo (Visible en tienda)"
              />
            </Box>
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

export default function AdminSettings() {
  const [tabValue, setTabValue] = useState(0)

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Configuración y Productos</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Gestión de Productos" />
          <Tab label="Configuración General" />
        </Tabs>
      </Box>

      {tabValue === 0 && <ProductPanel />}
      
      {tabValue === 1 && (
        <Box>
          <Typography variant="body1">Configuraciones generales del sitio (en construcción).</Typography>
          {/* Future implementation for global discounts or other settings if not in /promotions */}
        </Box>
      )}
    </Box>
  )
}
