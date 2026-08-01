'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  TextField,
  Divider,
  Grid,
  CircularProgress
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BlockIcon from '@mui/icons-material/Block'
import DeleteIcon from '@mui/icons-material/Delete'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

import { formatCopCurrency, USED_CONDITIONS, USED_STATUS } from '@/utilities/usedProductsConfig'

export default function ModerateListingDialog({ open, listing, onClose, onUpdateStatus, onDelete }) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!listing) return null

  const {
    listingId,
    title,
    sellerName,
    sellerEmail,
    sellerPhone,
    brand,
    condition,
    category,
    priceCop,
    description,
    images,
    status
  } = listing

  const conditionObj = USED_CONDITIONS.find((c) => c.key === condition)

  const handleVerify = async () => {
    setLoading(true)
    try {
      await onUpdateStatus(listingId, USED_STATUS.VERIFIED)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = async () => {
    if (!rejectionReason.trim()) {
      alert('Ingresa el motivo de la desactivación.')
      return
    }
    setLoading(true)
    try {
      await onUpdateStatus(listingId, USED_STATUS.DISABLED, rejectionReason.trim())
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar permanentemente este anuncio?')) {
      setLoading(true)
      try {
        await onDelete(listingId, images)
        onClose()
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        Moderación de Publicación: {title}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Images preview */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                component="img"
                src={images?.[0] || '/static/images/drone-placeholder.jpg'}
                alt={title}
                sx={{ width: '100%', height: 240, objectFit: 'contain', borderRadius: 2, border: '1px solid #ccc', bg: '#fff' }}
              />
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', py: 1 }}>
                {images?.map((url, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={url}
                    alt={`Preview ${idx}`}
                    sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1, border: '1px solid #ddd' }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 800, mb: 1 }}>
              {formatCopCurrency(priceCop)}
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Categoría: <strong>{category}</strong> | Marca: <strong>{brand}</strong>
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Estado: <strong>{conditionObj?.label || condition}</strong>
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Datos del Vendedor:
            </Typography>
            <Typography variant="body2">Nombre: {sellerName}</Typography>
            <Typography variant="body2">Email: {sellerEmail}</Typography>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <WhatsAppIcon sx={{ color: '#25D366', fontSize: 18 }} /> {sellerPhone}
            </Typography>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Descripción del producto:
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', maxH: 150, overflowY: 'auto' }}>
              {description}
            </Typography>
          </Grid>

          {/* Reject Input */}
          {showRejectInput && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, border: '1px solid #f44336', borderRadius: 2, backgroundColor: 'rgba(244, 67, 54, 0.05)' }}>
                <Typography variant="subtitle2" color="error" sx={{ mb: 1, fontWeight: 700 }}>
                  Indica el motivo de desactivación / incumplimiento:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ej: Contenido inapropiado, datos erróneos o fotos inadecuadas."
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, justifyContent: 'flex-end' }}>
                  <Button size="small" onClick={() => setShowRejectInput(false)}>
                    Cancelar
                  </Button>
                  <Button size="small" variant="contained" color="error" onClick={handleDisable} disabled={loading}>
                    Confirmar Desactivación
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button startIcon={<DeleteIcon />} color="error" onClick={handleDelete} disabled={loading}>
          Eliminar
        </Button>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={onClose} color="inherit">
            Cerrar
          </Button>

          {!showRejectInput && status !== USED_STATUS.DISABLED && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<BlockIcon />}
              onClick={() => setShowRejectInput(true)}
              disabled={loading}
            >
              Desactivar / Rechazar
            </Button>
          )}

          {status !== USED_STATUS.VERIFIED && (
            <Button
              variant="contained"
              color="success"
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
              onClick={handleVerify}
              disabled={loading}
            >
              Marcar como Verificado
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  )
}
