'use client'
import React, { useContext, useState, useMemo, Suspense } from 'react'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import { useRouter } from 'next/navigation'
import { parseCopCurrency } from '@/utilities/priceUtils'
import ProductLink from '../components/ProductLink'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import DeleteIcon from '@mui/icons-material/Delete'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import withRoot from '@/modules/withRoot'
import theme from '../innerTheme'

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'contain',
    borderRadius: '8px',
    border: '1px solid #eee',
    padding: '4px',
    backgroundColor: '#fff'
  },
  cartItem: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'box-shadow 0.2s ease',
    '&:hover': {
      boxShadow: theme.shadows?.[4] || '0 4px 12px rgba(0,0,0,0.1)'
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: theme.spacing(2)
    }
  },
  summaryCard: {
    padding: theme.spacing(3)
  }
})

function ShowCartPage () {
  const navigate = useRouter()
  const { shoppingCart, updateShowCart, removeFromCart } = useContext(ShowCartContext)
  const cart = shoppingCart?.productos || []
  const classes = styles(theme)

  // Selection state — all items selected by default
  const [selectedIds, setSelectedIds] = useState(() => {
    const initial = new Set()
    cart.forEach(item => initial.add(item.productID))
    return initial
  })

  // Keep selection in sync when cart items change (new items auto-selected)
  React.useEffect(() => {
    setSelectedIds(prev => {
      const updated = new Set(prev)
      cart.forEach(item => {
        // Auto-select newly added items
        if (!updated.has(item.productID) && prev.size === 0) {
          updated.add(item.productID)
        }
      })
      // Remove IDs for items no longer in cart
      for (const id of updated) {
        if (!cart.find(item => item.productID === id)) {
          updated.delete(id)
        }
      }
      return updated
    })
  }, [cart])

  // On first render with items, select all
  React.useEffect(() => {
    if (cart.length > 0 && selectedIds.size === 0) {
      setSelectedIds(new Set(cart.map(item => item.productID)))
    }
  }, [cart.length])

  const toggleItem = (productID) => {
    setSelectedIds(prev => {
      const updated = new Set(prev)
      if (updated.has(productID)) {
        updated.delete(productID)
      } else {
        updated.add(productID)
      }
      return updated
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === cart.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(cart.map(item => item.productID)))
    }
  }

  // Compute totals for selected items only
  const { selectedCount, selectedTotal } = useMemo(() => {
    let count = 0
    let total = 0
    cart.forEach(item => {
      if (selectedIds.has(item.productID)) {
        const qty = parseInt(item.cantidad) || 1
        count += qty
        total += parseCopCurrency(item.precio) * qty
      }
    })
    return { selectedCount: count, selectedTotal: total }
  }, [cart, selectedIds])

  const allSelected = cart.length > 0 && selectedIds.size === cart.length
  const noneSelected = selectedIds.size === 0

  const handleCheckout = (e) => {
    e.preventDefault()
    // Store selected IDs in sessionStorage for the checkout page
    const selectedArray = Array.from(selectedIds)
    sessionStorage.setItem('selectedCartItems', JSON.stringify(selectedArray))
    sessionStorage.setItem('cartUpdated', 'detalles-envio')
    updateShowCart(false)
    navigate.push('detalles-envio', {})
  }

  const handleDelete = (productID, titulo) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${titulo}" del carrito?`)) {
      removeFromCart(productID)
      // Also remove from selection
      setSelectedIds(prev => {
        const updated = new Set(prev)
        updated.delete(productID)
        return updated
      })
    }
  }

  return (
    <Box sx={classes.root}>
      <Box sx={{ maxWidth: '900px', width: '100%', margin: '0 auto', px: 2 }}>
        {/* Page Title */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          <ShoppingCartIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 2, color: 'primary.main' }} />
          Tu Carrito de Compras
        </Typography>

        <Suspense fallback={
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        }>
          {cart.length > 0 ? (
            <>
              {/* Select All Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allSelected}
                      indeterminate={!allSelected && !noneSelected}
                      onChange={toggleAll}
                      sx={{
                        color: '#00aCe4',
                        '&.Mui-checked': { color: '#00aCe4' },
                        '&.MuiCheckbox-indeterminate': { color: '#00aCe4' }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                    </Typography>
                  }
                />
                <Typography variant="body2" color="text.secondary">
                  {selectedIds.size} de {cart.length} seleccionados
                </Typography>
              </Box>

              {/* Product List — Single Column */}
              {cart.map(({ titulo, precio, imagenes, productID, categoria, marca, cantidad }, index) => {
                const isSelected = selectedIds.has(productID)
                return (
                  <Paper
                    key={index}
                    elevation={isSelected ? 2 : 0}
                    sx={{
                      ...classes.cartItem,
                      opacity: isSelected ? 1 : 0.6,
                      border: isSelected ? '2px solid #00aCe4' : '2px solid transparent',
                      borderRadius: 2,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      {/* Checkbox */}
                      <Checkbox
                        checked={isSelected}
                        onChange={() => toggleItem(productID)}
                        sx={{
                          color: '#00aCe4',
                          '&.Mui-checked': { color: '#00aCe4' }
                        }}
                      />

                      {/* Product Image */}
                      <ProductLink product={{ productID, categoria, marca }}>
                        <Box
                          component="img"
                          src={imagenes?.[0]}
                          alt={titulo}
                          sx={classes.image}
                        />
                      </ProductLink>

                      {/* Product Info */}
                      <Box sx={{ flexGrow: 1 }}>
                        <ProductLink
                          product={{ productID, categoria, marca }}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2, mb: 0.5 }}>
                            {titulo}
                          </Typography>
                        </ProductLink>
                        <Typography variant="body2" color="text.secondary">
                          Marca: {marca || 'Genérica'} | Categoría: {categoria || 'Varios'}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          Cantidad: <strong>{cantidad || 1}</strong>
                        </Typography>
                      </Box>
                    </Box>

                    {/* Price & Delete */}
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      minWidth: '120px',
                      [theme.breakpoints.down('sm')]: {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%'
                      }
                    }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                        {precio}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(productID, titulo)}
                        sx={{ mt: 1 }}
                        aria-label="eliminar del carrito"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                )
              })}

              {/* Order Summary — Below products, single column */}
              <Paper elevation={3} sx={{ ...classes.summaryCard, mt: 4, borderRadius: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Resumen de Orden
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Artículos seleccionados:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedCount}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Total artículos en carrito:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {shoppingCart.items}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Total a pagar:</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {selectedTotal > 0 ? `$ ${selectedTotal.toLocaleString('es-CO')}` : '$ 0'}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  disabled={noneSelected}
                  sx={{ py: 1.5, fontSize: '1.1rem' }}
                >
                  {noneSelected ? 'Selecciona productos para continuar' : 'Finalizar Compra'}
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => navigate.push('/tienda/kit-drones')}
                >
                  Seguir comprando
                </Button>
              </Paper>
            </>
          ) : (
            <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 4 }}>
              <Typography variant="h5" gutterBottom color="text.secondary">
                Tu carrito está vacío
              </Typography>
              <Typography variant="body1" sx={{ mb: 4 }}>
                ¡Explora nuestros productos y encuentra lo que necesitas!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate.push('/')}
              >
                Ir a la Tienda
              </Button>
            </Paper>
          )}
        </Suspense>
      </Box>
    </Box>
  )
}

export default withRoot(ShowCartPage)
