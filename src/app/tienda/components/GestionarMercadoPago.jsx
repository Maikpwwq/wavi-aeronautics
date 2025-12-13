'use client'
import React, { useEffect, useState, useContext } from 'react'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import { auth } from '@/firebase/firebaseClient'
import { useMercadopago } from 'react-sdk-mercadopago'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import withRoot from '@/modules/withRoot'
import theme from '@/app/tienda/innerTheme'
import { parseCopCurrency } from '@/utilities/priceUtils'

const styles = (theme) => ({
  checkout: {
    padding: theme.spacing(2),
    marginRight: theme.spacing(1)
  },
  pagoBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '24px',
    position: 'relative'
  }
})

const GestionarMercadoPago = (props) => {
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

  const visibility = productos.length > 0
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGOS_PUBLIC_KEY

  const mercadopagoSDK = useMercadopago.v2(publicKey, {
    locale: 'es-CO'
  })

  // Call our backend API to create MercadoPago preference
  const createPreference = async (productos) => {
    // Prepare items with numeric prices for API
    const items = productos.map(producto => ({
      productID: producto.productID,
      title: producto.titulo,
      description: producto.descripcion || '',
      picture_url: producto.imagenes?.[0] || '',
      quantity: producto.cantidad || 1,
      unit_price: parseCopCurrency(producto.precio) // Convert formatted price to number
    }))

    const payer = {
      name: userInfo?.userName,
      email: userInfo?.userMail,
      phone: { number: userInfo?.userPhone },
      address: {
        zip_code: shippingInfo?.shippingPostalCode,
        street_name: shippingInfo?.shippingDirection
      }
    }

    const shipments = {
      shippingPostalCode: shippingInfo?.shippingPostalCode,
      shippingDirection: shippingInfo?.shippingDirection,
      shippingCiudad: shippingInfo?.shippingCiudad
    }

    const response = await fetch('/api/mercadopago-method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        payer,
        shipments,
        externalReference: `order_${usedID}_${Date.now()}`
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create preference')
    }

    return response.json()
  }

  const handleCheckout = async () => {
    if (!usedID || !productos || productos.length === 0) {
      setError('No hay productos en el carrito')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('Creating MercadoPago preference...')
      const preference = await createPreference(productos)
      console.log('Preference created:', preference)

      if (mercadopagoSDK && preference.id) {
        if (props.onPaymentMethodReady) {
          props.onPaymentMethodReady()
        }
        mercadopagoSDK.checkout({
          preference: {
            id: preference.id
          },
          render: {
            container: '.cho-container',
            label: 'Pagar con Mercado Pago',
            type: 'wallet'
          }
        })
      }
    } catch (err) {
      console.error('Error creating preference:', err)
      setError(err.message || 'Error al procesar el pago')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Box sx={classes.pagoBtn}>
        {!props.isOrderConfirmed && (
          <Button
            variant="contained"
            color="primary"
            sx={classes.checkout}
            style={{ visibility: visibility ? 'visible' : 'hidden' }}
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Orden'}
          </Button>
        )}
        {error && (
          <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.875rem' }}>
            {error}
          </Box>
        )}
        <span className="cho-container" />
      </Box>
    </>
  )
}

export default withRoot(GestionarMercadoPago)

