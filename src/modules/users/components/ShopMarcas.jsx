import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "../../components/Typography";

const Betafpv =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2Fbetafpv_180x.webp?alt=media&token=d7998922-10cd-4fd9-9e92-017ee75383b9";
const Emax =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2Femax_180x.webp?alt=media&token=39acf0cd-f868-484e-8fd5-89f6b0ce4682";
const Ethix =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2Fethix_180x.webp?alt=media&token=e0104ba0-f241-4cde-b239-0fc9460113f6";
const Flywoo =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2Fflywoo_180x.webp?alt=media&token=4e99f533-5fa0-4602-a96e-074a2bde01ea";
const Geprc =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2Fgeprc_logo_180x.webp?alt=media&token=23cdfa1c-0027-4fea-9117-e946f8a4cce8";
const iFlight =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2FiFlight_180x.webp?alt=media&token=100c394c-2b55-4d20-8701-42f7bc7241bf";
const RadioMaster =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2FRadioMaster.webp?alt=media&token=d3b4ad81-7180-4bed-b74c-9d2279276c3c";
const Tbs =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/marcas%2FTBS.webp?alt=media&token=529dc8dd-b142-458c-bb44-e365a75fb4f3";

import productCurvyLines from "../../../../public/static/themes/productCurvyLines.png";

const styles = (theme) => ({
  root: {
    display: "flex",
    backgroundColor: "#eaeff1",
    backgroundImage: `url(${productCurvyLines})`,
    overflow: "hidden",
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(0, 5),
  },
  title: {
    paddingBottom: theme.spacing(6),
  },
  image: {
    marginBottom: theme.spacing(2),
  },
  curvyLines: {
    pointerEvents: "none",
    position: "absolute",
    top: -180,
    opacity: 0.7,
  },
  marcas: {
    marginBottom: `${theme.spacing(4)} !important`,
  },
  logos: {
    paddingLeft: `0 !important`,
    marginTop: theme.spacing(2),
  },
  logosContainer: {
    marginLeft: `24px !important`,
  },
});

function ShopMarcas(props) {
  const { classes } = props;
  const marcas = [
    Betafpv,
    Emax,
    Ethix,
    Flywoo,
    Geprc,
    iFlight,
    RadioMaster,
    Tbs,
  ];

  return ( 
    <section className={classes.root}>
      <Container className={classes.container} style={{ textAlign: "center" }}>
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
          Marcas Destacadas
        </Typography>
        <div className={classes.marcas}>
          <Grid container spacing={3} className={classes.logosContainer}>
            {marcas.map((marca, i) => {
              // console.log(marca);
              return (
                <Grid item sm={3} xs={6} md={2} lg={2} key={i} className={classes.logos}>
                  <Box
                    component="img"
                    src={marca}
                    alt="marcas"
                    className={classes.image}
                    sx={{
                      width: 100,
                      display: "block",
                      maxWidth: 150,
                      overflow: "hidden",
                      // width: "100%",
                    }}
                  ></Box>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </Container>
    </section>
  );
}

ShopMarcas.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShopMarcas);
