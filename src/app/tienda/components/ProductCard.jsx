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
          style={{ height: '100%' }}
          sx={{
            transition: 'border-radius 0.3s ease',
            '&:hover': {
              borderRadius: '16px' // Augment border radius on hover
            }
          }}
        >
          <CardActionArea>
            {producto !== undefined && images && images.length > 0 && (
              <ProductLink
                product={producto}
                style={classes.imageCentered}
              >
                <div className="product-card-image-container">
                  <CardMedia
                    className="product-card-image"
                    component="img"
                    style={classes.imageSize}
                    image={typeof images[0] === 'string' ? images[0] : images[0]?.url || ''}
                    alt={name}
                    onClick={handleSelect}
                  />
                </div>
              </ProductLink>
            )}
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
              <AddProduct product={producto}/>
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
