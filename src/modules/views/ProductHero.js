import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '../components/Button';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';
import MavicAir from '../../../public/static/img/Portada-DJI-Mavic-Air-2.jpg';

const backgroundImage =
  'https://images.unsplash.com/photo-1534854638093-bada1813ca19?auto=format&fit=crop&w=1400&q=80';

const styles = (theme) => ({
  background: {
    backgroundImage: `url(${MavicAir})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
  },
  button: {
    minWidth: 200,
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
    },
  },
  more: {
    marginTop: theme.spacing(2),
  },
});

function ProductHero(props) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background} >
      {/* Increase the network loading priority of the background image. */}
      <img style={{ display: 'none' }} src={backgroundImage} alt="increase priority" />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        Necesitas un Dron
      </Typography>
      <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
        Somos fabricantes y distribuidores de Technología VToL. Solicita alguno de nuestros servicios.
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        size="large"
        className={classes.button, "navlink"}
        component="a"
        // to="/sign-up/"
      >
        <NavLink to="/sign-up/">
          {'Registrarse'}
        </NavLink>          
      </Button>
      <Typography variant="body2" color="inherit" className={classes.more}>
        Disfruta nuestras ofertas
      </Typography>
    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHero);