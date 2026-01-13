'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Typography, Tabs, Tab, Snackbar, Alert } from '@mui/material'

// Config
import { 
  CATEGORIES, 
  INITIAL_PRODUCT_FORM, 
  normalizeProduct, 
  buildProductPayload 
} from './config'

// Components
import CategorySelector from './components/CategorySelector'
import ProductTable from './components/ProductTable'
import ProductEditDialog from './components/ProductEditDialog'
import NewProductForm from './components/NewProductForm'

// Services & Actions
import { updateProductInHierarchy } from '@/firebase/adminServices'
import { fetchDronesProducts, fetchAllProducts } from '@/store/states/shop'

// ============================================================
// ProductPanel - Main product management organism
// ============================================================

function ProductPanel() {
  const dispatch = useDispatch()
  const shop = useSelector((state) => state.shop)
  const loading = shop.loading
  
  // Category selection
  const [selectedCategory, setSelectedCategory] = useState('dronesKit')
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [formData, setFormData] = useState(INITIAL_PRODUCT_FORM)
  
  // Feedback
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  })
  
  // Derived: normalized products for current category
  const products = useMemo(() => {
    const categoryData = shop[selectedCategory] || []
    return categoryData.map((p, idx) => normalizeProduct(p, idx, selectedCategory))
  }, [shop, selectedCategory])
  
  // Load default category on mount
  useEffect(() => {
    if (!shop.dronesKit?.length) {
      dispatch(fetchDronesProducts())
    }
  }, [dispatch, shop.dronesKit])
  
  // ==================== Handlers ====================
  
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory)
    
    // Fetch if not loaded
    if (!shop[newCategory]?.length) {
      const config = CATEGORIES.find(c => c.key === newCategory)
      if (config?.fetchAction) {
        dispatch(config.fetchAction())
      }
    }
  }
  
  const handleEdit = (product) => {
    setCurrentProduct(product)
    // Use standardized English field names that match normalizeProduct output
    setFormData({
      productID: product.productID || '',
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || selectedCategory,
      price: product.price || '',
      stock: product.stock || '',
      discount: product.discount || 0,
      description: product.description || '',
      specifications: product.specifications || '',
      includes: product.includes || '',
      images: product.images?.length ? product.images : [''],
      video: product.video || '',
      tags: product.tags || [],
      active: product.active ?? true,
    })
    setDialogOpen(true)
  }

  
  const handleFormChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }
  
  const handleSave = async () => {
    try {
      // buildProductPayload now handles image filtering internally
      const payload = buildProductPayload(formData)
      
      if (currentProduct?.productID) {
        await updateProductInHierarchy(
          currentProduct.productID, 
          payload, 
          formData.category || currentProduct.category
        )
        
        // Clear cache and refresh
        sessionStorage.clear()
        dispatch(fetchAllProducts())
        
        setSnackbar({ 
          open: true, 
          message: 'Producto actualizado', 
          severity: 'success' 
        })
      } else {
        setSnackbar({ 
          open: true, 
          message: 'Solo se pueden editar productos existentes', 
          severity: 'warning' 
        })
      }
      
      setDialogOpen(false)
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.message, 
        severity: 'error' 
      })
    }
  }
  
  const handleToggleStatus = async (id, currentStatus) => {
    // TODO: Implement toggle in hierarchical structure
    console.log('Toggle status:', id, currentStatus)
  }
  
  // ==================== Render ====================
  
  return (
    <Box>
      {/* Header with Category Selector */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <Typography variant="h6">Inventario</Typography>
        <CategorySelector
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          productCount={products.length}
        />
      </Box>
      
      {/* Product Table */}
      <ProductTable
        products={products}
        loading={loading}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />
      
      {/* Edit Dialog */}
      <ProductEditDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        formData={formData}
        onFormChange={handleFormChange}
        onSave={handleSave}
        isEditing={!!currentProduct}
      />
      
      {/* Snackbar Feedback */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}

// ============================================================
// AdminSettings - Page component with tabs
// ============================================================

export default function AdminSettings() {
  const [tabValue, setTabValue] = useState(0)

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Gestionar Productos
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Gestión de Productos" />
          <Tab label="Añadir nuevo producto" />
        </Tabs>
      </Box>

      {tabValue === 0 && <ProductPanel />}
      
      {tabValue === 1 && (
        <NewProductForm />
      )}
    </Box>
  )
}
