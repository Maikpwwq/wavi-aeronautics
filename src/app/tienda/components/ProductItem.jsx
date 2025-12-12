import React from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { loadDetail } from '@/store/states/product'

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

const ProductItem = ({ products, category }) => {
  const classes = styles()
  const dispatch = useDispatch()
  const categoria = category || 'tienda'
  const producto = products
  const { titulo, precio, imagenes, productID, marca } = producto

  const handleSelect = () => {
    // console.log('producto', producto)
    try {
      dispatch(loadDetail({ producto }))
    } catch (e) {
      return console.error(e.message)
    }
  }

  return (
    <>
      <Box className="" maxWidth="sm" style={{ height: '100%' }}>
        <Card style={{ height: '100%' }}>
          <CardActionArea>
            {producto !== undefined && imagenes && imagenes.length > 0 && (
              <Link
                style={classes.imageCentered}
                href={{
                  pathname: 'producto',
                  query: `id=${productID}&category=${categoria}&marca=${marca}`,
                  state: { product: products }
                }}
              >
                <CardMedia
                  component="img"
                  style={classes.imageSize}
                  image={imagenes[0]}
                  alt={titulo}
                  onClick={() => handleSelect}
                />
              </Link>
            )}
          </CardActionArea>
          <CardHeader
            title={titulo}
            subheader={precio}
          ></CardHeader>
        </Card>
      </Box>
    </>
  )
}

ProductItem.propTypes = {
  products: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired
}

export default ProductItem
