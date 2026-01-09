'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { fetchAllProducts } from '@/store/states/shop'
import { updateProductInHierarchy } from '@/firebase/adminServices'
import { 
  fetchDronesProducts, 
  fetchGooglesProducts, 
  fetchRadioControlProducts,
  fetchAccesoriosProducts,
  fetchTransmisorsProducts,
  fetchDigitalVTXProducts 
} from '@/store/states/shop'

// Category configuration - maps to Redux state keys and fetch actions
const CATEGORIES = [
  { key: 'dronesKit', label: 'Kit Drones', fetchAction: fetchDronesProducts },
  { key: 'dronesRC', label: 'Drones RC', fetchAction: fetchDronesProducts },
  { key: 'dronesHD', label: 'FPV HD (GEPRC)', fetchAction: fetchDronesProducts },
  { key: 'googles', label: 'Googles', fetchAction: fetchGooglesProducts },
  { key: 'radioControl', label: 'Radio Control', fetchAction: fetchRadioControlProducts },
  { key: 'baterias', label: 'Baterías/Accesorios', fetchAction: fetchAccesoriosProducts },
  { key: 'transmisors', label: 'Transmisores', fetchAction: fetchTransmisorsProducts },
  { key: 'receptors', label: 'Receptores', fetchAction: fetchTransmisorsProducts },
  { key: 'digitalVTX', label: 'Digital VTX', fetchAction: fetchDigitalVTXProducts },
]

function ProductPanel() {
  const dispatch = useDispatch()
  const shop = useSelector((state) => state.shop)
  const loading = shop.loading
  
  // Selected category state - default to dronesKit (usually pre-loaded)
  const [selectedCategory, setSelectedCategory] = useState('dronesKit')
  
  // Get products for selected category from Redux store
  const products = useMemo(() => {
    const categoryData = shop[selectedCategory] || []
    // Map field names to consistent names for DataGrid
    return categoryData.map((p, idx) => ({
      ...p,
      id: p.productID || p.id || `product-${idx}`,
      name: p.title || p.productName || p.name || 'Sin Nombre',
      price: p.precio || p.productPrice || p.price || 0,
      stock: p.productStock || p.stock || 0,
      marca: p.marca || p.productBrand || '',
      active: p.active !== undefined ? p.active : true,
      categoria: selectedCategory,
    }))
  }, [shop, selectedCategory])
  
  // Fetch category data when selection changes
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory)
    
    // Check if data already exists in Redux
    if (!shop[newCategory] || shop[newCategory].length === 0) {
      const categoryConfig = CATEGORIES.find(c => c.key === newCategory)
      if (categoryConfig?.fetchAction) {
        dispatch(categoryConfig.fetchAction())
      }
    }
  }
  
  // Load default category on mount if not already loaded
  useEffect(() => {
    if (!shop.dronesKit || shop.dronesKit.length === 0) {
      dispatch(fetchDronesProducts())
    }
  }, [dispatch, shop.dronesKit])
  
  // Dialog State
  const [openDialog, setOpenDialog] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  
  // Initial Form State
  const initialFormState = {
    name: '',
    price: '',
    stock: '',
    description: '',
    imagenes: [''],
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
      
      // Build payload with field names matching Firestore schema
      const payload = {
        productName: formData.name,
        productPrice: parseFloat(formData.price) || 0,
        productStock: parseInt(formData.stock) || 0,
        productDescription: formData.description,
        productImages: validImages,
        productBrand: formData.marca,
        active: formData.active,
        discount: parseFloat(formData.discount) || 0,
        especificaciones: formData.especificaciones,
        incluye: formData.incluye,
      }

      if (currentProduct && currentProduct.productID) {
        // Update existing product in hierarchical structure
        await updateProductInHierarchy(
          currentProduct.productID, 
          payload, 
          currentProduct.categoria
        )
        setSnackbar({ open: true, message: 'Producto actualizado correctamente', severity: 'success' })
        
        // Clear sessionStorage to force refresh on next load
        if (typeof window !== 'undefined') {
          sessionStorage.clear()
        }
        
        // Refresh products from Redux
        dispatch(fetchAllProducts())
      } else {
        setSnackbar({ open: true, message: 'Solo se pueden editar productos existentes', severity: 'warning' })
      }
      
      setOpenDialog(false)
    } catch (error) {
      console.error(error)
      setSnackbar({ open: true, message: `Error: ${error.message}`, severity: 'error' })
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h6">Inventario</Typography>
        
        {/* Category Selector */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={selectedCategory}
            label="Categoría"
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat.key} value={cat.key}>{cat.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Typography variant="body2" color="text.secondary">
          {products.length} productos
        </Typography>
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
