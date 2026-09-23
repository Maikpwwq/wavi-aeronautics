import React, { useContext } from 'react'
import { ShowCartContext } from '@/app/tienda/providers/ShoppingCartProvider'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import { addProductToCart } from './product-detail/cartUtils'

const AddProduct = ({
  product,
  selectedVariations = null,
  selectedOption = null,
  variant = 'icon',
  disabled = false,
  quantity = 1
}) => {
  const { shoppingCart, updateCart, updateShowCart } = useContext(ShowCartContext)

  const isUnavailable = disabled || product?.availability === false

  const handleAddToCart = (e) => {
    if (e) e.preventDefault()
    if (isUnavailable) return

    addProductToCart({
      product,
      selectedVariations,
      selectedOption,
      quantity,
      shoppingCart,
      updateCart,
      showCartDrawer: true,
      updateShowCart
    })
  }

  if (variant === 'button') {
    return (
      <Box
        component={motion.div}
        whileHover={!isUnavailable ? { scale: 1.02 } : {}}
        whileTap={!isUnavailable ? { scale: 0.98 } : {}}
        sx={{ width: '100%' }}
      >
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={isUnavailable}
          onClick={handleAddToCart}
          startIcon={<AddShoppingCartIcon />}
          sx={{
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 3,
            backgroundColor: isUnavailable ? '#9e9e9e' : '#00bcd4', // Electric Blue or Gray
            '&:hover': {
              backgroundColor: isUnavailable ? '#9e9e9e' : '#0097a7',
            },
            boxShadow: isUnavailable ? 'none' : '0 8px 24px rgba(0, 188, 212, 0.3)',
            textTransform: 'none',
            letterSpacing: 1
          }}
        >
          {isUnavailable ? 'AGOTADO' : 'AGREGAR AL CARRITO'}
        </Button>
      </Box>
    )
  }

  return (
    <IconButton
      color="inherit"
      disabled={isUnavailable}
      onClick={handleAddToCart}
      aria-label="Agregar al carrito"
      sx={{ opacity: isUnavailable ? 0.4 : 1 }}
    >
      <AddShoppingCartIcon fontSize="large" />
    </IconButton>
  )
}

AddProduct.propTypes = {
  product: PropTypes.object.isRequired,
  selectedVariations: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  selectedOption: PropTypes.object,
  variant: PropTypes.oneOf(['icon', 'button']),
  disabled: PropTypes.bool,
  quantity: PropTypes.number
}

export default AddProduct
