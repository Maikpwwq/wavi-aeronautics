'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
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
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Tooltip from '@mui/material/Tooltip'

import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PrintIcon from '@mui/icons-material/Print'
import ReplayIcon from '@mui/icons-material/Replay'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PaymentIcon from '@mui/icons-material/Payment'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'

import AppAppBar from '@/modules/views/AppAppBar'
import AppFooter from '@/modules/views/AppFooter'
import withRoot from '@/modules/withRoot'
import { fetchUserOrders } from '@/services/ordersService'
import { formatCurrency } from '@/utilities/priceUtils'

function MisComprasPage() {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const printRef = useRef()

  const loadPurchases = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const allOrders = await fetchUserOrders(user.uid)
      // Filter orders that are successful / completed / not failed
      const completedPurchases = allOrders.filter(
        (o) => !['cancelled', 'failed', 'rejected'].includes(o.status?.toLowerCase())
      )
      setOrders(completedPurchases)
    } catch (err) {
      console.error('Error fetching purchases:', err)
      setSnackbar({ open: true, message: 'Error al cargar tu historial de compras', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  useEffect(() => {
    loadPurchases()
  }, [loadPurchases])

  const handlePrintInvoice = () => {
    window.print()
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
                bgcolor: 'rgba(0, 172, 228, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00aCe4'
              }}
            >
              <ShoppingBagIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#1e293b' }}>
                Mis Compras
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Historial consolidado de compras completadas, recibos y facturación digital
              </Typography>
            </Box>
          </Box>

          {orders.length > 0 && (
            <Chip
              label={`${orders.length} ${orders.length === 1 ? 'compra registrada' : 'compras registradas'}`}
              sx={{
                fontWeight: 700,
                bgcolor: 'rgba(76, 175, 80, 0.1)',
                color: '#2e7d32',
                border: '1px solid rgba(76, 175, 80, 0.3)'
              }}
            />
          )}
        </Box>

        {/* Not Logged In */}
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
            <ShoppingBagIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Inicia sesión para ver tu historial de compras
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 460, mx: 'auto', mb: 3 }}>
              Accede a tus facturas digitales, resumen de pedidos y estados de pago.
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
        ) : orders.length === 0 ? (
          /* Empty Purchases State */
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
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'rgba(0, 172, 228, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                color: '#00aCe4'
              }}
            >
              <ShoppingBagIcon sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Aún no tienes compras completadas
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 440, mx: 'auto', mb: 3 }}>
              Explora nuestros kits de drones, emisoras y accesorios para realizar tu primera orden con envío nacional.
            </Typography>
            <Button
              component={Link}
              href="/tienda/kit-drones"
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 3.5, py: 1.25, borderRadius: 2.5, fontWeight: 700, textTransform: 'none' }}
            >
              Ir a la Tienda
            </Button>
          </Paper>
        ) : (
          /* Orders List */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {orders.map((order) => {
              const items = order.items || order.products || order.cartItems || []
              const totalAmount = order.total || order.totalAmount || 0
              const orderDate = order.createdAt?.seconds
                ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'Reciente'

              return (
                <Card
                  key={order.id}
                  elevation={0}
                  sx={{
                    borderRadius: 3.5,
                    border: '1px solid #e2e8f0',
                    bgcolor: '#ffffff',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: '#cbd5e1',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                    }
                  }}
                >
                  {/* Order Card Header */}
                  <Box
                    sx={{
                      p: 2.5,
                      bgcolor: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          ID de Compra
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>
                          #{order.id?.slice(0, 10).toUpperCase()}
                        </Typography>
                      </Box>

                      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                          Fecha
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarTodayIcon sx={{ fontSize: 14, color: '#64748b' }} /> {orderDate}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: '1rem !important', color: '#16a34a !important' }} />}
                        label={order.status === 'completed' ? 'Completado' : order.status === 'delivered' ? 'Entregado' : 'Pagado'}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: 'rgba(34, 197, 94, 0.1)',
                          color: '#16a34a',
                          border: '1px solid rgba(34, 197, 94, 0.3)'
                        }}
                      />

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ReceiptLongIcon />}
                        onClick={() => setSelectedInvoice(order)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 700,
                          borderColor: '#cbd5e1',
                          color: '#334155',
                          '&:hover': {
                            borderColor: '#00aCe4',
                            color: '#00aCe4',
                            bgcolor: 'rgba(0, 172, 228, 0.05)'
                          }
                        }}
                      >
                        Ver Factura
                      </Button>
                    </Box>
                  </Box>

                  {/* Order Items Table / List */}
                  <CardContent sx={{ p: 2.5 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {items.map((item, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                py: 1,
                                borderBottom: idx < items.length - 1 ? '1px dashed #f1f5f9' : 'none'
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '8px',
                                    bgcolor: '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    color: '#475569'
                                  }}
                                >
                                  {item.quantity || 1}x
                                </Box>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                    {item.name || 'Producto Wavi'}
                                  </Typography>
                                  {item.brand && (
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                      {item.brand}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>

                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                                {item.price ? formatCurrency(item.price * (item.quantity || 1)) : ''} COP
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Grid>

                      {/* Payment and Total Info */}
                      <Grid item xs={12} md={4} sx={{ borderLeft: { md: '1px solid #f1f5f9' }, pl: { md: 3 } }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                          <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5 }}>
                            Método de Pago:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', mb: 2, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <PaymentIcon sx={{ fontSize: 16, color: '#00aCe4' }} /> {order.paymentMethod?.toUpperCase() || 'MERCADO PAGO / PSE'}
                          </Typography>

                          <Typography variant="caption" sx={{ color: '#64748b', mb: 0.5 }}>
                            Total Facturado:
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 900, color: '#00aCe4' }}>
                            {formatCurrency(totalAmount)} COP
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )
            })}
          </Box>
        )}
      </Container>

      {/* Printable Invoice Modal */}
      <Dialog
        open={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3.5, p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Comprobante Digital de Compra
          </Typography>
          <IconButton onClick={() => setSelectedInvoice(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: { xs: 2, sm: 4 } }}>
          {selectedInvoice && (
            <Box id="printable-invoice" ref={printRef}>
              {/* Header Invoice Brand */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#00aCe4', letterSpacing: 0.5 }}>
                    WAVI AERONAUTICS
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    NIT: 901.458.291-3 | Colombia
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    ventas@wavi-aeronautics.com | www.wavi-aeronautics.com
                  </Typography>
                </Box>

                <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    FACTURA #{selectedInvoice.id?.slice(0, 10).toUpperCase()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    Fecha: {selectedInvoice.createdAt?.seconds
                      ? new Date(selectedInvoice.createdAt.seconds * 1000).toLocaleDateString('es-CO')
                      : 'Reciente'}
                  </Typography>
                  <Chip label="PAGO CONFIRMADO" size="small" color="success" sx={{ fontWeight: 800, mt: 0.5, fontSize: '0.65rem' }} />
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Client Info */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                  Datos del Cliente
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {user?.displayName || user?.email || 'Cliente Wavi'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#475569' }}>
                  {user?.email}
                </Typography>
                {selectedInvoice.shippingAddress && (
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                    Envío: {selectedInvoice.shippingAddress.street}, {selectedInvoice.shippingAddress.city}
                  </Typography>
                )}
              </Box>

              {/* Items Table */}
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, mb: 3 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Cant.</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Precio Unit.</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(selectedInvoice.items || selectedInvoice.products || []).map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                          {item.brand && <Typography variant="caption" sx={{ color: '#64748b' }}>{item.brand}</Typography>}
                        </TableCell>
                        <TableCell align="center">{item.quantity || 1}</TableCell>
                        <TableCell align="right">{formatCurrency(item.price || 0)} COP</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          {formatCurrency((item.price || 0) * (item.quantity || 1))} COP
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Total Calculation */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, mb: 3 }}>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Subtotal: {formatCurrency(selectedInvoice.total || 0)} COP
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Envío Nacional: GRATIS
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#00aCe4', mt: 1 }}>
                  Total Pagado: {formatCurrency(selectedInvoice.total || 0)} COP
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ color: '#94a3b8', textAlign: 'center', display: 'block', mt: 4 }}>
                Este documento es un comprobante de compra válido y registrado en Cloud Firestore para Wavi Aeronautics Store.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setSelectedInvoice(null)} sx={{ textTransform: 'none', color: '#64748b' }}>
            Cerrar
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={handlePrintInvoice}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 3 }}
          >
            Imprimir Factura
          </Button>
        </DialogActions>
      </Dialog>

      <AppFooter />
    </Box>
  )
}

export default withRoot(MisComprasPage)
