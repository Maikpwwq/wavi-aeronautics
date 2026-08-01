'use client'

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import withRoot from '@/modules/withRoot'
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Paper,
  Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SellIcon from '@mui/icons-material/Sell'

import UsedListingCard from './components/UsedListingCard'
import {
  fetchUserListings,
  markListingAsSold,
  renewListingDuration,
  deleteUsedListing
} from '@/services/usedProductsService'

function MisPublicacionesPage() {
  const router = useRouter()
  const user = useSelector((state) => state.user)

  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  // Redirect if unauthenticated
  useEffect(() => {
    if (user === null) {
      router.push('/auth/sign-in?redirect=/tienda/mis-publicaciones')
    }
  }, [user, router])

  const loadListings = async () => {
    if (!user?.uid) return
    setLoading(true)
    try {
      const data = await fetchUserListings(user.uid)
      setListings(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.uid) {
      loadListings()
    }
  }, [user])

  const handleMarkSold = async (listingId) => {
    if (window.confirm('¿Deseas marcar esta publicación como VENDIDA?')) {
      try {
        await markListingAsSold(listingId)
        setMsg('Publicación marcada como vendida.')
        loadListings()
      } catch (e) {
        alert('Error al actualizar publicación.')
      }
    }
  }

  const handleRenew = async (listingId) => {
    try {
      await renewListingDuration(listingId)
      setMsg('Publicación renovada por 60 días más.')
      loadListings()
    } catch (e) {
      alert('Error al renovar la publicación.')
    }
  }

  const handleDelete = async (listingId, images) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar permanentemente esta publicación?')) {
      try {
        await deleteUsedListing(listingId, images)
        setMsg('Publicación eliminada.')
        setListings((prev) => prev.filter((item) => item.listingId !== listingId))
      } catch (e) {
        alert('Error al eliminar la publicación.')
      }
    }
  }

  if (user === undefined || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: '#eaeff1', minHeight: '90vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
              <SellIcon fontSize="large" /> Mis Publicaciones de Usados
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Administra tus equipos publicados de segunda mano.
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => router.push('/tienda/vender')}
            sx={{ fontWeight: 700, px: 3, py: 1 }}
          >
            Vender otro equipo
          </Button>
        </Box>

        {msg && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMsg('')}>
            {msg}
          </Alert>
        )}

        {listings.length > 0 ? (
          <Grid container spacing={3}>
            {listings.map((item) => (
              <Grid item key={item.listingId} xs={12} sm={6} md={4}>
                <UsedListingCard
                  listing={item}
                  onMarkSold={handleMarkSold}
                  onRenew={handleRenew}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aún no tienes publicaciones de equipos usados.
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              ¿Tienes drones, gafas FPV o accesorios que ya no utilices? ¡Publicalos gratis en la tienda!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => router.push('/tienda/vender')}
            >
              Publicar mi primer equipo
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  )
}

export default withRoot(MisPublicacionesPage)
