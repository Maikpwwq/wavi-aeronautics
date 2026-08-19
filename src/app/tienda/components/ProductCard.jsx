import React, { useState } from 'react'
import { calculateCopPrice } from '@/utilities/priceUtils'
import { useDispatch, useSelector } from 'react-redux'
import ProductLink from './ProductLink'
import { loadDetail } from '@/store/states/product'
import AddProduct from '@/app/tienda/components/AddProduct'
import { useFavorites } from '@/app/providers/FavoritesProvider'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { CardActionArea } from '@mui/material'
import PropTypes from 'prop-types'

const styles = () => ({
  imageCentered: {
    display: 'flex',
    justifyContent: 'center'
  },
  imageSize: {
    height: 'auto',
    maxHeight: '330px',
    width: '100%',
    maxWidth: '100%',
    objectFit: 'contain'
  }
})

const ProductCard = ({ products, category }) => {
  const classes = styles()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const { isFavorite, toggleFavorite } = useFavorites()
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  
  const categoria = category || 'tienda'
  const producto = products || {}
  
  // Standardized fields
  const name = producto.name || ''
  const images = producto.images || []
  const brand = producto.brand || ''
  const id = String(producto.productID || producto.id || '')

  // Price Handling: 'price' is USD (Number), 'precio' is COP (String/Number)
  let displayPrice = '$ 0'
  if (producto.price) {
    displayPrice = calculateCopPrice(producto.price)
  } else if (producto.precio) {
    displayPrice = typeof producto.precio === 'string' 
      ? producto.precio 
      : `$ ${producto.precio.toLocaleString()}`
  }

  const isAgotado = producto.availability === false
  const firstImage = images && images.length > 0 ? (typeof images[0] === 'string' ? images[0] : images[0]?.url || '') : ''
  const isFav = isFavorite(id)

  const handleSelect = () => {
    try {
      dispatch(loadDetail(producto))
    } catch (e) {
      console.error(e.message)
    }
  }

  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user?.uid) {
      setSnackbar({
        open: true,
        message: 'Inicia sesión para guardar tus productos favoritos',
        severity: 'warning'
      })
      return
    }

    try {
      await toggleFavorite(producto)
      setSnackbar({
        open: true,
        message: isFav ? 'Producto eliminado de favoritos' : '¡Producto guardado en favoritos!',
        severity: 'success'
      })
    } catch (err) {
      console.error('Error toggling favorite:', err)
      setSnackbar({
        open: true,
        message: 'Error al actualizar favoritos',
        severity: 'error'
      })
    }
  }

  return (
    <>
      <Box className="" maxWidth="sm" style={{ height: '100%' }}>
        <Card 
          className="product-card" 
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          sx={{
            transition: 'all 0.3s ease',
            opacity: isAgotado ? 0.85 : 1,
            position: 'relative',
            '&:hover': {
              borderRadius: '16px'
            }
          }}
        >
          {/* Favorite Toggle Button */}
          <Tooltip title={isFav ? 'Eliminar de favoritos' : 'Guardar en favoritos'} arrow>
            <IconButton
              aria-label="Favorito"
              onClick={handleFavoriteClick}
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 4,
                bgcolor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(4px)',
                color: isFav ? '#e91e63' : 'rgba(0, 0, 0, 0.54)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: '#ffffff',
                  color: '#e91e63',
                  transform: 'scale(1.15)'
                }
              }}
            >
              {isFav ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <CardActionArea sx={{ flexGrow: 1 }}>
            <ProductLink
              product={producto}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <Box 
                className="product-card-image-container"
                sx={{
                  position: 'relative',
                  width: '100%',
                  pt: '80%',
                  bgcolor: '#fff',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {firstImage && (
                  <CardMedia
                    className="product-card-image"
                    component="img"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      p: 2,
                      filter: isAgotado ? 'grayscale(50%)' : 'none'
                    }}
                    image={firstImage}
                    alt={name}
                    onClick={handleSelect}
                  />
                )}

                {/* Agotado Badge Overlay */}
                {isAgotado && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'rgba(211, 47, 47, 0.9)',
                      color: '#ffffff',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1.5,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      zIndex: 2
                    }}
                  >
                    Agotado
                  </Box>
                )}
              </Box>
            </ProductLink>
          </CardActionArea>
          <CardHeader
            title={name}
            titleTypographyProps={{
              variant: 'h6',
              className: 'product-card-title',
              sx: {
                transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)' 
              }
            }}
            subheader={displayPrice}
            action={
              <AddProduct product={producto} disabled={isAgotado} />
            }
          />
        </Card>
      </Box>

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
    </>
  )
}

ProductCard.propTypes = {
  products: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired
}

export default ProductCard

