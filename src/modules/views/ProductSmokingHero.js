import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { withStyles } from '@mui/styles';
import Typography from '../components/Typography';
import producBuoy from "../../../public/static/themes/producBuoy.svg";

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(9),
    marginBottom: theme.spacing(9),
  },
  button: {
    border: '4px solid currentColor',
    borderRadius: 0,
    height: 'auto',
    padding: theme.spacing(2, 5),
  },
  link: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  buoy: {
    width: 60,
  },
});

function ProductSmokingHero(props) {
  const { classes } = props;

  return (
    <Container className={classes.root} component="section">
      <Button className={classes.button}>
        <Typography variant="h4" component="span">
          ¿Tienes preguntas? ¿Buscas ayuda?
        </Typography>
      </Button>
      <Typography variant="subtitle1" className={classes.link}>
        Estamos aquí para ayudarte. ¡Ponte en contacto!
      </Typography>
      <img src={producBuoy} className={classes.buoy} alt="buoy" />
    </Container>
  );
}

ProductSmokingHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductSmokingHero);