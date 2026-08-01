'use client'

import React from 'react'
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Divider,
  Tooltip
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import DeleteIcon from '@mui/icons-material/Delete'
import BlockIcon from '@mui/icons-material/Block'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import VisibilityIcon from '@mui/icons-material/Visibility'

import { USED_STATUS, formatCopCurrency, USED_CONDITIONS } from '@/utilities/usedProductsConfig'

export default function UsedListingCard({ listing, onMarkSold, onRenew, onDelete }) {
  const {
    listingId,
    title,
    priceCop,
    images,
    status,
    condition,
    rejectionReason,
    createdAt,
    expiresAt
  } = listing

  // Calculate days until expiration
  const expMillis = expiresAt?.toMillis ? expiresAt.toMillis() : (expiresAt || 0)
  const now = Date.now()
  const daysLeft = expMillis > now ? Math.ceil((expMillis - now) / (1000 * 60 * 60 * 24)) : 0
  const isExpired = expMillis <= now && status !== USED_STATUS.SOLD

  const conditionObj = USED_CONDITIONS.find((c) => c.key === condition)

  // Status Badge Rendering
  const renderStatusChip = () => {
    if (isExpired) {
      return <Chip icon={<HourglassEmptyIcon />} label="Expirada (Requiere renovación)" color="warning" size="small" />
    }
    switch (status) {
      case USED_STATUS.VERIFIED:
        return <Chip icon={<CheckCircleIcon />} label="Verificada" color="success" size="small" />
      case USED_STATUS.PENDING:
        return <Chip icon={<HourglassEmptyIcon />} label="Publicada (Pendiente verificación)" color="info" size="small" />
      case USED_STATUS.DISABLED:
        return <Chip icon={<BlockIcon />} label="Desactivada por admin" color="error" size="small" />
      case USED_STATUS.SOLD:
        return <Chip label="VENDIDA" color="default" size="small" sx={{ fontWeight: 700 }} />
      default:
        return <Chip label={status} size="small" />
    }
  }

  return (
    <Card elevation={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2 }}>
      {/* Product Image */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={images?.[0] || '/static/images/drone-placeholder.jpg'}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          {renderStatusChip()}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2, mb: 1 }} noWrap>
          {title}
        </Typography>

        <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
          {formatCopCurrency(priceCop)}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Estado: <strong>{conditionObj?.label || condition}</strong>
        </Typography>

        {!isExpired && status !== USED_STATUS.SOLD && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Vigencia: Quedan <strong>{daysLeft} días</strong>
          </Typography>
        )}

        {status === USED_STATUS.DISABLED && rejectionReason && (
          <Box sx={{ mt: 1, p: 1, backgroundColor: 'rgba(211, 47, 47, 0.08)', borderRadius: 1 }}>
            <Typography variant="caption" color="error">
              <strong>Motivo de desactivación:</strong> {rejectionReason}
            </Typography>
          </Box>
        )}
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Mark as Sold Button */}
          {status !== USED_STATUS.SOLD && (
            <Tooltip title="Marcar como producto vendido">
              <Button
                size="small"
                variant="outlined"
                color="success"
                startIcon={<CheckCircleOutlineIcon />}
                onClick={() => onMarkSold(listingId)}
              >
                Vendido
              </Button>
            </Tooltip>
          )}

          {/* Renew Button (if expired or expiring soon) */}
          {(isExpired || daysLeft <= 10) && status !== USED_STATUS.SOLD && (
            <Tooltip title="Renovar por 60 días más">
              <Button
                size="small"
                variant="contained"
                color="secondary"
                startIcon={<AutorenewIcon />}
                onClick={() => onRenew(listingId)}
              >
                Renovar 60d
              </Button>
            </Tooltip>
          )}
        </Box>

        {/* Delete Button */}
        <IconButton size="small" color="error" onClick={() => onDelete(listingId, images)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
