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
  
  // Initial Form State
  const initialFormState = {
    name: '',
    price: '',
    stock: '',
    description: '',
    imagenes: [''], // Array of URLs
    active: true,
    discount: 0,
    categoria: '',
    especificaciones: '',
    incluye: '',
    marca: '',
    productID: ''
  }
  
  const [formData, setFormData] = useState(initialFormState)

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
        imagenes: Array.isArray(product.imagenes) && product.imagenes.length > 0 ? product.imagenes : [product.image || ''],
        active: product.active !== undefined ? product.active : true,
        discount: product.discount || 0,
        categoria: product.categoria || '',
        especificaciones: product.especificaciones || '',
        incluye: product.incluye || '',
        marca: product.marca || '',
        productID: product.productID || ''
      })
    } else {
      setCurrentProduct(null)
      setFormData(initialFormState)
    }
    setOpenDialog(true)
  }

  const handleSave = async () => {
    try {
      // Filter out empty image URLs
      const validImages = formData.imagenes.filter(url => url.trim() !== '')
      
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        description: formData.description,
        imagenes: validImages,
        image: validImages.length > 0 ? validImages[0] : '', // Backward compatibility for main image
        active: formData.active,
        discount: parseFloat(formData.discount) || 0,
        categoria: formData.categoria,
        especificaciones: formData.especificaciones,
        incluye: formData.incluye,
        marca: formData.marca,
        productID: formData.productID
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
      setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !currentStatus } : p))
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: 'Error al cambiar estado', severity: 'error' })
    }
  }
  
  // Image Array Handlers
  const handleAddImage = () => {
    setFormData({ ...formData, imagenes: [...formData.imagenes, ''] })
  }

  const handleImageChange = (index, value) => {
    const newImages = [...formData.imagenes]
    newImages[index] = value
    setFormData({ ...formData, imagenes: newImages })
  }

  const handleRemoveImage = (index) => {
    const newImages = formData.imagenes.filter((_, i) => i !== index)
    setFormData({ ...formData, imagenes: newImages })
  }

  const columns = [
    { field: 'productID', headerName: 'ID Producto', width: 120 },
    { field: 'name', headerName: 'Nombre', width: 200 },
    { field: 'marca', headerName: 'Marca', width: 120 },
    { field: 'categoria', headerName: 'Categoría', width: 130 },
    { 
      field: 'price', 
      headerName: 'Precio', 
      width: 100,
      valueFormatter: (params) => params.value ? `$${params.value}` : ''
    },
    { field: 'stock', headerName: 'Stock', width: 80 },
    { 
      field: 'active', 
      headerName: 'Activo', 
      width: 80,
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
        <Button variant="outlined" size="small" onClick={() => handleOpenDialog(params.row)}>
          Editar
        </Button>
      )
    }
  ]
  
  const categories = [
    'Googles', 
    'radioControl', 
    'baterias', 
    'dronesRC', 
    'digitalVTX', 
    'FPV HD', 
    'dronesKits', 
    'transmisors', 
    'receptors'
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Inventario</Typography>
        <Button variant="contained" onClick={() => handleOpenDialog()}>Nuevo Producto</Button>
      </Box>
      
      <Paper sx={{ height: 600, width: '100%' }}>
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
            
            {/* Basic Info */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Nombre del Producto"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                fullWidth
              />
               <TextField
                label="ID Producto (SKU)"
                value={formData.productID}
                onChange={(e) => setFormData({...formData, productID: e.target.value})}
                fullWidth
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Marca"
                value={formData.marca}
                onChange={(e) => setFormData({...formData, marca: e.target.value})}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.categoria}
                  label="Categoría"
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

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
               <TextField
                label="Descuento (%)"
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                fullWidth
              />
            </Box>

            {/* Detailed Info */}
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              multiline
              rows={3}
              fullWidth
            />
             <TextField
              label="Especificaciones"
              value={formData.especificaciones}
              onChange={(e) => setFormData({...formData, especificaciones: e.target.value})}
              multiline
              rows={3}
              fullWidth
              placeholder="Detalles técnicos..."
            />
             <TextField
              label="Incluye (Qué viene en la caja)"
              value={formData.incluye}
              onChange={(e) => setFormData({...formData, incluye: e.target.value})}
              multiline
              rows={2}
              fullWidth
            />

            {/* Image URLs Handling */}
            <Typography variant="subtitle1" sx={{ mt: 1 }}>Imágenes</Typography>
            {formData.imagenes.map((url, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label={`URL Imagen ${index + 1}`}
                  value={url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  fullWidth
                  size="small"
                />
                <Button color="error" onClick={() => handleRemoveImage(index)}>X</Button>
              </Box>
            ))}
            <Button variant="outlined" size="small" onClick={handleAddImage} sx={{ alignSelf: 'start' }}>
              Agregar URL de Imagen
            </Button>

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
