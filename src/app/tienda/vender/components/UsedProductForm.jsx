'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Paper,
  Divider,
  Alert,
  Snackbar,
  InputAdornment,
  Grid,
  CircularProgress,
  IconButton
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import RestoreIcon from '@mui/icons-material/Restore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

import {
  USED_CATEGORIES,
  USED_CONDITIONS,
  USED_PHOTO_CONSTRAINTS,
  USED_DRAFT_STORAGE_KEY,
  formatCopCurrency
} from '@/utilities/usedProductsConfig'
import { createUsedListing } from '@/services/usedProductsService'

export default function UsedProductForm() {
  const router = useRouter()
  const user = useSelector((state) => state.user)

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brand: '',
    condition: 'like_new',
    description: '',
    priceCop: '',
    contactPhone: user?.phoneNumber || ''
  })

  // Selected File objects for dropzone
  const [files, setFiles] = useState([])
  const [filePreviews, setFilePreviews] = useState([])

  // UI state
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [draftRestored, setDraftRestored] = useState(false)

  // Pre-fill phone if available in user state or sessionStorage
  useEffect(() => {
    if (!formData.contactPhone) {
      const storedUser = typeof window !== 'undefined' ? sessionStorage.getItem('wavi_user') : null
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          if (parsed.phoneNumber) {
            setFormData(prev => ({ ...prev, contactPhone: parsed.phoneNumber }))
          }
        } catch (e) {}
      }
    }
  }, [])

  // Auto-restore draft from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDraft = sessionStorage.getItem(USED_DRAFT_STORAGE_KEY)
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft)
          if (parsed && typeof parsed === 'object') {
            setFormData(parsed)
            setDraftRestored(true)
          }
        } catch (e) {
          console.error('Failed to parse draft:', e)
        }
      }
    }
  }, [])

  // Auto-save draft on form changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(USED_DRAFT_STORAGE_KEY, JSON.stringify(formData))
    }
  }, [formData])

  // Clear draft
  const handleClearDraft = () => {
    if (window.confirm('¿Deseas borrar el borrador guardado y limpiar el formulario?')) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(USED_DRAFT_STORAGE_KEY)
      }
      setFormData({
        title: '',
        category: '',
        brand: '',
        condition: 'like_new',
        description: '',
        priceCop: '',
        contactPhone: user?.phoneNumber || ''
      })
      setFiles([])
      setFilePreviews([])
      setDraftRestored(false)
    }
  }

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Dropzone Setup
  const onDrop = useCallback((acceptedFiles) => {
    setErrorMsg('')
    const totalFiles = files.length + acceptedFiles.length
    if (totalFiles > USED_PHOTO_CONSTRAINTS.MAX_PHOTOS) {
      setErrorMsg(`Puedes subir un máximo de ${USED_PHOTO_CONSTRAINTS.MAX_PHOTOS} fotos.`)
      return
    }

    const newFiles = [...files, ...acceptedFiles]
    setFiles(newFiles)

    // Generate blob preview URLs
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file))
    setFilePreviews(prev => [...prev, ...newPreviews])
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: USED_PHOTO_CONSTRAINTS.MAX_FILE_SIZE_MB * 1024 * 1024
  })

  // Remove individual photo
  const handleRemovePhoto = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    const updatedPreviews = filePreviews.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    setFilePreviews(updatedPreviews)
  }

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!user?.uid) {
      setErrorMsg('Debes iniciar sesión para publicar un equipo.')
      return
    }

    if (!formData.title.trim()) {
      setErrorMsg('El título de la publicación es obligatorio.')
      return
    }

    if (!formData.category) {
      setErrorMsg('Por favor selecciona una categoría.')
      return
    }

    if (!formData.priceCop || isNaN(formData.priceCop) || Number(formData.priceCop) <= 0) {
      setErrorMsg('Ingresa un precio válido en COP mayores a 0.')
      return
    }

    if (!formData.contactPhone.trim()) {
      setErrorMsg('Ingresa un número telefónico/WhatsApp para recibir ofertas.')
      return
    }

    if (files.length < USED_PHOTO_CONSTRAINTS.MIN_PHOTOS) {
      setErrorMsg(`Por favor adjunta al menos ${USED_PHOTO_CONSTRAINTS.MIN_PHOTOS} fotos de tu equipo.`)
      return
    }

    setLoading(true)

    try {
      await createUsedListing(
        {
          sellerId: user.uid,
          sellerName: user.displayName || user.email?.split('@')[0] || 'Vendedor',
          sellerEmail: user.email || '',
          contactPhone: formData.contactPhone.trim(),
          title: formData.title.trim(),
          category: formData.category,
          brand: formData.brand.trim(),
          condition: formData.condition,
          description: formData.description.trim(),
          priceCop: Number(formData.priceCop)
        },
        files
      )

      // Clear draft on success
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(USED_DRAFT_STORAGE_KEY)
      }

      setSuccessMsg('¡Publicación creada exitosamente! Ya se encuentra visible en la tienda pública.')

      setTimeout(() => {
        router.push('/tienda/mis-publicaciones')
      }, 2000)
    } catch (err) {
      console.error(err)
      setErrorMsg(err.message || 'Error al guardar la publicación.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, maxWidth: '850px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Vender mi equipo usado
        </Typography>
        {draftRestored && (
          <Button
            size="small"
            startIcon={<RestoreIcon />}
            onClick={handleClearDraft}
            color="secondary"
          >
            Limpiar Borrador
          </Button>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Publica tu drone, radio, goggles o accesorio de segunda mano. Tu anuncio será visible de inmediato en la tienda pública. (Duración: 60 días).
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />} sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Título del producto"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Drone FPV GEPRC Mark5 HD O3 - Excelente estado"
              helperText="Sé descriptivo incluyendo marca o modelo principal"
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="category-select-label">Categoría</InputLabel>
              <Select
                labelId="category-select-label"
                name="category"
                value={formData.category}
                label="Categoría"
                onChange={handleChange}
              >
                {USED_CATEGORIES.map((cat) => (
                  <MenuItem key={cat.key} value={cat.key}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Solo equipos de hardware físico</FormHelperText>
            </FormControl>
          </Grid>

          {/* Brand */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Marca (Opcional)"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Ej: DJI, GEPRC, BetaFPV, RadioMaster, TBS"
            />
          </Grid>

          {/* Condition */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="condition-select-label">Estado / Condición</InputLabel>
              <Select
                labelId="condition-select-label"
                name="condition"
                value={formData.condition}
                label="Estado / Condición"
                onChange={handleChange}
              >
                {USED_CONDITIONS.map((cond) => (
                  <MenuItem key={cond.key} value={cond.key}>
                    {cond.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Price (COP) */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              type="number"
              label="Precio en COP ($)"
              name="priceCop"
              value={formData.priceCop}
              onChange={handleChange}
              placeholder="1250000"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                endAdornment: <InputAdornment position="end">COP</InputAdornment>
              }}
              helperText={formData.priceCop ? `Valor: ${formatCopCurrency(formData.priceCop)}` : 'Ingresa valor numérico directo'}
            />
          </Grid>

          {/* Contact Phone (WhatsApp) */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Teléfono / WhatsApp de contacto"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="573001234567"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WhatsAppIcon sx={{ color: '#25D366' }} />
                  </InputAdornment>
                )
              }}
              helperText="Los compradores te contactarán directamente a este número"
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Descripción detallada"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalla tiempo de uso, accesorios incluidos, componentes reemplazados, motivos de venta, etc."
            />
          </Grid>

          {/* Drag & Drop Photo Upload */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Fotos del producto (Mínimo {USED_PHOTO_CONSTRAINTS.MIN_PHOTOS}, Máximo {USED_PHOTO_CONSTRAINTS.MAX_PHOTOS})
            </Typography>

            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed #00aCe4',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                backgroundColor: isDragActive ? 'rgba(0, 172, 228, 0.08)' : '#fafafa',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 172, 228, 0.04)'
                }
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 48, color: '#00aCe4', mb: 1 }} />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {isDragActive
                  ? 'Sueltas las imágenes aquí...'
                  : 'Arrastra y suelta aquí las fotos de tu equipo, o haz clic para examinar'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Formatos permitidos: JPG, PNG, WEBP. Máx {USED_PHOTO_CONSTRAINTS.MAX_FILE_SIZE_MB}MB por foto.
              </Typography>
            </Box>

            {/* Photo Previews */}
            {filePreviews.length > 0 && (
              <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                {filePreviews.map((src, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid #ddd',
                      backgroundColor: '#fff'
                    }}
                  >
                    <Box
                      component="img"
                      src={src}
                      alt={`Foto ${index + 1}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemovePhoto(index)}
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: '#fff',
                        '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.8)' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Grid>

          {/* Submit Action */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              sx={{ px: 4, fontWeight: 700 }}
            >
              {loading ? 'Publicando...' : 'Publicar mi Equipo'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}
