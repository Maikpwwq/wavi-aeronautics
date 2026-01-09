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
  Typography
} from '@mui/material'
import { CATEGORY_OPTIONS } from '../config'

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
  // Image array handlers
  const handleAddImage = () => {
    onFormChange({ imagenes: [...formData.imagenes, ''] })
  }

  const handleImageChange = (index, value) => {
    const newImages = [...formData.imagenes]
    newImages[index] = value
    onFormChange({ imagenes: newImages })
  }

  const handleRemoveImage = (index) => {
    const newImages = formData.imagenes.filter((_, i) => i !== index)
    onFormChange({ imagenes: newImages })
  }

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
              value={formData.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              fullWidth
            />
            <TextField
              label="ID Producto (SKU)"
              value={formData.productID}
              onChange={(e) => onFormChange({ productID: e.target.value })}
              fullWidth
              disabled={isEditing}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Marca"
              value={formData.marca}
              onChange={(e) => onFormChange({ marca: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={formData.categoria}
                label="Categoría"
                onChange={(e) => onFormChange({ categoria: e.target.value })}
                disabled={isEditing}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Pricing */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Precio ($)"
              type="number"
              value={formData.price}
              onChange={(e) => onFormChange({ price: e.target.value })}
              fullWidth
            />
            <TextField
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={(e) => onFormChange({ stock: e.target.value })}
              fullWidth
            />
            <TextField
              label="Descuento (%)"
              type="number"
              value={formData.discount}
              onChange={(e) => onFormChange({ discount: e.target.value })}
              fullWidth
            />
          </Box>

          {/* Detailed Info */}
          <TextField
            label="Descripción"
            value={formData.description}
            onChange={(e) => onFormChange({ description: e.target.value })}
            multiline
            rows={2}
            fullWidth
          />
          <TextField
            label="Especificaciones"
            value={formData.especificaciones}
            onChange={(e) => onFormChange({ especificaciones: e.target.value })}
            multiline
            rows={2}
            fullWidth
            placeholder="Detalles técnicos..."
          />
          <TextField
            label="Incluye (Qué viene en la caja)"
            value={formData.incluye}
            onChange={(e) => onFormChange({ incluye: e.target.value })}
            multiline
            rows={2}
            fullWidth
          />

          {/* Images */}
          <Typography variant="subtitle2" sx={{ mt: 1 }}>Imágenes</Typography>
          {formData.imagenes.map((url, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label={`URL Imagen ${index + 1}`}
                value={url}
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
                checked={formData.active} 
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
