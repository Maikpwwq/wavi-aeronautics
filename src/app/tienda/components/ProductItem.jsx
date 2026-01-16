import React from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { loadDetail } from '@/store/states/product'
import { calculateCopPrice } from '@/utilities/priceUtils'
import { BRAND_COLORS } from '../innerTheme'

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
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          borderColor: 'transparent'
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
               '.MuiCardActionArea-root:hover &': {
                 transform: 'scale(1.05)'
               }
             }}
           />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2, width: '100%' }}>
          {/* Brand */}
          <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, mb: 0.5, display: 'block' }}>
            {brand}
          </Typography>

          {/* Title - Clamped to 2 lines */}
          <Typography 
            variant="subtitle1" 
            component="div" 
            sx={{ 
              fontWeight: 'bold', 
              lineHeight: 1.2,
              mb: 1,
              height: '2.4em', // approx 2 lines
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              color: BRAND_COLORS.text.primary
            }}
          >
            {name}
          </Typography>

          {/* Price */}
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
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
