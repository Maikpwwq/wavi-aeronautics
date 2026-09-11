import React from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { loadDetail } from '@/store/states/product'
import { calculateCopPrice } from '@/utilities/priceUtils'
import { BRAND_COLORS } from '@/app/tienda/innerTheme'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { CardActionArea } from '@mui/material'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'

const ProductItem = ({ products, category }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const categoria = category || 'tienda'
  const producto = products
  
  if (!producto) return null
  
  // Standardized fields
  const name = producto.name || ''
  const images = producto.images || []
  const brand = producto.brand || 'Aeronautics'
  const id = producto.productID || ''

  // Price logic
  let displayPrice = '$ 0';
  if (producto.price) {
    displayPrice = calculateCopPrice(producto.price);
  } else if (producto.precio) {
    displayPrice = typeof producto.precio === 'string' 
      ? producto.precio 
      : `$ ${producto.precio.toLocaleString()}`;
  }

  const imageUrl = images && images.length > 0 
    ? (typeof images[0] === 'string' ? images[0] : images[0]?.url || '') 
    : '/static/images/no-image.png'

  const handleSelect = () => {
    try {
      dispatch(loadDetail({ producto }))
    } catch (e) {
      console.error(e.message)
    }
  }

  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3,
        transformOrigin: 'center center',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 14px 30px -4px rgba(0, 172, 228, 0.18), 0 8px 16px -4px rgba(15, 23, 42, 0.08)',
          borderColor: 'rgba(0, 172, 228, 0.35)'
        }
      }}
    >
      <CardActionArea 
        component={Link} 
        href={{
          pathname: '/tienda/producto',
          query: { id: id, category: categoria, marca: brand },
        }}
        onClick={handleSelect}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}
      >
        {/* Image Container - Square Aspect Ratio */}
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          pt: '100%', // 1:1 Aspect Ratio
          bgcolor: '#fff',
          overflow: 'hidden',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
           {imageUrl && (
             <Box 
               component="img"
               src={imageUrl}
               alt={name}
               sx={{
                 position: 'absolute',
                 top: 0,
                 left: 0,
                 width: '100%',
                 height: '100%',
                 objectFit: 'contain',
                 padding: 3,
                 transition: 'transform 0.5s ease',
                 filter: producto.availability === false ? 'grayscale(50%)' : 'none',
                 '.MuiCardActionArea-root:hover &': {
                   transform: 'scale(1.06)'
                 }
               }}
             />
           )}
           {producto.availability === false && (
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

        <CardContent sx={{ flexGrow: 1, p: 2, width: '100%' }}>
          {/* Brand */}
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#64748b', 
              textTransform: 'uppercase', 
              letterSpacing: 1.2, 
              fontWeight: 700, 
              mb: 0.5, 
              display: 'block',
              fontSize: '0.72rem'
            }}
          >
            {brand}
          </Typography>

          {/* Title - Clamped to 2 lines */}
          <Typography 
            variant="subtitle1" 
            component="div" 
            sx={{ 
              fontWeight: 700, 
              lineHeight: 1.3,
              mb: 1,
              height: '2.6em', // approx 2 lines
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              color: '#0f172a',
              fontSize: '0.95rem'
            }}
          >
            {name}
          </Typography>

          {/* Price */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800, 
              color: '#00aCe4',
              fontSize: '1.15rem'
            }}
          >
            {displayPrice}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

ProductItem.propTypes = {
  products: PropTypes.object.isRequired,
  category: PropTypes.string
}

export default ProductItem
