'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Tooltip
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BlockIcon from '@mui/icons-material/Block'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SellIcon from '@mui/icons-material/Sell'

import ModerateListingDialog from './components/ModerateListingDialog'
import {
  fetchAdminAllUsedListings,
  updateListingStatusByAdmin,
  deleteUsedListing
} from '@/services/usedProductsService'
import { USED_STATUS, formatCopCurrency } from '@/utilities/usedProductsConfig'

export default function AdminUsedProductsPage() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0) // 0: Todos, 1: Pendientes, 2: Verificados, 3: Desactivados
  const [selectedListing, setSelectedListing] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchAdminAllUsedListings()
      setListings(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredListings = listings.filter((item) => {
    if (tabValue === 1) return item.status === USED_STATUS.PENDING
    if (tabValue === 2) return item.status === USED_STATUS.VERIFIED
    if (tabValue === 3) return item.status === USED_STATUS.DISABLED
    return true
  })

  const handleOpenDialog = (listing) => {
    setSelectedListing(listing)
    setDialogOpen(true)
  }

  const handleUpdateStatus = async (listingId, newStatus, rejectionReason = '') => {
    try {
      await updateListingStatusByAdmin(listingId, newStatus, rejectionReason)
      setListings((prev) =>
        prev.map((item) =>
          item.listingId === listingId ? { ...item, status: newStatus, rejectionReason } : item
        )
      )
    } catch (e) {
      alert('Error al actualizar el estado de la publicación.')
    }
  }

  const handleDelete = async (listingId, images) => {
    try {
      await deleteUsedListing(listingId, images)
      setListings((prev) => prev.filter((item) => item.listingId !== listingId))
    } catch (e) {
      alert('Error al eliminar la publicación.')
    }
  }

  const renderStatusChip = (status) => {
    switch (status) {
      case USED_STATUS.VERIFIED:
        return <Chip label="Verificado" color="success" size="small" />
      case USED_STATUS.PENDING:
        return <Chip label="Pendiente Verificación" color="warning" size="small" />
      case USED_STATUS.DISABLED:
        return <Chip label="Desactivado" color="error" size="small" />
      case USED_STATUS.SOLD:
        return <Chip label="Vendido" color="default" size="small" />
      default:
        return <Chip label={status} size="small" />
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SellIcon fontSize="large" color="primary" /> Moderación de Equipos Usados
        </Typography>
        <Button variant="outlined" color="primary" onClick={loadData} disabled={loading}>
          Recargar Lista
        </Button>
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label={`Todos (${listings.length})`} />
          <Tab label={`Pendientes (${listings.filter((i) => i.status === USED_STATUS.PENDING).length})`} />
          <Tab label={`Verificados (${listings.filter((i) => i.status === USED_STATUS.VERIFIED).length})`} />
          <Tab label={`Desactivados (${listings.filter((i) => i.status === USED_STATUS.DISABLED).length})`} />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#fafafa' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Producto / Título</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Categoría / Marca</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Precio COP</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Vendedor</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredListings.length > 0 ? (
                  filteredListings.map((item) => (
                    <TableRow key={item.listingId} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {item.listingId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{item.category}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.brand}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                        {formatCopCurrency(item.priceCop)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{item.sellerName}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.sellerPhone}</Typography>
                      </TableCell>
                      <TableCell>{renderStatusChip(item.status)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Ver detalles y moderar">
                          <IconButton size="small" color="primary" onClick={() => handleOpenDialog(item)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No hay publicaciones en esta sección.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Moderation Dialog */}
      <ModerateListingDialog
        open={dialogOpen}
        listing={selectedListing}
        onClose={() => setDialogOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />
    </Box>
  )
}
