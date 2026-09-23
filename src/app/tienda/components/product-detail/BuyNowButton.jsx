'use client'

import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import { motion } from 'framer-motion'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import { addProductToCart } from './cartUtils'

/**
 * 'Comprar ahora' Express CTA Button
 * Adds selected quantity to cart and immediately navigates to checkout/cart.
 */
export const BuyNowButton = ({
  product,
  selectedVariations = null,
  selectedOption = null,
  quantity = 1,
  disabled = false,
  fullWidth = true,
  size = 'large'
}) => {
  const router = useRouter()
  const { shoppingCart, updateCart, updateShowCart } = useContext(ShowCartContext)

  const isUnavailable = disabled || product?.availability === false

  const handleBuyNow = (e) => {
    e?.preventDefault?.()
    if (isUnavailable || !product) return

    const success = addProductToCart({
      product,
      selectedVariations,
      selectedOption,
      quantity,
      shoppingCart,
      updateCart,
      showCartDrawer: false,
      updateShowCart
    })

    if (success) {
      router.push('/tienda/ver-carrito')
    }
  }

  return (
    <Box
      component={motion.div}
      whileHover={!isUnavailable ? { scale: 1.02 } : {}}
      whileTap={!isUnavailable ? { scale: 0.98 } : {}}
      sx={{ width: fullWidth ? '100%' : 'auto' }}
    >
      <Button
        fullWidth={fullWidth}
        variant="contained"
        size={size}
        disabled={isUnavailable}
        onClick={handleBuyNow}
        startIcon={<FlashOnIcon sx={{ color: '#ffffff' }} />}
        data-testid="buy-now-button"
        sx={{
          py: size === 'large' ? 1.8 : 1.2,
          px: 3,
          fontSize: size === 'large' ? '1.05rem' : '0.95rem',
          fontWeight: 800,
          borderRadius: 3,
          background: isUnavailable
            ? '#9e9e9e'
            : 'linear-gradient(135deg, #ff7a00 0%, #e65100 100%)',
          color: '#ffffff',
          '&:hover': {
            background: isUnavailable
              ? '#9e9e9e'
              : 'linear-gradient(135deg, #f57200 0%, #d84315 100%)',
            boxShadow: '0 10px 25px rgba(230, 81, 0, 0.4)'
          },
          boxShadow: isUnavailable
            ? 'none'
            : '0 6px 20px rgba(255, 111, 0, 0.28)',
          textTransform: 'none',
          letterSpacing: 0.5,
          transition: 'all 0.2s ease-in-out'
        }}
      >
        Comprar ahora
      </Button>
    </Box>
  )
}

BuyNowButton.propTypes = {
  product: PropTypes.object.isRequired,
  selectedVariations: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  selectedOption: PropTypes.object,
  quantity: PropTypes.number,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
}

export default BuyNowButton
