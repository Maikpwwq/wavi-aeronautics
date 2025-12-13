'use client'
import React, { useEffect, useState } from 'react'
// import { useLocation } from "react-router-dom";
// import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useSelector, connect } from 'react-redux'

import { getProductById } from '@/services/sharedServices'
import { sharingInformationService } from '@/services/sharing-information'

// import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import MobileStepper from '@mui/material/MobileStepper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import CircularProgress from '@mui/material/CircularProgress'

import SwipeableViews from 'react-swipeable-views'
import Typography from '@/modules/components/Typography'
import { autoPlay } from 'react-swipeable-views-utils'
import withRoot from '@/modules/withRoot'
// import theme from "../innerTheme";
// import { styled } from "@mui/material/styles";

const styles = (theme) => ({
  onSmallCol: {
    display: 'flex',
    flexDirection: 'row',
    margin: `${theme.spacing(2)} ${theme.spacing(0)}`,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column !important'
    }
  },
  infoProduct: {
    marginLeft: `${theme.spacing(2)}`
  },
  detailProduct: {
    margin: `${theme.spacing(2)} ${theme.spacing(2)}`
  },
  moreImgs: {
    flexWrap: 'wrap !important',
    display: 'flex !important',
    margin: `${theme.spacing(2)} ${theme.spacing(2)}`
  }
})

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

const ProductDetail = (props) => {
  // const { state } = router;
  const theme = useTheme()
  const classes = styles(theme)
  // const location = useLocation();
  // const { search } = location;
  // const category = search.split("=")[1];
  // console.log("location", location);
  // console.log("category", category);
  // console.log("thisstate", props.state);
  // router.state, router.search, router.query["id"], router.query["category"]

  // se carga del store el initial state de un producto ejemplo
  const shopState = useSelector((store) => store.product)
  const product = shopState || []
  // const { titulo, precio, descripcion, especificaciones, incluye, imagenes } =
  //   shopState;

  const [activeStep, setActiveStep] = useState(0)
  const [productInfo, setProductInfo] = useState(product)
  console.log('store product', product)
  const maxSteps = product && product.imagenes ? product.imagenes.length : 0

  // const router = useRouter()
  // console.log("router", router);
  const searchParams = useSearchParams()
  const searchId = searchParams.get('id')
  const category = searchParams.get('category')
  const marca = searchParams.get('marca')
  // Sync local state with Redux state when it changes
  useEffect(() => {
    if (product && product.titulo !== 'Producto 1') { // Check if it's not default placeholder if possible, or just strict check
      setProductInfo(product)
    } else if (product) {
       // If Redux has default but we might have better info from fetch later, this is tricky.
       // Usually Redux state should be authoritative if populated.
       // Let's just trust Redux if it has content.
       setProductInfo(product)
    }
  }, [product])

  useEffect(() => {
    if (!searchId) return;

    const subscription$ = getProductById(searchId, category, marca)
    
    // utiliza el servicio para buscar un producto en firebase (searchId, category) y compartir su información
    const productSub = subscription$.subscribe((response) => {
      if (response) {
        console.log('storeProductInfo', response)
      }
    })
    
    // lee la información del producto que fue compartida
    const currentProduct = sharingInformationService.getSubject()
    const infoSub = currentProduct.subscribe((data) => {
      if (data) {
        const { productos } = data
        if (productos && productos.length > 0) {
          console.log('currentProduct', productos[0])
          setProductInfo(productos[0])
        }
      }
    })

    return () => {
      productSub.unsubscribe()
      infoSub.unsubscribe()
    }
  }, [searchId, category, marca])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleStepChange = (step) => {
    console.log('step', step)
    setActiveStep(step)
  }

  return (
    <>
      <Container fixed>
        {!!product && product
          ? (
          <Box sx={{ pt: 8, pb: 6 }}>
            <Card>
              <CardHeader
                title={productInfo.titulo}
                subheader={productInfo.precio}
                sx={classes.detailProduct}
              ></CardHeader>
              <CardContent>
                <Box sx={classes.onSmallCol}>
                  <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
                    <AutoPlaySwipeableViews
                      axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                      index={activeStep}
                      onChangeIndex={(e) => handleStepChange(e)}
                      enableMouseEvents
                    >
                      {!!productInfo.imagenes &&
                        productInfo.imagenes.map((image, key) => (
                          <Box
                            key={key}
                            component="img"
                            src={image}
                            alt={productInfo.titulo}
                            sx={{
                              height: 400,
                              display: 'block',
                              maxWidth: 400,
                              overflow: 'hidden',
                              width: '100%'
                            }}
                          ></Box>
                        ))}
                    </AutoPlaySwipeableViews>
                    <MobileStepper
                      steps={maxSteps}
                      position="static"
                      activeStep={activeStep}
                      nextButton={
                        <Button
                          size="small"
                          onClick={() => handleNext()}
                          disabled={activeStep === maxSteps - 1}
                        >
                          Siguiente
                          {theme.direction === 'rtl'
                            ? (
                            <KeyboardArrowLeft />
                              )
                            : (
                            <KeyboardArrowRight />
                              )}
                        </Button>
                      }
                      backButton={
                        <Button
                          size="small"
                          onClick={() => handleBack()}
                          disabled={activeStep === 0}
                        >
                          {theme.direction === 'rtl'
                            ? (
                            <KeyboardArrowRight />
                              )
                            : (
                            <KeyboardArrowLeft />
                              )}
                          Anterior
                        </Button>
                      }
                    />
                  </Box>
                  <Box sx={classes.infoProduct}>
                    <Typography variant="h5">Descripción: </Typography>
                    <Typography variant="body1">
                      {productInfo.descripcion}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={classes.detailProduct}>
                  <Typography variant="h5">Especificaciones: </Typography>
                  <Typography variant="body1">
                    {productInfo.especificaciones}
                  </Typography>
                  <br />
                  <Typography variant="h5">Incluye: </Typography>
                  <Typography variant="body1">{productInfo.incluye}</Typography>
                </Box>
              </CardContent>
              <CardMedia component="div" sx={classes.moreImgs}>
                {!!productInfo.imagenes &&
                  productInfo.imagenes.map((image, key) => (
                    <Box
                      key={key}
                      component="img"
                      src={image}
                      alt={productInfo.titulo}
                      sx={{
                        height: 330,
                        display: 'block',
                        maxWidth: 330,
                        overflow: 'hidden',
                        width: '100%'
                      }}
                    ></Box>
                  ))}
              </CardMedia>
            </Card>
          </Box>
            )
          : (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
            )}
      </Container>
    </>
  )
}

ProductDetail.propTypes = {}

const mapStateToProps = (state) => {
  // console.log("state", state);
  return {
    productInfo: state.product
  }
}

export default connect(mapStateToProps, null)(withRoot(ProductDetail))
