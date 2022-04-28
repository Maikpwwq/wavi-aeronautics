import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Button from "../components/Button";
import Typography from "../components/Typography";
import productCurvyLines from "../../../public/static/themes/productCurvyLines.png";
import productHowItWorks1 from "../../../public/static/themes/productHowItWorks1.svg";
import productHowItWorks2 from "../../../public/static/themes/productHowItWorks2.svg";
import productHowItWorks3 from "../../../public/static/themes/productHowItWorks3.svg";

const styles = (theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.secondary.light,
    overflow: "hidden",
  },
  container: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(15),
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(0, 5),
  },
  title: {
    paddingBottom: theme.spacing(8),
  },
  number: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
  image: {
    height: 55,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  curvyLines: {
    pointerEvents: "none",
    position: "absolute",
    top: -180,
    opacity: 0.7,
  },
  beneficios: {
    marginBottom: `${theme.spacing(8)} !important`,
  },
  button: {
    
  }
});

function ProductHowItWorks(props) {
  const { classes } = props;

  return (
    <section className={classes.root}>
      <Container
        className={classes.container}
        style={{ "text-align": "center" }}
      >
        <img
          src={productCurvyLines}
          className={classes.curvyLines}
          alt="curvy lines"
        />
        <Typography
          variant="h4"
          marked="center"
          className={classes.title}
          component="h2"
        >
          Te ofrecemos
        </Typography>
        <div className={classes.beneficios} >
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>1.</div>
                <img
                  src={productHowItWorks1}
                  alt="suitcase"
                  className={classes.image}
                />
                <Typography variant="h5" align="center">
                  {"Actualizaciones de las últimas tendencias del mercado."}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>2.</div>
                <img
                  src={productHowItWorks2}
                  alt="graph"
                  className={classes.image}
                />
                <Typography variant="h5" align="center">
                  {
                    "Mejorar el tiempo que inviertes en realizar tus actividades."
                  }
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>3.</div>
                <img
                  src={productHowItWorks3}
                  alt="clock"
                  className={classes.image}
                />
                <Typography variant="h5" align="center">
                  {
                    "Mantenimiento técnico preventivo y correctivo para tus quipos."
                  }
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
        <Button
          color="secondary"
          size="large"
          variant="contained"
          className={classes.button && "navlink"}
          component="btn"
          // href="/sign-up/"
        >
          <NavLink to="/sign-up/">{"Comenzar"}</NavLink>
        </Button>
      </Container>
    </section>
  );
}

ProductHowItWorks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHowItWorks);
