import React from 'react'
import { calculateCopPrice } from '@/utilities/priceUtils'
import { useDispatch } from 'react-redux'
import ProductLink from './ProductLink'
import { loadDetail } from '@/store/states/product'
import AddProduct from '@/app/tienda/components/AddProduct'

// import "sessionstorage-polyfill";
// import "localstorage-polyfill";
// global.sessionstorage;
// global.localStorage;

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import { CardActionArea } from '@mui/material'
import PropTypes from 'prop-types'

// import { useQuery } from "react-query";

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
  const categoria = category || 'tienda'
  const producto = products || {}
  
  // Standardized fields
  const name = producto.name || ''
  const images = producto.images || []
  const brand = producto.brand || ''
  const id = producto.productID || ''

  // Price Handling: 'price' is USD (Number), 'precio' is COP (String/Number)
  // If we have 'price', calculate COP. If 'precio', use as legacy display.
  let displayPrice = '$ 0';
  if (producto.price) {
    displayPrice = calculateCopPrice(producto.price);
  } else if (producto.precio) {
    displayPrice = typeof producto.precio === 'string' 
      ? producto.precio 
      : `$ ${producto.precio.toLocaleString()}`;
  }

  const isAgotado = producto.availability === false
  const firstImage = images && images.length > 0 ? (typeof images[0] === 'string' ? images[0] : images[0]?.url || '') : ''

  const handleSelect = () => {
    console.log('producto', producto)
    try {
      dispatch(loadDetail(producto))
    } catch (e) {
      return console.error(e.message)
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
            '&:hover': {
              borderRadius: '16px' // Augment border radius on hover
            }
          }}
        >
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
                  pt: '80%', // Consistent aspect ratio container even if image fails to load
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
                      bgcolor: 'rgba(211, 47, 47, 0.9)', // Red badge
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
          ></CardHeader>
        </Card>
      </Box>
    </>
  )
}

ProductCard.propTypes = {
  products: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired
}

export default ProductCard
