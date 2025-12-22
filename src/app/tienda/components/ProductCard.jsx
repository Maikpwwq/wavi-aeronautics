import React from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
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
    height: '330px',
    width: 'auto'
  }
})

const ProductCard = ({ products, category }) => {
  const classes = styles()
  const dispatch = useDispatch()
  const categoria = category || 'tienda'
  const producto = products
  const { titulo, precio, imagenes, productID, marca } = producto

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
        <Card className="product-card" style={{ height: '100%' }}>
          <CardActionArea>
            {producto !== undefined && imagenes && imagenes.length > 0 && (
              <Link
                style={classes.imageCentered}
                href={{
                  pathname: '/tienda/producto',
                  query: { id: productID, category: categoria, marca: marca },
                }}
              >
                <div className="product-card-image-container">
                  <CardMedia
                    className="product-card-image"
                    component="img"
                    style={classes.imageSize}
                    image={typeof imagenes[0] === 'string' ? imagenes[0] : imagenes[0]?.url || ''}
                    alt={titulo}
                    onClick={handleSelect}
                  />
                </div>
              </Link>
            )}
          </CardActionArea>
          <CardHeader
            title={titulo}
            titleTypographyProps={{
              variant: 'h6',
              className: 'product-card-title',
              sx: {
                transition: 'color 0.2s cubic-bezier(0.4, 0, 0.2, 1)' 
              }
            }}
            subheader={precio}
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
