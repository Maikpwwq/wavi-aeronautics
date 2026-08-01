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
  Stack
} from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import Link from 'next/link'

import { formatCopCurrency, USED_CONDITIONS, USED_STATUS } from '@/utilities/usedProductsConfig'

export default function UsedProductCard({ product }) {
  const {
    listingId,
    title,
    brand,
    condition,
    priceCop,
    images,
    sellerName,
    sellerPhone,
    status,
    createdAt
  } = product

  const conditionObj = USED_CONDITIONS.find((c) => c.key === condition)

  // WhatsApp Deep-Link Generator
  const getWhatsAppLink = () => {
    const cleanPhone = (sellerPhone || '').replace(/\D/g, '')
    const phoneWithCountry = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`
    const message = encodeURIComponent(
      `Hola ${sellerName}, estoy interesado en tu producto de segunda mano "${title}" publicado en Wavi Aeronautics por ${formatCopCurrency(priceCop)}.`
    )
    return `https://api.whatsapp.com/send?phone=${phoneWithCountry}&text=${message}`
  }

  return (
    <Card
      elevation={2}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 3,
        border: '1px solid #ff9800', // Orange border to distinguish second-hand items
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(255, 152, 0, 0.25)',
          transform: 'translateY(-4px)'
        }
      }}
    >
      {/* Media with Badges */}
      <Box sx={{ position: 'relative' }}>
        <Link href={`/tienda/producto-usado/${listingId}`} style={{ textDecoration: 'none' }}>
          <CardMedia
            component="img"
            height="200"
            image={images?.[0] || '/static/images/drone-placeholder.jpg'}
            alt={title}
            sx={{ objectFit: 'cover', cursor: 'pointer' }}
          />
        </Link>

        {/* Second Hand Badge */}
        <Chip
          label="SEGUNDA MANO"
          color="warning"
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            fontWeight: 800,
            fontSize: '0.7rem',
            letterSpacing: 0.5,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        />

        {/* Verified Seller Badge if verified by admin */}
        {status === USED_STATUS.VERIFIED && (
          <Chip
            icon={<VerifiedUserIcon />}
            label="Verificado"
            color="success"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              fontWeight: 700,
              fontSize: '0.7rem'
            }}
          />
        )}
      </Box>

      {/* Details */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
          {brand || 'Genérica'}
        </Typography>

        <Link href={`/tienda/producto-usado/${listingId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              lineHeight: 1.25,
              mt: 0.5,
              mb: 1,
              '&:hover': { color: 'primary.main' }
            }}
            noWrap
          >
            {title}
          </Typography>
        </Link>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Chip
            label={conditionObj?.label || condition}
            variant="outlined"
            size="small"
            sx={{ fontSize: '0.75rem', fontWeight: 600, borderColor: '#ff9800', color: '#e65100' }}
          />
        </Stack>

        <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
          {formatCopCurrency(priceCop)}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Vendedor: <strong>{sellerName}</strong>
        </Typography>
      </CardContent>

      <Divider />

      {/* Action CTA */}
      <CardActions sx={{ p: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          size="medium"
          startIcon={<WhatsAppIcon />}
          component="a"
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: '#25D366',
            color: '#fff',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#1ebd59'
            }
          }}
        >
          Contactar vendedor
        </Button>
      </CardActions>
    </Card>
  )
}
