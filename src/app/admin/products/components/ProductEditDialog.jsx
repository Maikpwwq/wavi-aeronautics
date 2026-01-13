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
  Stack,
  Divider
} from '@mui/material'
import { CATEGORY_OPTIONS, BRAND_OPTIONS } from '../config'

// Components
import ReorderableImageList from './molecules/ReorderableImageList'
import DragAndDropUploader from './molecules/DragAndDropUploader'

/**
 * ProductEditDialog - Organism component for editing product details
 * 
 * Features:
 * - Tags: Comma-separated input with chip display
 * - Images: Reorderable grid with drag-and-drop + Upload capability
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
  // Get current images (support both field names)
  const currentImages = formData.images || formData.imagenes || []

  // Image handlers
  const handleImagesChange = (newImages) => {
    onFormChange({ images: newImages })
  }

  const handleImageDelete = (urlToDelete) => {
    const newImages = currentImages.filter(url => url !== urlToDelete)
    onFormChange({ images: newImages })
  }

  const handleUploadComplete = (newUrls) => {
    // Append newly uploaded images to existing list
    onFormChange({ images: newUrls })
  }

  // Tags handler (comma-separated input)
  const handleTagsChange = (e) => {
    const tagsString = e.target.value
    const tagsArray = tagsString.split(',').map(t => t.trim()).filter(Boolean)
    onFormChange({ tags: tagsArray })
  }

  const handleTagDelete = (indexToDelete) => {
    const newTags = (formData.tags || []).filter((_, idx) => idx !== indexToDelete)
    onFormChange({ tags: newTags })
  }

  const tagsDisplayValue = Array.isArray(formData.tags) ? formData.tags.join(', ') : ''

  // Get brand/category values for storage path
  const brandValue = formData.brand || formData.marca || ''
  const categoryValue = formData.category || formData.categoria || ''

  // Build storage path for uploader
  const storagePath = brandValue && categoryValue 
    ? `product-images/${categoryValue}/${brandValue}`
    : 'product-images/temp'

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
              onChange={(e) => onFormChange({ name: e.target.value })}
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
                onChange={(e) => onFormChange({ brand: e.target.value })}
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
                value={categoryValue}
                label="Categoría"
                onChange={(e) => onFormChange({ category: e.target.value })}
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
              onChange={(e) => onFormChange({ price: e.target.value })}
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
            onChange={(e) => onFormChange({ description: e.target.value })}
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

          {/* Video */}
          <TextField
            label="Video URL (YouTube)"
            value={formData.video || ''}
            onChange={(e) => onFormChange({ video: e.target.value })}
            fullWidth
            placeholder="https://youtube.com/watch?v=..."
          />

          <Divider sx={{ my: 1 }} />

          {/* Tags Section */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <TextField
              label="Agregar tags (separadas por coma)"
              value={tagsDisplayValue}
              onChange={handleTagsChange}
              fullWidth
              size="small"
              placeholder="fpv, drone, racing, geprc"
              helperText="Escribe tags separadas por comas y presiona fuera del campo"
            />
            {formData.tags && formData.tags.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" rowGap={1} sx={{ mt: 1 }}>
                {formData.tags.map((tag, i) => (
                  <Chip 
                    key={i} 
                    label={tag} 
                    size="small" 
                    onDelete={() => handleTagDelete(i)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            )}
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Images Section */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Imágenes del Producto
            </Typography>
            
            {/* Reorderable Image Grid */}
            <ReorderableImageList
              images={currentImages}
              onChange={handleImagesChange}
              onDelete={handleImageDelete}
            />

            {/* Upload New Images */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Subir nuevas imágenes:
              </Typography>
              <DragAndDropUploader
                storagePath={storagePath}
                onUploadComplete={handleUploadComplete}
                existingImages={currentImages}
                maxFiles={10}
                disabled={!brandValue || !categoryValue}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

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
