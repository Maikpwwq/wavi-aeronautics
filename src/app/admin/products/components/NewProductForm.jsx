'use client'

/**
 * NewProductForm - Organism component for creating new products
 * 
 * Features:
 * - SessionStorage persistence (auto-save draft)
 * - Duplicate productID prevention
 * - Firebase Storage image uploads via DragAndDropUploader
 * - Full product schema support
 */

import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Switch,
  Typography,
  Paper,
  Divider,
  Alert,
  Snackbar,
  InputAdornment,
  Chip,
  CircularProgress
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import RestoreIcon from '@mui/icons-material/Restore'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

// Config imports
import {
  CATEGORIES,
  CATEGORY_OPTIONS,
  BRAND_OPTIONS,
  DEFAULT_DRONE_OPTIONS,
  PRODUCT_SCHEMA,
  DRAFT_STORAGE_KEY,
  generateProductID,
  generateSlug,
  buildProductPayload
} from '../config'

// Components
import DragAndDropUploader from './molecules/DragAndDropUploader'
import ReorderableImageList from './molecules/ReorderableImageList'

// Services
import { createNewProduct, checkProductIDExists } from '@/firebase/adminServices'
import { fetchAllProducts } from '@/store/states/shop'

// ============================================================
// NewProductForm Component
// ============================================================

export default function NewProductForm() {
  const dispatch = useDispatch()
  
  // Form state
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(PRODUCT_SCHEMA)))
  const [tagInput, setTagInput] = useState('')
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [validationErrors, setValidationErrors] = useState({})

  // ==================== SessionStorage Persistence ====================

  // Load draft on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(DRAFT_STORAGE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setFormData(parsed)
          setHasDraft(true)
        } catch (e) {
          console.error('Error loading draft:', e)
        }
      }
    }
  }, [])

  // Auto-save to sessionStorage on change (debounced)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timeout = setTimeout(() => {
        sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData))
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [formData])
  // ==================== Actions ====================

  const resetForm = useCallback(() => {
    // Deep copy to ensure clean state
    setFormData(JSON.parse(JSON.stringify(PRODUCT_SCHEMA)))
    sessionStorage.removeItem(DRAFT_STORAGE_KEY)
    setValidationErrors({})
    setActiveStep(0)
  }, [])

  // ==================== Form Handlers ====================

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }))
    }
  }, [validationErrors])

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const newTags = tagInput
        .split(/[,;]+/)
        .map(t => t.trim().toLowerCase())
        .filter(t => t && !formData.tags.includes(t))
      
      if (newTags.length > 0) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, ...newTags]
        }))
        setTagInput('')
      }
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }))
  }

  const handleImageUploadComplete = useCallback((urls) => {
    setFormData(prev => ({ 
      ...prev, 
      images: [...(prev.images || prev.imagenes || []), ...urls] 
    }))
  }, [])

  const handleImagesReorder = useCallback((newImages) => {
    setFormData(prev => ({ ...prev, images: newImages }))
  }, [])

  const handleImageDelete = useCallback((urlToDelete) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || prev.imagenes || []).filter(url => url !== urlToDelete)
    }))
  }, [])

  const handleGenerateProductID = () => {
    if (formData.name) {
      const newID = generateProductID(formData.name)
      const newSlug = generateSlug(formData.name)
      setFormData(prev => ({ ...prev, productID: newID, slug: newSlug }))
    } else {
      setSnackbar({
        open: true,
        message: 'Ingresa el nombre del producto primero',
        severity: 'warning'
      })
    }
  }

  const handleClearDraft = () => {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY)
    setFormData(PRODUCT_SCHEMA)
    setHasDraft(false)
    setValidationErrors({})
    setSnackbar({ open: true, message: 'Borrador eliminado', severity: 'info' })
  }

  // ==================== Validation ====================

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name?.trim()) errors.name = 'Nombre requerido'
    if (!formData.productID?.trim()) errors.productID = 'ID de producto requerido'
    if (!formData.brand?.trim()) errors.brand = 'Marca requerida'
    if (!formData.category) errors.category = 'Categoría requerida'
    if (formData.price <= 0) errors.price = 'Precio debe ser mayor a 0'
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ==================== Submit ====================

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Corrige los errores del formulario', severity: 'error' })
      return
    }

    setLoading(true)

    try {
      // Check for duplicate productID
      // Pass brand for precise check in new hierarchy
      const exists = await checkProductIDExists(formData.productID, formData.category, formData.brand)
      if (exists) {
        setValidationErrors(prev => ({ ...prev, productID: 'Este ID ya existe' }))
        setSnackbar({ 
          open: true, 
          message: 'Ya existe un producto con este ID. Genera uno nuevo.', 
          severity: 'error' 
        })
        setLoading(false)
        return
      }

      // Sanitize and submit
      const sanitizedData = buildProductPayload(formData)
      await createNewProduct(sanitizedData)

      // Clear draft and refresh
      sessionStorage.removeItem(DRAFT_STORAGE_KEY)
      setFormData(PRODUCT_SCHEMA)
      setHasDraft(false)
      dispatch(fetchAllProducts())

      setSnackbar({ 
        open: true, 
        message: '¡Producto creado exitosamente!', 
        severity: 'success' 
      })
    } catch (error) {
      console.error('Error creating product:', error)
      setSnackbar({ 
        open: true, 
        message: `Error: ${error.message}`, 
        severity: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  // ==================== Render ====================

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Draft Indicator */}
      {hasDraft && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<RestoreIcon />}
              onClick={handleClearDraft}
            >
              Descartar borrador
            </Button>
          }
        >
          Se ha restaurado un borrador guardado automáticamente.
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        {/* ==================== Basic Info Section ==================== */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Información Básica
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label="Nombre del Producto"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            fullWidth
            required
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="ID Producto (SKU)"
              value={formData.productID || ''}
              onChange={(e) => handleChange('productID', e.target.value.toUpperCase())}
              error={!!validationErrors.productID}
              helperText={validationErrors.productID}
              fullWidth
              required
            />
            <Button 
              variant="outlined" 
              onClick={handleGenerateProductID}
              sx={{ minWidth: 100 }}
            >
              Generar
            </Button>
          </Box>

          <FormControl fullWidth required error={!!validationErrors.brand}>
            <InputLabel>Marca</InputLabel>
            <Select
              value={formData.brand || ''}
              label="Marca"
              onChange={(e) => handleChange('brand', e.target.value)}
            >
              {BRAND_OPTIONS.map((brand) => (
                <MenuItem key={brand} value={brand} sx={{ textTransform: 'capitalize' }}>
                  {brand.replace('-', ' ')}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{validationErrors.brand}</FormHelperText>
          </FormControl>

          <FormControl fullWidth required error={!!validationErrors.category}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={formData.category || ''}
              label="Categoría"
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{validationErrors.category}</FormHelperText>
          </FormControl>
        </Box>

        {/* Tags */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              label="Agregar Tag"
              placeholder="Tag1, Tag2, Tag3..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              size="small"
              sx={{ maxWidth: 200 }}
            />
            <Button variant="outlined" size="small" onClick={handleAddTag}>
              <AddIcon />
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {formData.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                size="small"
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ==================== Pricing Section ==================== */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Precio e Inventario
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          <TextField
            label="Precio (USD)"
            type="number"
            value={formData.price || ''}
            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            error={!!validationErrors.price}
            helperText={validationErrors.price}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
            required
          />

          <TextField
            label="Stock"
            type="number"
            value={formData.stock || ''}
            onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
          />

          <TextField
            label="Descuento (%)"
            type="number"
            value={formData.discount || ''}
            onChange={(e) => handleChange('discount', parseFloat(e.target.value) || 0)}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>
            }}
          />
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={formData.active !== undefined ? formData.active : true}
              onChange={(e) => handleChange('active', e.target.checked)}
            />
          }
          label="Producto Activo (Visible en tienda)"
          sx={{ mt: 2 }}
        />

        {/* ==================== Options Section (for drones) ==================== */}
        {(formData.category === 'dronesRC' || formData.category === 'dronesHD') && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Opciones de Producto
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Define las variantes disponibles para este dron (ej: tipo de receptor). El modificador de precio se suma al precio base.
            </Alert>
            
            {/* Pre-populate button */}
            {(!formData.options || formData.options.length === 0) && (
              <Button
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
                onClick={() => handleChange('options', [...DEFAULT_DRONE_OPTIONS])}
              >
                Cargar opciones predeterminadas
              </Button>
            )}

            {/* Options List */}
            {(formData.options || []).map((opt, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <TextField
                  label="Etiqueta"
                  value={opt.label || ''}
                  onChange={(e) => {
                    const newOptions = [...(formData.options || [])]
                    newOptions[idx] = { ...newOptions[idx], label: e.target.value }
                    handleChange('options', newOptions)
                  }}
                  size="small"
                  sx={{ flex: 2 }}
                />
                <TextField
                  label="Modificador ($)"
                  type="number"
                  value={opt.priceModifier || 0}
                  onChange={(e) => {
                    const newOptions = [...(formData.options || [])]
                    newOptions[idx] = { ...newOptions[idx], priceModifier: parseFloat(e.target.value) || 0 }
                    handleChange('options', newOptions)
                  }}
                  size="small"
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">+$</InputAdornment>
                  }}
                />
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    const newOptions = (formData.options || []).filter((_, i) => i !== idx)
                    handleChange('options', newOptions)
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </Box>
            ))}

            {/* Add Option Button */}
            <Button
              variant="text"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleChange('options', [...(formData.options || []), { label: '', priceModifier: 0 }])}
            >
              Agregar Opción
            </Button>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* ==================== Media Section ==================== */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Imágenes y Video
        </Typography>

        {/* Storage path info message */}
        <Alert severity="info" sx={{ mb: 2 }} icon={false}>
          <Typography variant="body2">
            📁 Las imágenes se guardarán en: <strong>product-images/{formData.category || '[categoría]'}/{formData.brand || '[marca]'}/</strong>
          </Typography>
          {(!formData.category || !formData.brand) && (
            <Typography variant="caption" color="text.secondary">
              Selecciona categoría y marca arriba antes de subir imágenes.
            </Typography>
          )}
        </Alert>

        <DragAndDropUploader
          key={`${formData.category}-${formData.brand}`}
          storagePath={`product-images/${formData.category || 'temp'}/${formData.brand || 'no-brand'}`}
          onUploadComplete={handleImageUploadComplete}
          existingImages={[]}
          maxFiles={10}
          disabled={!formData.category || !formData.brand}
        />

        <Box sx={{ mt: 2 }}>
          <ReorderableImageList
            images={formData.images || formData.imagenes || []}
            onChange={handleImagesReorder}
            onDelete={handleImageDelete}
          />
        </Box>

        <TextField
          label="URL de Video (YouTube/Vimeo)"
          value={formData.video}
          onChange={(e) => handleChange('video', e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
          placeholder="https://youtube.com/watch?v=..."
        />

        <Divider sx={{ my: 3 }} />

        {/* ==================== Details Section ==================== */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Descripción y Especificaciones
        </Typography>

        <TextField
          label="Descripción"
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          multiline
          rows={4}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Especificaciones Técnicas"
          value={formData.specifications || ''}
          onChange={(e) => handleChange('specifications', e.target.value)}
          multiline
          rows={3}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="* Motor: 1404 4500KV&#10;* Peso: 100g&#10;* FC: F4 AIO"
        />

        <TextField
          label="Incluye (Contenido de la caja)"
          value={formData.includes || ''}
          onChange={(e) => handleChange('includes', e.target.value)}
          multiline
          rows={3}
          fullWidth
          placeholder="* 1x Frame&#10;* 4x Props&#10;* 1x Manual"
        />

        <Divider sx={{ my: 3 }} />

        {/* ==================== Submit Button ==================== */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleClearDraft}
            disabled={loading}
          >
            Limpiar
          </Button>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSubmit}
            disabled={loading}
            size="large"
          >
            {loading ? 'Guardando...' : 'Crear Producto'}
          </Button>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}
