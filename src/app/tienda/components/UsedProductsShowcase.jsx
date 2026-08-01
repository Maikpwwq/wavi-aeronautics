'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Chip,
  Button,
  Paper
} from '@mui/material'
import SellIcon from '@mui/icons-material/Sell'
import AddIcon from '@mui/icons-material/Add'
import { useRouter } from 'next/navigation'

import UsedProductCard from './UsedProductCard'
import { fetchListingsByCategory } from '@/services/usedProductsService'

export default function UsedProductsShowcase({ categoryKey, categoryTitle }) {
  const router = useRouter()
  const [usedProducts, setUsedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    if (categoryKey) {
      setLoading(true)
      fetchListingsByCategory(categoryKey)
        .then((data) => {
          if (isMounted) setUsedProducts(data)
        })
        .catch((err) => console.error('[UsedProductsShowcase] Error loading:', err))
        .finally(() => {
          if (isMounted) setLoading(false)
        })
    }
    return () => {
      isMounted = false
    }
  }, [categoryKey])

  if (loading) {
    return (
      <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={30} color="secondary" />
      </Box>
    )
  }

  if (usedProducts.length === 0) {
    return null // Don't render showcase if no used products exist in this category
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 6,
        mb: 4,
        p: { xs: 2, md: 3 },
        backgroundColor: '#fff8f0', // Subtle warm background for second-hand section
        borderRadius: 3,
        border: '1px solid #ffe0b2'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SellIcon sx={{ color: '#ff6f00', fontSize: 32 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#e65100' }}>
              Equipos Usados / Segunda Mano ({categoryTitle || 'Categoría'})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Publicaciones directas de la comunidad. Contacta al vendedor vía WhatsApp.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          color="warning"
          startIcon={<AddIcon />}
          onClick={() => router.push('/tienda/vender')}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Publicar mi {categoryTitle || 'equipo'} usado
        </Button>
      </Box>

      <Grid container spacing={3}>
        {usedProducts.map((item) => (
          <Grid item key={item.listingId} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
            <UsedProductCard product={item} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}
