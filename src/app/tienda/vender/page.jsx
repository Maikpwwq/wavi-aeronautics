'use client'

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import withRoot from '@/modules/withRoot'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import UsedProductForm from './components/UsedProductForm'

function VenderPage() {
  const router = useRouter()
  const user = useSelector((state) => state.user)

  // Redirect unauthenticated users
  useEffect(() => {
    if (user === null) {
      router.push('/auth/sign-in?redirect=/tienda/vender')
    }
  }, [user, router])

  if (user === undefined) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  return (
    <Box sx={{ backgroundColor: '#eaeff1', minHeight: '90vh', py: 4 }}>
      <Container maxWidth="lg">
        <UsedProductForm />
      </Container>
    </Box>
  )
}

export default withRoot(VenderPage)
