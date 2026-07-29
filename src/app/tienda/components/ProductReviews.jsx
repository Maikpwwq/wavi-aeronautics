'use client'

import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Rating from '@mui/material/Rating'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import RateReviewIcon from '@mui/icons-material/RateReview'
import StarIcon from '@mui/icons-material/Star'
import PersonIcon from '@mui/icons-material/Person'
import { addProductReview } from '@/services/productInteractionService'

const ProductReviews = ({ reviews = [], productId, currentUser, onAuthRequired, onReviewAdded }) => {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleOpen = () => {
    if (!currentUser) {
      onAuthRequired()
      return
    }
    setError('')
    setOpen(true)
  }

  const handleClose = () => {
    if (!submitting) {
      setOpen(false)
      setTitle('')
      setComment('')
      setRating(5)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !comment.trim()) {
      setError('Por favor completa el título y el comentario.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await addProductReview({
        productId,
        userId: currentUser.uid || currentUser.id,
        userName: currentUser.displayName || currentUser.name || currentUser.email?.split('@')[0] || 'Usuario Wavi',
        userEmail: currentUser.email || '',
        rating,
        title,
        comment
      })

      handleClose()
      if (onReviewAdded) onReviewAdded()
    } catch (err) {
      setError('Ocurrió un error al guardar la opinión. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            color: 'text.primary',
            mb: 1.5
          }}
        >
          Opiniones de clientes de este producto ({reviews.length})
        </Typography>

        <Button
          variant="outlined"
          startIcon={<RateReviewIcon />}
          onClick={handleOpen}
          sx={{
            color: '#ff6f00',
            borderColor: '#ff6f00',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            px: 2.5,
            py: 1,
            '&:hover': {
              borderColor: '#e65100',
              bgcolor: 'rgba(255, 111, 0, 0.08)'
            }
          }}
        >
          Escribe tu opinión
        </Button>
      </Box>

      {/* Reviews List */}
      <Box sx={{ flexGrow: 1, mt: 2 }}>
        {reviews.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.02)',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 3
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Aún no hay opiniones sobre este producto. ¡Sé el primero en compartir tu experiencia!
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reviews.map((rev) => (
              <Paper
                key={rev.id}
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  transition: 'box-shadow 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Rating value={rev.rating || 5} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {rev.createdAt}
                  </Typography>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
                  {rev.title}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 1.5 }}>
                  {rev.comment}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.disabled' }}>
                  <PersonIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {rev.userName}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      {/* Write Review Dialog Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Escribe tu opinión</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ mb: 3 }}>
              <Typography component="legend" variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Calificación general
              </Typography>
              <Rating
                name="product-rating"
                value={rating}
                onChange={(event, newValue) => setRating(newValue || 5)}
                size="large"
                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
            </Box>

            <TextField
              fullWidth
              label="Título de tu opinión"
              placeholder="Ej: Excelente calidad de transmisión FPV"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Tu opinión o experiencia"
              placeholder="Cuéntanos más sobre el rendimiento, acabado y uso del producto..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleClose} disabled={submitting} sx={{ color: 'text.secondary' }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ bgcolor: '#ff6f00', '&:hover': { bgcolor: '#e65100' } }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Publicar Opinión'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}

export default ProductReviews
