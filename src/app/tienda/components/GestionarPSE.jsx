'use client'
import React, { useEffect, useState, useContext } from 'react'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import { auth } from '@/firebase/firebaseClient'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import withRoot from '@/modules/withRoot'
import theme from '@/app/tienda/innerTheme'
import { parseCopCurrency } from '@/utilities/priceUtils'

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff'
  },
  formControl: {
    minWidth: 250
  },
  button: {
    marginTop: theme.spacing(1)
  }
})

const GestionarPSE = (props) => {
  const classes = styles(theme)
  const user = auth.currentUser || {}
  const userID = user.uid || null

  let shoppingCartID = null
  if (typeof window !== 'undefined') {
    shoppingCartID = sessionStorage.getItem('cartID')
  }

  const usedID = userID || shoppingCartID

  const { shoppingCart } = useContext(ShowCartContext)
  const { productos } = shoppingCart
  const { userInfo, shippingInfo } = props

  const [banks, setBanks] = useState([])
  const [selectedBank, setSelectedBank] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [idType, setIdType] = useState('CC')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const visibility = productos.length > 0

  // Fetch available banks on mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch('/api/pse-method')
        const data = await response.json()
        if (data.banks) {
          setBanks(data.banks)
        }
      } catch (err) {
        console.error('Error fetching banks:', err)
      }
    }
    fetchBanks()
  }, [])

  // Calculate total amount
  const calculateTotal = () => {
    return productos.reduce((total, producto) => {
      const price = parseCopCurrency(producto.precio) || 0
      const quantity = producto.cantidad || 1
      return total + (price * quantity)
    }, 0)
  }

  const handlePSEPayment = async () => {
    if (!selectedBank) {
      setError('Por favor selecciona un banco')
      return
    }
    if (!idNumber) {
      setError('Por favor ingresa tu número de identificación')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const totalAmount = calculateTotal()
      const description = productos.map(p => p.titulo).join(', ')

      const response = await fetch('/api/pse-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          description: `Compra Wavi Aeronautics: ${description}`.substring(0, 100),
          financialInstitution: selectedBank,
          payer: {
            email: userInfo?.userMail,
            userName: userInfo?.userName,
            userPhone: userInfo?.userPhone,
            identification: {
              type: idType,
              number: idNumber
            }
          },
          items: productos.map(p => ({
            productID: p.productID,
            title: p.titulo,
            quantity: p.cantidad || 1,
            unit_price: parseCopCurrency(p.precio)
          })),
          shipments: shippingInfo
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago PSE')
      }

      // Redirect to bank's PSE page
      if (data.external_resource_url) {
        window.location.href = data.external_resource_url
      } else {
        setError('No se pudo obtener la URL del banco. Intenta de nuevo.')
      }
    } catch (err) {
      console.error('Error creating PSE payment:', err)
      setError(err.message || 'Error al procesar el pago')
    } finally {
      setIsLoading(false)
    }
  }

  if (!visibility) return null

  return (
    <Box sx={classes.container}>
      <Typography variant="h6" gutterBottom>
        Pagar con PSE
      </Typography>
      
      <FormControl sx={classes.formControl} size="small">
        <InputLabel id="bank-select-label">Selecciona tu banco</InputLabel>
        <Select
          labelId="bank-select-label"
          value={selectedBank}
          label="Selecciona tu banco"
          onChange={(e) => setSelectedBank(e.target.value)}
        >
          {banks.map((bank) => (
            <MenuItem key={bank.id} value={bank.id}>
              {bank.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControl size="small" sx={{ minWidth: 80 }}>
          <InputLabel id="id-type-label">Tipo</InputLabel>
          <Select
            labelId="id-type-label"
            value={idType}
            label="Tipo"
            onChange={(e) => setIdType(e.target.value)}
          >
            <MenuItem value="CC">CC</MenuItem>
            <MenuItem value="CE">CE</MenuItem>
            <MenuItem value="NIT">NIT</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          label="Número de identificación"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        />
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="secondary"
        sx={classes.button}
        onClick={handlePSEPayment}
        disabled={isLoading || !selectedBank || !idNumber}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Pagar con PSE'}
      </Button>

      <Typography variant="caption" color="textSecondary">
        Serás redirigido al portal de tu banco para completar el pago.
      </Typography>
    </Box>
  )
}

export default withRoot(GestionarPSE)
