'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { auth } from '@/firebase/firebaseClient'
import { onAuthStateChanged } from 'firebase/auth'
import { fetchProductReviews, fetchProductQuestions, checkUserPurchasedProduct } from '@/services/productInteractionService'
import ProductReviews from './ProductReviews'
import ProductQuestions from './ProductQuestions'

const ProductFeedbackSection = ({ productId, productName }) => {
  const reduxUser = useSelector((state) => state.user)
  const [currentUser, setCurrentUser] = useState(null)
  const [isVerifiedPurchaser, setIsVerifiedPurchaser] = useState(false)
  const [reviews, setReviews] = useState([])
  const [questions, setQuestions] = useState([])
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [unverifiedDialogOpen, setUnverifiedDialogOpen] = useState(false)

  // Sync auth state and check purchaser status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const activeUser = user || (reduxUser && (reduxUser.uid || reduxUser.id) ? reduxUser : null)
      setCurrentUser(activeUser)

      if (activeUser && productId) {
        const uid = activeUser.uid || activeUser.id
        const isAdminUser = activeUser.role === 'admin' || activeUser.rol === 'admin'
        if (isAdminUser) {
          setIsVerifiedPurchaser(true)
        } else {
          const purchased = await checkUserPurchasedProduct(uid, productId)
          setIsVerifiedPurchaser(purchased)
        }
      } else {
        setIsVerifiedPurchaser(false)
      }
    })

    return () => unsubscribe()
  }, [reduxUser, productId])

  // Load reviews and questions
  const loadData = useCallback(async () => {
    if (!productId) return
    const [revData, qData] = await Promise.all([
      fetchProductReviews(productId),
      fetchProductQuestions(productId)
    ])
    setReviews(revData)
    setQuestions(qData)
  }, [productId])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <Box sx={{ mt: 8, mb: 6 }}>
      <Divider sx={{ mb: 6 }} />

      <Grid container spacing={{ xs: 5, md: 6 }}>
        {/* Left Column: Opiniones de clientes */}
        <Grid item xs={12} md={6}>
          <ProductReviews
            reviews={reviews}
            productId={productId}
            productName={productName}
            currentUser={currentUser}
            isVerifiedPurchaser={isVerifiedPurchaser}
            onAuthRequired={() => setAuthDialogOpen(true)}
            onUnverifiedRequired={() => setUnverifiedDialogOpen(true)}
            onReviewAdded={loadData}
          />
        </Grid>

        {/* Right Column: Preguntas técnicas */}
        <Grid item xs={12} md={6}>
          <ProductQuestions
            questions={questions}
            productId={productId}
            productName={productName}
            currentUser={currentUser}
            isVerifiedPurchaser={isVerifiedPurchaser}
            onAuthRequired={() => setAuthDialogOpen(true)}
            onUnverifiedRequired={() => setUnverifiedDialogOpen(true)}
            onQuestionAdded={loadData}
          />
        </Grid>
      </Grid>

      {/* Auth Prompt Dialog */}
      <Dialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <LockOutlinedIcon sx={{ fontSize: 40, color: '#00aCe4', mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Inicio de Sesión Requerido
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Para escribir una opinión o realizar una pregunta técnica sobre este producto, debes ingresar a tu cuenta de Wavi Aeronautics.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
          <Button onClick={() => setAuthDialogOpen(false)} sx={{ color: 'text.secondary' }}>
            Cancelar
          </Button>
          <Button
            component={Link}
            href="/ingresar"
            variant="contained"
            sx={{ bgcolor: '#00aCe4', '&:hover': { bgcolor: '#0086b3' } }}
          >
            Iniciar Sesión
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unverified Purchaser Dialog */}
      <Dialog open={unverifiedDialogOpen} onClose={() => setUnverifiedDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff6f00' }}>
            Compra Verificada Requerida
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Para evitar comentarios spam y proteger la comunidad, únicamente los clientes que hayan adquirido este producto en Wavi Aeronautics pueden dejar opiniones y realizar preguntas técnicas.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setUnverifiedDialogOpen(false)} variant="contained" sx={{ bgcolor: '#ff6f00' }}>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductFeedbackSection
