'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Rating from '@mui/material/Rating'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import RateReviewIcon from '@mui/icons-material/RateReview'
import EditIcon from '@mui/icons-material/Edit'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import StarIcon from '@mui/icons-material/Star'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import AddCommentIcon from '@mui/icons-material/AddComment'

import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'
import withRoot from '@/modules/withRoot'
import {
  fetchUserReviews,
  updateProductReview,
  deleteReview,
  addProductReview,
  fetchUnreviewedPurchasedProducts
} from '@/services/productInteractionService'

function MisOpinionesPage() {
  const user = useSelector((state) => state.user)

  const [tabValue, setTabValue] = useState(0)
  const [reviews, setReviews] = useState([])
  const [unreviewed, setUnreviewed] = useState([])
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  // Edit Review Modal State
  const [editingReview, setEditingReview] = useState(null)
  const [editRating, setEditRating] = useState(5)
  const [editTitle, setEditTitle] = useState('')
  const [editComment, setEditComment] = useState('')
  const [submittingEdit, setSubmittingEdit] = useState(false)

  // New Review Modal State
  const [creatingForProduct, setCreatingForProduct] = useState(null)
  const [newRating, setNewRating] = useState(5)
  const [newTitle, setNewTitle] = useState('')
  const [newComment, setNewComment] = useState('')
  const [submittingNew, setSubmittingNew] = useState(false)

  // Delete Confirm Dialog State
  const [deletingId, setDeletingId] = useState(null)

  const loadData = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [userReviews, pendingProducts] = await Promise.all([
        fetchUserReviews(user.uid),
        fetchUnreviewedPurchasedProducts(user.uid)
      ])
      setReviews(userReviews)
      setUnreviewed(pendingProducts)
    } catch (err) {
      console.error('Error loading reviews data:', err)
      setSnackbar({ open: true, message: 'Error al cargar tus opiniones', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Open Edit Modal
  const handleOpenEdit = (review) => {
    setEditingReview(review)
    setEditRating(review.rating || 5)
    setEditTitle(review.title || '')
    setEditComment(review.comment || '')
  }

  // Submit Edit
  const handleSaveEdit = async () => {
    if (!editingReview?.id) return
    if (!editComment.trim()) {
      setSnackbar({ open: true, message: 'Por favor escribe un comentario', severity: 'warning' })
      return
    }

    setSubmittingEdit(true)
    try {
      await updateProductReview(editingReview.id, {
        rating: editRating,
        title: editTitle,
        comment: editComment
      })
      setSnackbar({ open: true, message: 'Opinión actualizada correctamente (enviada a moderación)', severity: 'success' })
      setEditingReview(null)
      loadData()
    } catch (err) {
      console.error('Error updating review:', err)
      setSnackbar({ open: true, message: 'Error al actualizar la opinión', severity: 'error' })
    } finally {
      setSubmittingEdit(false)
    }
  }

  // Delete Review
  const handleConfirmDelete = async () => {
    if (!deletingId) return
    try {
      await deleteReview(deletingId)
      setSnackbar({ open: true, message: 'Opinión eliminada correctamente', severity: 'info' })
      setDeletingId(null)
      loadData()
    } catch (err) {
      console.error('Error deleting review:', err)
      setSnackbar({ open: true, message: 'Error al eliminar la opinión', severity: 'error' })
    }
  }

  // Submit New Review for Purchased Product
  const handleSaveNewReview = async () => {
    if (!creatingForProduct) return
    if (!newComment.trim()) {
      setSnackbar({ open: true, message: 'Por favor escribe tu opinión', severity: 'warning' })
      return
    }

    setSubmittingNew(true)
    try {
      await addProductReview({
        productId: creatingForProduct.productId,
        productName: creatingForProduct.name,
        userId: user.uid,
        userName: user.displayName || 'Usuario Wavi',
        userEmail: user.email || '',
        rating: newRating,
        title: newTitle,
        comment: newComment
      })
      setSnackbar({ open: true, message: '¡Gracias por tu opinión! Pasará a moderación en breve.', severity: 'success' })
      setCreatingForProduct(null)
      setNewRating(5)
      setNewTitle('')
      setNewComment('')
      loadData()
    } catch (err) {
      console.error('Error adding review:', err)
      setSnackbar({ open: true, message: 'Error al publicar la opinión', severity: 'error' })
    } finally {
      setSubmittingNew(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <AppAppBar />

      <Container maxWidth="lg" sx={{ mt: 5, mb: 8, flex: 1 }}>
        {/* Header Title */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: 'rgba(255, 183, 77, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b'
              }}
            >
              <RateReviewIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Mis Opiniones
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Administra tus reseñas y comparte tu experiencia con la comunidad
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Not Logged In State */}
        {!user?.uid && !loading ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              bgcolor: '#ffffff'
            }}
          >
            <RateReviewIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Inicia sesión para ver y redactar opiniones
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 460, mx: 'auto', mb: 3 }}>
              Califica los productos que has comprado y ayuda a otros pilotos a elegir el mejor equipo.
            </Typography>
            <Button
              component={Link}
              href="/auth/sign-in"
              variant="contained"
              color="primary"
              sx={{ px: 4, py: 1.25, borderRadius: 2.5, fontWeight: 700, textTransform: 'none' }}
            >
              Iniciar Sesión
            </Button>
          </Paper>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#00aCe4' }} />
          </Box>
        ) : (
          <>
            {/* Tabs for Published Reviews and Pending to Review */}
            <Box sx={{ borderBottom: 1, borderColor: '#e2e8f0', mb: 4 }}>
              <Tabs
                value={tabValue}
                onChange={(e, v) => setTabValue(v)}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab
                  label={`Mis Reseñas (${reviews.length})`}
                  icon={<StarIcon sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                />
                <Tab
                  label={`Por Calificar (${unreviewed.length})`}
                  icon={<AddCommentIcon sx={{ fontSize: 18 }} />}
                  iconPosition="start"
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                />
              </Tabs>
            </Box>

            {/* TAB 0: Published Reviews */}
            {tabValue === 0 && (
              <>
                {reviews.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 4, md: 8 },
                      textAlign: 'center',
                      borderRadius: 4,
                      border: '1px dashed #cbd5e1',
                      bgcolor: '#ffffff'
                    }}
                  >
                    <StarIcon sx={{ fontSize: 56, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                      Aún no has escrito ninguna opinión
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 440, mx: 'auto', mb: 3 }}>
                      Cuando compres un producto, podrás calificarlo y dejar tus comentarios aquí.
                    </Typography>
                    {unreviewed.length > 0 && (
                      <Button
                        onClick={() => setTabValue(1)}
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
                      >
                        Ver {unreviewed.length} productos pendientes por calificar
                      </Button>
                    )}
                  </Paper>
                ) : (
                  <Grid container spacing={3}>
                    {reviews.map((review) => (
                      <Grid item xs={12} md={6} key={review.id}>
                        <Card
                          elevation={0}
                          sx={{
                            borderRadius: 3.5,
                            border: '1px solid #e2e8f0',
                            bgcolor: '#ffffff',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            p: 2.5,
                            transition: 'all 0.25s ease',
                            '&:hover': {
                              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                              borderColor: '#cbd5e1'
                            }
                          }}
                        >
                          <Box>
                            {/* Top header: Product Name & Status */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5, gap: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                                {review.productName || 'Producto Wavi'}
                              </Typography>
                              {review.approved ? (
                                <Chip
                                  icon={<CheckCircleOutlineIcon sx={{ fontSize: '1rem !important' }} />}
                                  label="Aprobada"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                  sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                />
                              ) : (
                                <Chip
                                  icon={<HourglassEmptyIcon sx={{ fontSize: '1rem !important' }} />}
                                  label="En revisión"
                                  size="small"
                                  color="warning"
                                  variant="outlined"
                                  sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>

                            {/* Rating and Date */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                              <Rating value={review.rating || 5} readOnly precision={0.5} size="small" />
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {review.createdAtFormatted || 'Reciente'}
                              </Typography>
                            </Box>

                            {/* Title & Comment */}
                            {review.title && (
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                                {review.title}
                              </Typography>
                            )}
                            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                              &ldquo;{review.comment}&rdquo;
                            </Typography>
                          </Box>

                          {/* Actions */}
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3, pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => handleOpenEdit(review)}
                              sx={{ textTransform: 'none', fontWeight: 600, color: '#00aCe4' }}
                            >
                              Editar
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteOutlineIcon />}
                              onClick={() => setDeletingId(review.id)}
                              sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                              Eliminar
                            </Button>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}

            {/* TAB 1: Unreviewed Purchased Products */}
            {tabValue === 1 && (
              <>
                {unreviewed.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 4, md: 8 },
                      textAlign: 'center',
                      borderRadius: 4,
                      border: '1px dashed #cbd5e1',
                      bgcolor: '#ffffff'
                    }}
                  >
                    <ShoppingBagIcon sx={{ fontSize: 56, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                      ¡Estás al día con tus calificaciones!
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 440, mx: 'auto', mb: 3 }}>
                      No tienes compras pendientes por calificar. Cuando recibas nuevos pedidos, aparecerán aquí.
                    </Typography>
                    <Button
                      component={Link}
                      href="/tienda/kit-drones"
                      variant="contained"
                      color="primary"
                      sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
                    >
                      Explorar Tienda
                    </Button>
                  </Paper>
                ) : (
                  <Grid container spacing={3}>
                    {unreviewed.map((prod) => (
                      <Grid item xs={12} sm={6} md={4} key={prod.productId}>
                        <Card
                          elevation={0}
                          sx={{
                            borderRadius: 3.5,
                            border: '1px solid #e2e8f0',
                            bgcolor: '#ffffff',
                            p: 2.5,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Box>
                            <Typography variant="caption" sx={{ color: '#00aCe4', fontWeight: 700, textTransform: 'uppercase' }}>
                              {prod.brand || 'Wavi Aeronautics'}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5, mb: 1 }}>
                              {prod.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
                              Comprado en Orden #{prod.orderId?.slice(0, 8)}
                            </Typography>
                          </Box>

                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<RateReviewIcon />}
                            onClick={() => setCreatingForProduct(prod)}
                            sx={{
                              borderRadius: 2.5,
                              textTransform: 'none',
                              fontWeight: 700,
                              py: 1,
                              boxShadow: '0 4px 12px rgba(255, 111, 0, 0.25)'
                            }}
                          >
                            Calificar Producto
                          </Button>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </>
        )}
      </Container>

      {/* Edit Review Modal */}
      <Dialog
        open={Boolean(editingReview)}
        onClose={() => setEditingReview(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Editar Opinión</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
              Calificación
            </Typography>
            <Rating
              value={editRating}
              onChange={(e, val) => setEditRating(val || 5)}
              size="large"
            />
          </Box>

          <TextField
            label="Título de tu reseña (opcional)"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Ej: Excelente respuesta y estabilidad de vuelo"
          />

          <TextField
            label="Tu Comentario *"
            fullWidth
            multiline
            rows={4}
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            placeholder="Comparte tu experiencia con este equipo..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setEditingReview(null)} sx={{ textTransform: 'none', color: '#64748b' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveEdit}
            disabled={submittingEdit}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            {submittingEdit ? <CircularProgress size={20} color="inherit" /> : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* New Review Modal */}
      <Dialog
        open={Boolean(creatingForProduct)}
        onClose={() => setCreatingForProduct(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Calificar {creatingForProduct?.name}
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5 }}>
              ¿Qué puntuación le das?
            </Typography>
            <Rating
              value={newRating}
              onChange={(e, val) => setNewRating(val || 5)}
              size="large"
            />
          </Box>

          <TextField
            label="Título de tu reseña (opcional)"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Ej: Cumplió todas mis expectativas"
          />

          <TextField
            label="Tu Comentario *"
            fullWidth
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Cuéntanos sobre el rendimiento, calidad de construcción o detalles que te gustaron..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setCreatingForProduct(null)} sx={{ textTransform: 'none', color: '#64748b' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveNewReview}
            disabled={submittingNew}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            {submittingNew ? <CircularProgress size={20} color="inherit" /> : 'Publicar Opinión'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        PaperProps={{ sx: { borderRadius: 3.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>¿Eliminar esta opinión?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Esta acción eliminará tu calificación y comentario permanentemente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeletingId(null)} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <AppFooter />
    </Box>
  )
}

export default withRoot(MisOpinionesPage)
