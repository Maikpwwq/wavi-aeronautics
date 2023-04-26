'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import PropTypes from 'prop-types'
import withRoot from '@/modules/withRoot'
import theme from '@/modules/theme'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Container from '@mui/material/Container'
import Typography from '../components/Typography'

const DJI1 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-1.png?alt=media&token=f4f153a2-45fd-415d-884c-6964d3bb582b'
const DJI2 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-2.png?alt=media&token=6c6a1248-55dd-46dd-9826-85614adccf4f'
const DJI3 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-3.png?alt=media&token=51af91e6-309a-41a4-b099-e2cfdbd76063'
const DJI4 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-4.png?alt=media&token=f36f4370-e7a7-4f27-a294-b5dd2d328dc5'
const DJI5 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-5.png?alt=media&token=9ee3bd14-817d-48f0-adb6-d7a1aa1a6074'
const DJI6 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-6.png?alt=media&token=57e15e18-6f0d-4e5f-b822-f24eca3ea1be'
const DJI7 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-7.png?alt=media&token=b85e87ca-4639-45af-a006-33454fa9bf19'
const DJI8 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-8.png?alt=media&token=466ba883-f0d1-429d-bd9d-bc7f2ef6b5cb'
const DJI9 =
  'https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FDJI-9.png?alt=media&token=860cfe8b-8eb2-4e1c-80e0-c7c98e4a850b'

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4)
  },
  images: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexWrap: 'wrap'
  },
  imageWrapper: {
    position: 'relative',
    display: 'block',
    padding: 0,
    borderRadius: 0,
    height: '40vh',
    [theme.breakpoints.down('sm')]: {
      width: '100% !important',
      height: 100
    },
    '&:hover': {
      zIndex: 1
    },
    '&:hover $imageBackdrop': {
      opacity: 0.15
    },
    '&:hover $imageMarked': {
      opacity: 0
    },
    '&:hover $imageTitle': {
      border: '4px solid currentColor'
    }
  },
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%'
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: theme.palette.common.black,
    opacity: 0.5,
    transition: theme.transitions.create('opacity')
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)} ${theme.spacing(4)} 14px`
  },
  imageMarked: {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity')
  }
})

function ProductCategories (props) {
  // const { classes } = props;
  const classes = styles(theme)
  const navigate = useRouter()

  const handleImageClick = () => {
    navigate.push('/tienda/')
  }

  const images = [
    {
      url: DJI1,
      title: 'Deportivo',
      width: '40%'
    },
    {
      url: DJI2,
      title: 'Publicidad',
      width: '20%'
    },
    {
      url: DJI3,
      title: 'Excursión',
      width: '40%'
    },
    {
      url: DJI4,
      title: 'Turismo',
      width: '38%'
    },
    {
      url: DJI5,
      title: 'Inventario',
      width: '38%'
    },
    {
      url: DJI6,
      title: 'Vigilancia',
      width: '24%'
    },
    {
      url: DJI7,
      title: 'Eventos',
      width: '40%'
    },
    {
      url: DJI8,
      title: 'Agricultura',
      width: '20%'
    },
    {
      url: DJI9,
      title: 'Mapeo',
      width: '40%'
    }
  ]

  return (
    <Container sx={classes.root} component="section">
      <Typography variant="h4" marked="center" align="center" component="h2">
        Para todas las tareas y todas las edades
      </Typography>
      <Box sx={classes.images}>
        {images.map((image) => (
          <ButtonBase
            onClick={handleImageClick}
            key={image.title}
            sx={classes.imageWrapper}
            style={{
              width: image.width
            }}
          >
            <Link href="/tienda/">
              <Box
                sx={classes.imageSrc}
                style={{
                  backgroundImage: `url(${image.url})`
                }}
              />
              <Box sx={classes.imageBackdrop} />
              <Box sx={classes.imageButton}>
                <Typography
                  component="h3"
                  variant="h6"
                  color="inherit"
                  sx={classes.imageTitle}
                >
                  {image.title}
                  <Box sx={classes.imageMarked} />
                </Typography>
              </Box>
            </Link>
          </ButtonBase>
        ))}
      </Box>
    </Container>
  )
}

ProductCategories.propTypes = {
  // classes: PropTypes.object.isRequired,
}

export default withRoot(ProductCategories)
