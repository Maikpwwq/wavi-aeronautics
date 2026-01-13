'use client'

import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box, 
  FormControlLabel, 
  Switch, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Typography,
  Chip,
  Stack
} from '@mui/material'
import { CATEGORY_OPTIONS, BRAND_OPTIONS } from '../config'

/**
 * ProductEditDialog - Organism component for editing product details
 * 
 * @param {boolean} open - Dialog open state
 * @param {function} onClose - Close callback
 * @param {Object} formData - Current form values
 * @param {function} onFormChange - Form field change handler
 * @param {function} onSave - Save callback
 * @param {boolean} isEditing - True if editing existing product
 */
export default function ProductEditDialog({ 
  open, 
  onClose, 
  formData, 
  onFormChange, 
  onSave,
  isEditing = false
}) {
  // Image array handlers (use English 'images', fallback to 'imagenes')
  const handleAddImage = () => {
    const currentImages = formData.images || formData.imagenes || []
    onFormChange({ images: [...currentImages, ''] })
  }

  const handleImageChange = (index, value) => {
    const currentImages = formData.images || formData.imagenes || []
    const newImages = [...currentImages]
    newImages[index] = value
    onFormChange({ images: newImages })
  }

  const handleRemoveImage = (index) => {
    const currentImages = formData.images || formData.imagenes || []
    const newImages = currentImages.filter((_, i) => i !== index)
    onFormChange({ images: newImages })
  }

  // Tags handler (comma-separated input)
  const handleTagsChange = (e) => {
    const tagsString = e.target.value
    // Store as array, display as comma-separated
    const tagsArray = tagsString.split(',').map(t => t.trim()).filter(Boolean)
    onFormChange({ tags: tagsArray })
  }

  const tagsDisplayValue = Array.isArray(formData.tags) ? formData.tags.join(', ') : ''

  // Get brand value (support both 'brand' and 'marca' for compatibility)
  const brandValue = formData.brand || formData.marca || ''

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          
          {/* Basic Info */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Nombre del Producto"
              value={formData.name || formData.titulo || ''}
              onChange={(e) => onFormChange({ name: e.target.value, titulo: e.target.value })}
              fullWidth
            />
            <TextField
              label="ID Producto (SKU)"
              value={formData.productID || ''}
              onChange={(e) => onFormChange({ productID: e.target.value })}
              fullWidth
              disabled={isEditing}
            />
          </Box>

          {/* Brand & Category Row */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Marca</InputLabel>
              <Select
                value={brandValue}
                label="Marca"
                onChange={(e) => onFormChange({ brand: e.target.value, marca: e.target.value })}
              >
                {BRAND_OPTIONS.map((brand) => (
                  <MenuItem key={brand} value={brand} sx={{ textTransform: 'capitalize' }}>
                    {brand.replace('-', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={formData.categoria || formData.category || ''}
                label="Categoría"
                onChange={(e) => onFormChange({ categoria: e.target.value, category: e.target.value })}
                disabled={isEditing}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Pricing */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Precio ($)"
              type="number"
              value={formData.price || formData.precio || ''}
              onChange={(e) => onFormChange({ price: e.target.value, precio: e.target.value })}
              fullWidth
            />
            <TextField
              label="Stock"
              type="number"
              value={formData.stock || ''}
              onChange={(e) => onFormChange({ stock: e.target.value })}
              fullWidth
            />
            <TextField
              label="Descuento (%)"
              type="number"
              value={formData.discount || ''}
              onChange={(e) => onFormChange({ discount: e.target.value })}
              fullWidth
            />
          </Box>

          {/* Detailed Info */}
          <TextField
            label="Descripción"
            value={formData.description || formData.descripcion || ''}
            onChange={(e) => onFormChange({ description: e.target.value, descripcion: e.target.value })}
            multiline
            rows={2}
            fullWidth
          />
          <TextField
            label="Especificaciones"
            value={formData.specifications || formData.especificaciones || ''}
            onChange={(e) => onFormChange({ specifications: e.target.value })}
            multiline
            rows={2}
            fullWidth
            placeholder="Detalles técnicos..."
          />
          <TextField
            label="Incluye (Qué viene en la caja)"
            value={formData.includes || formData.incluye || ''}
            onChange={(e) => onFormChange({ includes: e.target.value })}
            multiline
            rows={2}
            fullWidth
          />

          {/* Video & Tags */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Video URL (YouTube)"
              value={formData.video || ''}
              onChange={(e) => onFormChange({ video: e.target.value })}
              fullWidth
              placeholder="https://youtube.com/watch?v=..."
            />
            <TextField
              label="Tags (separadas por coma)"
              value={tagsDisplayValue}
              onChange={handleTagsChange}
              fullWidth
              placeholder="fpv, drone, racing"
            />
          </Box>

          {/* Tags Preview */}
          {formData.tags && formData.tags.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
              {formData.tags.map((tag, i) => (
                <Chip key={i} label={tag} size="small" onDelete={() => {
                  const newTags = formData.tags.filter((_, idx) => idx !== i)
                  onFormChange({ tags: newTags })
                }} />
              ))}
            </Stack>
          )}

          {/* Images */}
          <Typography variant="subtitle2" sx={{ mt: 1 }}>Imágenes</Typography>
          {(formData.images || formData.imagenes || []).map((url, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label={`URL Imagen ${index + 1}`}
                value={typeof url === 'string' ? url : url?.url || ''}
                onChange={(e) => handleImageChange(index, e.target.value)}
                fullWidth
                size="small"
              />
              <Button 
                color="error" 
                onClick={() => handleRemoveImage(index)}
                sx={{ minWidth: 40 }}
              >
                X
              </Button>
            </Box>
          ))}
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleAddImage} 
            sx={{ alignSelf: 'start' }}
          >
            + Agregar Imagen
          </Button>

          {/* Status */}
          <FormControlLabel
            control={
              <Switch 
                checked={formData.active !== false} 
                onChange={(e) => onFormChange({ active: e.target.checked })} 
              />
            }
            label="Producto Activo (Visible en tienda)"
          />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  )
}

