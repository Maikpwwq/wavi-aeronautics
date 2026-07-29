'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Modal,
  Backdrop,
  Fade,
  Button,
  Tabs,
  Tab,
  Rating,
  Alert,
  CircularProgress
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import RateReviewIcon from '@mui/icons-material/RateReview'
import { fetchAllReviews, approveReview, deleteReview } from '@/services/productInteractionService'
import { motion } from 'framer-motion'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0) // 0: Todas, 1: Pendientes, 2: Aprobadas
  const [selectedReview, setSelectedReview] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const loadReviews = async () => {
    setLoading(true)
    try {
      const data = await fetchAllReviews()
      setReviews(data)
    } catch (err) {
      console.error('Error loading reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const handleApprove = async (id) => {
    setActionLoading(true)
    try {
      await approveReview(id)
      await loadReviews()
      if (selectedReview?.id === id) {
        setSelectedReview((prev) => ({ ...prev, approved: true }))
      }
    } catch (err) {
      console.error('Error approving review:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta opinión?')) return
    setActionLoading(true)
    try {
      await deleteReview(id)
      setIsModalOpen(false)
      await loadReviews()
    } catch (err) {
      console.error('Error deleting review:', err)
    } finally {
      setActionLoading(false)
    }
  }

  // Filter reviews by active tab
  const filteredReviews = reviews.filter((rev) => {
    if (tabValue === 1) return !rev.approved
    if (tabValue === 2) return rev.approved
    return true
  })

  const columns = [
    {
      field: 'productName',
      headerName: 'Producto',
      flex: 1.2,
      minWidth: 160,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a2744' }}>
          {params.value || 'Producto'}
        </Typography>
      )
    },
    {
      field: 'userName',
      headerName: 'Usuario',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'rating',
      headerName: 'Calificación',
      width: 140,
      renderCell: (params) => <Rating value={params.value || 5} readOnly size="small" />
    },
    {
      field: 'title',
      headerName: 'Título',
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => (
        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'createdAtFormatted',
      headerName: 'Fecha',
      width: 150,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'approved',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) =>
        params.value ? (
          <Chip label="Aprobada" color="success" size="small" variant="outlined" />
        ) : (
          <Chip label="Pendiente" color="warning" size="small" variant="outlined" />
        )
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {!params.row.approved && (
            <Tooltip title="Aprobar Opinión">
              <IconButton
                color="success"
                size="small"
                onClick={() => handleApprove(params.row.id)}
                disabled={actionLoading}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Ver Detalle">
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                setSelectedReview(params.row)
                setIsModalOpen(true)
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar">
            <IconButton
              color="error"
              size="small"
              onClick={() => handleDelete(params.row.id)}
              disabled={actionLoading}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <RateReviewIcon sx={{ fontSize: 32, color: '#e91e63' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a2744' }}>
            Gestión de Opiniones
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          indicatorColor="secondary"
          textColor="inherit"
          sx={{
            '& .Mui-selected': { color: '#e91e63', fontWeight: 'bold' }
          }}
        >
          <Tab label={`Todas (${reviews.length})`} />
          <Tab label={`Pendientes (${reviews.filter((r) => !r.approved).length})`} />
          <Tab label={`Aprobadas (${reviews.filter((r) => r.approved).length})`} />
        </Tabs>
      </Paper>

      {/* Data Table */}
      <Paper sx={{ width: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <DataGrid
          rows={filteredReviews}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } }
          }}
          autoHeight
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              color: '#475569',
              fontWeight: 'bold'
            }
          }}
        />
      </Paper>

      {/* Review Detail Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        closeAfterTransition
        Slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={isModalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 550 },
              bgcolor: 'background.paper',
              borderRadius: 4,
              boxShadow: 24,
              p: 4
            }}
          >
            {selectedReview && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a2744' }}>
                    Detalle de la Opinión
                  </Typography>
                  {selectedReview.approved ? (
                    <Chip label="Aprobada" color="success" size="small" />
                  ) : (
                    <Chip label="Pendiente de Aprobación" color="warning" size="small" />
                  )}
                </Box>

                <Box sx={{ mb: 2.5, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Producto:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {selectedReview.productName || 'Producto sin nombre'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Rating value={selectedReview.rating || 5} readOnly />
                  <Typography variant="caption" color="text.secondary">
                    Por {selectedReview.userName} ({selectedReview.userEmail || 'Sin email'})
                  </Typography>
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {selectedReview.title}
                </Typography>

                <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', border: '1px solid #e2e8f0', borderRadius: 2, mb: 3 }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {selectedReview.comment}
                  </Typography>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                  {!selectedReview.approved && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleApprove(selectedReview.id)}
                      disabled={actionLoading}
                    >
                      Aprobar
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(selectedReview.id)}
                    disabled={actionLoading}
                  >
                    Eliminar
                  </Button>
                  <Button variant="text" onClick={() => setIsModalOpen(false)}>
                    Cerrar
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}
