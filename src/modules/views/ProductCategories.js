import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Container from '@material-ui/core/Container';
import Typography from '../components/Typography';

import DJI1 from '../../../public/static/img/DJI-1.jpg';
import DJI2 from '../../../public/static/img/DJI-2.jpg';
import DJI3 from '../../../public/static/img/DJI-3.jpg';
import DJI4 from '../../../public/static/img/DJI-4.jpg';
import DJI5 from '../../../public/static/img/DJI-5.jpg';
import DJI6 from '../../../public/static/img/DJI-6.jpg';
import DJI7 from '../../../public/static/img/DJI-7.jpg';
import DJI8 from '../../../public/static/img/DJI-8.jpg';
import DJI9 from '../../../public/static/img/DJI-9.jpg';

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(4),
  },
  images: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexWrap: 'wrap',
  },
  imageWrapper: {
    position: 'relative',
    display: 'block',
    padding: 0,
    borderRadius: 0,
    height: '40vh',
    [theme.breakpoints.down('sm')]: {
      width: '100% !important',
      height: 100,
    },
    '&:hover': {
      zIndex: 1,
    },
    '&:hover $imageBackdrop': {
      opacity: 0.15,
    },
    '&:hover $imageMarked': {
      opacity: 0,
    },
    '&:hover $imageTitle': {
      border: '4px solid currentColor',
    },
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
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    background: theme.palette.common.black,
    opacity: 0.5,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px 14px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
});

function ProductCategories(props) {
  const { classes } = props;

  const images = [
    {
      url: DJI1,
      title: 'Deportivo',
      width: '40%',
    },
    {
      url: DJI2,
      title: 'Publicidad',
      width: '20%',
    },
    {
      url: DJI3,
      title: 'Excursión',
      width: '40%',
    },
    {
      url: DJI4,
      title: 'Turismo',
      width: '38%',
    },
    {
      url: DJI5,
      title: 'Inventario',
      width: '38%',
    },
    {
      url: DJI6,
      title: 'Vigilancia',
      width: '24%',
    },
    {
      url: DJI7,
      title: 'Eventos',
      width: '40%',
    },
    {
      url: DJI8,
      title: 'Agricultura',
      width: '20%',
    },
    {
      url: DJI9,
      title: 'Mapeo',
      width: '40%',
    },
  ];

  return (
    <Container className={classes.root} component="section">
      <Typography variant="h4" marked="center" align="center" component="h2">
        Para todas las tareas y todas las edades
      </Typography>
      <div className={classes.images}>
        {images.map((image) => (
          <ButtonBase
            key={image.title}
            className={classes.imageWrapper}
            style={{
              width: image.width,
            }} 
          >
            <div
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${image.url})`,
              }}
            />
            <div className={classes.imageBackdrop} />
            <div className={classes.imageButton}>
              <Typography
                component="h3"
                variant="h6"
                color="inherit"
                className={classes.imageTitle}
              >
                {image.title}
                <div className={classes.imageMarked} />
              </Typography>
            </div>
          </ButtonBase>
        ))}
      </div>
    </Container>
  );
}

ProductCategories.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductCategories);