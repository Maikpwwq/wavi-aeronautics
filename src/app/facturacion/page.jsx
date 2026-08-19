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
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'

import CreditCardIcon from '@mui/icons-material/CreditCard'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AddCardIcon from '@mui/icons-material/AddCard'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockIcon from '@mui/icons-material/Lock'
import SaveIcon from '@mui/icons-material/Save'
import BusinessIcon from '@mui/icons-material/Business'

import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'
import withRoot from '@/modules/withRoot'
import {
  getUserBillingProfile,
  saveUserBillingProfile,
  getUserPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod
} from '@/services/billingService'

const DOC_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
  { value: 'NIT', label: 'NIT / RUT Empresa' },
  { value: 'CE', label: 'Cédula de Extranjería (CE)' },
  { value: 'PP', label: 'Pasaporte' }
]

const CARD_BRANDS = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'American Express' },
  { value: 'pse', label: 'Cuenta Bancaria / PSE' }
]

function FacturacionPage() {
  const user = useSelector((state) => state.user)

  // Billing Profile Form
  const [docType, setDocType] = useState('CC')
  const [docNumber, setDocNumber] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [department, setDepartment] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  // New Payment Method Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCardBrand, setNewCardBrand] = useState('visa')
  const [newCardNumber, setNewCardNumber] = useState('')
  const [newCardHolder, setNewCardHolder] = useState('')
  const [newExpiryMonth, setNewExpiryMonth] = useState('12')
  const [newExpiryYear, setNewExpiryYear] = useState('2028')
  const [addingCard, setAddingCard] = useState(false)

  const loadBillingData = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const [profile, methods] = await Promise.all([
        getUserBillingProfile(user.uid),
        getUserPaymentMethods(user.uid)
      ])

      if (profile) {
        setDocType(profile.docType || 'CC')
        setDocNumber(profile.docNumber || '')
        setBusinessName(profile.businessName || user.displayName || '')
        setAddress(profile.address || '')
        setCity(profile.city || '')
        setDepartment(profile.department || '')
        setPostalCode(profile.postalCode || '')
        setPhone(profile.phone || '')
        setEmail(profile.email || user.email || '')
      } else {
        setBusinessName(user.displayName || '')
        setEmail(user.email || '')
      }

      setPaymentMethods(methods)
    } catch (err) {
      console.error('Error loading billing data:', err)
      setSnackbar({ open: true, message: 'Error al cargar los datos de facturación', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadBillingData()
  }, [loadBillingData])

  // Save Billing Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!user?.uid) return

    setSavingProfile(true)
    try {
      await saveUserBillingProfile(user.uid, {
        docType,
        docNumber,
        businessName,
        address,
        city,
        department,
        postalCode,
        phone,
        email
      })
      setSnackbar({ open: true, message: 'Datos de facturación guardados exitosamente', severity: 'success' })
    } catch (err) {
      console.error('Error saving billing profile:', err)
      setSnackbar({ open: true, message: 'Error al guardar los datos de facturación', severity: 'error' })
    } finally {
      setSavingProfile(false)
    }
  }

  // Add Payment Method (PCI Compliant)
  const handleAddPaymentMethod = async (e) => {
    e.preventDefault()
    if (!user?.uid) return

    const cleanNum = newCardNumber.replace(/\D/g, '')
    if (cleanNum.length < 4) {
      setSnackbar({ open: true, message: 'Ingresa un número de tarjeta válido', severity: 'warning' })
      return
    }

    setAddingCard(true)
    try {
      await addPaymentMethod(user.uid, {
        brand: newCardBrand,
        lastFour: cleanNum.slice(-4),
        cardholderName: newCardHolder || user.displayName || 'Titular',
        expiryMonth: newExpiryMonth,
        expiryYear: newExpiryYear
      })

      setSnackbar({ open: true, message: 'Método de pago registrado con éxito', severity: 'success' })
      setIsAddModalOpen(false)
      setNewCardNumber('')
      setNewCardHolder('')
      loadBillingData()
    } catch (err) {
      console.error('Error adding card:', err)
      setSnackbar({ open: true, message: 'Error al registrar el método de pago', severity: 'error' })
    } finally {
      setAddingCard(false)
    }
  }

  // Set Default Method
  const handleSetDefault = async (methodId) => {
    if (!user?.uid || !methodId) return
    try {
      await setDefaultPaymentMethod(user.uid, methodId)
      setSnackbar({ open: true, message: 'Método predeterminado actualizado', severity: 'info' })
      loadBillingData()
    } catch (err) {
      console.error('Error setting default:', err)
      setSnackbar({ open: true, message: 'Error al actualizar método predeterminado', severity: 'error' })
    }
  }

  // Delete Method
  const handleDeleteMethod = async (methodId) => {
    if (!user?.uid || !methodId) return
    try {
      await deletePaymentMethod(user.uid, methodId)
      setSnackbar({ open: true, message: 'Método de pago eliminado', severity: 'info' })
      loadBillingData()
    } catch (err) {
      console.error('Error deleting method:', err)
      setSnackbar({ open: true, message: 'Error al eliminar el método de pago', severity: 'error' })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <AppAppBar />

      <Container maxWidth="lg" sx={{ mt: 5, mb: 8, flex: 1 }}>
        {/* Header Title */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              bgcolor: 'rgba(0, 172, 228, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00aCe4'
            }}
          >
            <CreditCardIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#1e293b' }}>
              Facturación & Métodos de Pago
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Administra tus datos fiscales de facturación electrónica y tarjetas registradas
            </Typography>
          </Box>
        </Box>

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
            <CreditCardIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Inicia sesión para gestionar tu facturación
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 460, mx: 'auto', mb: 3 }}>
              Guarda tus datos para compras más rápidas y generación automática de facturas.
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
          <Grid container spacing={4}>
            {/* Column 1: Fiscal / Billing Details Form */}
            <Grid item xs={12} md={7}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3.5,
                  border: '1px solid #e2e8f0',
                  bgcolor: '#ffffff'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <BusinessIcon sx={{ color: '#00aCe4' }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    Información Fiscal & Facturación
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSaveProfile}>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={5}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Tipo de Documento</InputLabel>
                        <Select
                          value={docType}
                          label="Tipo de Documento"
                          onChange={(e) => setDocType(e.target.value)}
                        >
                          {DOC_TYPES.map((dt) => (
                            <MenuItem key={dt.value} value={dt.value}>
                              {dt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={7}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Número de Identificación / NIT *"
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value)}
                        placeholder="Ej: 1020304050 ó 900.123.456-7"
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Nombre Completo / Razón Social *"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Dirección Fiscal *"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ej: Calle 100 # 15-20, Apto 302"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Ciudad *"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Departamento *"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Código Postal"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={8}>
                      <TextField
                        size="small"
                        fullWidth
                        label="Teléfono de Contacto *"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        fullWidth
                        type="email"
                        label="Correo para Factura Electrónica *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        disabled={savingProfile}
                        sx={{
                          borderRadius: 2.5,
                          textTransform: 'none',
                          fontWeight: 700,
                          px: 3.5,
                          py: 1
                        }}
                      >
                        {savingProfile ? <CircularProgress size={20} color="inherit" /> : 'Guardar Información Fiscal'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Column 2: Saved Payment Methods */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3.5,
                  border: '1px solid #e2e8f0',
                  bgcolor: '#ffffff',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCardIcon sx={{ color: '#00aCe4' }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                      Métodos Guardados
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    startIcon={<AddCardIcon />}
                    onClick={() => setIsAddModalOpen(true)}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                      borderColor: '#00aCe4',
                      color: '#00aCe4'
                    }}
                  >
                    Agregar
                  </Button>
                </Box>

                {/* Cards List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                  {paymentMethods.length === 0 ? (
                    <Box
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        borderRadius: 3,
                        border: '1px dashed #cbd5e1',
                        my: 'auto'
                      }}
                    >
                      <CreditCardIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                        No tienes métodos de pago guardados
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
                        Registra una tarjeta para agilizar tu proceso de pago.
                      </Typography>
                    </Box>
                  ) : (
                    paymentMethods.map((method) => (
                      <Card
                        key={method.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: method.isDefault ? '2px solid #00aCe4' : '1px solid #e2e8f0',
                          bgcolor: method.isDefault ? 'rgba(0, 172, 228, 0.03)' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 44,
                              height: 32,
                              borderRadius: '6px',
                              bgcolor: '#1e293b',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 900,
                              fontSize: '0.7rem',
                              letterSpacing: 0.5,
                              textTransform: 'uppercase'
                            }}
                          >
                            {method.brand?.slice(0, 4)}
                          </Box>

                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                              •••• •••• •••• {method.lastFour}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              Vence {method.expiryMonth}/{method.expiryYear}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {method.isDefault ? (
                            <Chip
                              label="Predeterminado"
                              size="small"
                              color="primary"
                              sx={{ fontWeight: 700, fontSize: '0.65rem' }}
                            />
                          ) : (
                            <Button
                              size="small"
                              onClick={() => handleSetDefault(method.id)}
                              sx={{ textTransform: 'none', fontSize: '0.75rem' }}
                            >
                              Predeterminar
                            </Button>
                          )}

                          <Tooltip title="Eliminar método" arrow>
                            <IconButton size="small" color="error" onClick={() => handleDeleteMethod(method.id)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Card>
                    ))
                  )}
                </Box>

                {/* Security Guarantee Note */}
                <Box
                  sx={{
                    mt: 3,
                    p: 1.5,
                    borderRadius: 2.5,
                    bgcolor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25
                  }}
                >
                  <LockIcon sx={{ fontSize: 18, color: '#16a34a' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.3 }}>
                    Cumplimiento <strong>PCI-DSS</strong>: No almacenamos datos sensibles ni CVV. Todas las transacciones son procesadas mediante canales bancarios seguros encriptados.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Add Payment Method Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Agregar Método de Pago</DialogTitle>
        <Box component="form" onSubmit={handleAddPaymentMethod}>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Franquicia / Red</InputLabel>
              <Select
                value={newCardBrand}
                label="Franquicia / Red"
                onChange={(e) => setNewCardBrand(e.target.value)}
              >
                {CARD_BRANDS.map((cb) => (
                  <MenuItem key={cb.value} value={cb.value}>
                    {cb.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              fullWidth
              label="Número de Tarjeta"
              value={newCardNumber}
              onChange={(e) => setNewCardNumber(e.target.value)}
              placeholder="•••• •••• •••• 1234"
              inputProps={{ maxLength: 19 }}
              required
            />

            <TextField
              size="small"
              fullWidth
              label="Nombre del Titular"
              value={newCardHolder}
              onChange={(e) => setNewCardHolder(e.target.value)}
              placeholder="Como figura en la tarjeta"
              required
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                size="small"
                fullWidth
                label="Mes (MM)"
                value={newExpiryMonth}
                onChange={(e) => setNewExpiryMonth(e.target.value)}
                placeholder="12"
                inputProps={{ maxLength: 2 }}
                required
              />
              <TextField
                size="small"
                fullWidth
                label="Año (AAAA)"
                value={newExpiryYear}
                onChange={(e) => setNewExpiryYear(e.target.value)}
                placeholder="2028"
                inputProps={{ maxLength: 4 }}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setIsAddModalOpen(false)} sx={{ textTransform: 'none', color: '#64748b' }}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={addingCard}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
            >
              {addingCard ? <CircularProgress size={20} color="inherit" /> : 'Guardar Método'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
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

export default withRoot(FacturacionPage)
