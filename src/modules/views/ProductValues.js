import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import withRoot from "../withRoot";
import theme from "../theme";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "../components/Typography";

import productValues1 from "public/static/themes/productValues1.svg";
import productValues2 from "public/static/themes/productValues2.svg";
import productValues3 from "public/static/themes/productValues3.svg";
import productCurvyLines from "public/static/themes/productCurvyLines.png";

const styles = (theme) => ({
  root: {
    display: "flex",
    overflow: "hidden",
    backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(20),
    display: "flex",
    position: "relative",
    flexDirection: "column",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(0, 5)} !important`,
  },
  image: {
    height: 55,
  },
  title: {
    marginTop: `${theme.spacing(5)} !important`,
    marginBottom: `${theme.spacing(5)} !important`,
    textAlign: "center",
  },
  curvyLines: {
    pointerEvents: "none",
    position: "absolute",
    top: -180,
  },
});

function ProductValues(props) {
  // const { classes } = props;
  const classes = styles(theme);

  return (
    <Box sx={classes.root}>
      <Container sx={classes.container}>
        <Image
          src={productCurvyLines}
          sx={classes.curvyLines}
          alt="curvy lines"
          style={{ position: "absolute" }}
          // width={100}
          // height={100}
          priority
        />
        <Typography
          variant="h4"
          marked="center"
          sx={classes.title}
          component="h2"
        >
          ¿Dónde?
        </Typography>
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={classes.item}>
              <Image
                className={classes.image}
                src={productValues1}
                alt="suitcase"
                width={100}
                height={100}
                priority
              />
              <Typography variant="h6" sx={classes.title}>
                Vuelos de precisión
              </Typography>
              <Typography variant="h5">
                {"Industrias agrícolas, deportivas y trasporte de cargas."}
                {"  Usos competitivos, riego, filmación…."}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={classes.item}>
              <Image
                className={classes.image}
                src={productValues2}
                alt="graph"
                width={100}
                height={100}
                priority
              />
              <Typography variant="h6" sx={classes.title}>
                Mapeo Digital
              </Typography>
              <Typography variant="h5">
                {"Software para mapeo por fotogrametría"}
                {" y modelado digital."}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={classes.item}>
              <Image
                className={classes.image}
                src={productValues3}
                alt="clock"
                width={100}
                height={100}
                priority
              />
              <Typography variant="h6" sx={classes.title}>
                Adquirir Equipos
              </Typography>
              <Typography variant="h5">
                {"Al registrarte tendrás acceso a tarifas especiales "}
                {"y la tecnología más actualizada."}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

ProductValues.propTypes = {
  // classes: PropTypes.object.isRequired,
};

export default withRoot(ProductValues);
