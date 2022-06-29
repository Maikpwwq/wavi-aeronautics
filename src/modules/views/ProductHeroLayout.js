import React from "react";
import PropTypes from "prop-types";
// import clsx from "clsx";
import withRoot from "../withRoot";
import theme from "../theme";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import productHeroWonder from "../../../publicAssets/static/themes/productHeroWonder.png";
import productHeroArrowDown from "../../../publicAssets/static/themes/productHeroArrowDown.png";
import Typography from "../components/Typography";

const styles = (theme) => ({
  root: {
    color: theme.palette.common.white,
    position: "relative",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      height: "80vh",
      minHeight: 500,
      maxHeight: 1300,
    },
  },
  container: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(14),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },
  backdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.5,
    zIndex: -1,
  },
  arrowDown: {
    position: "absolute",
    bottom: theme.spacing(4),
    height: 16,
    width: 12,
  },
});

function ProductHeroLayout(props) {
  const { backgroundClassName, children } = props;
  const classes = styles(theme);

  return (
    <Box sx={classes.root}>
      <Container sx={classes.container}>
        <Box
          component="img"
          src={productHeroWonder}
          alt="maravilloso"
          width="147"
          height="80"
        />
        {children}
        <Box sx={classes.backdrop} />
        <Box sx={backgroundClassName} />
        <Box
          component="img"
          sx={classes.arrowDown}
          src={productHeroArrowDown}
          alt="Desliza para ver más"
        />
      </Container>
      {/* <Container>
        <Typography variant="h2" gutterBottom>
          Recibe nuestras ofertas
        </Typography>
        <Typography variant="h3" gutterBottom>
          Recibe nuestras ofertas
        </Typography>
        <Typography variant="h4" gutterBottom>
          Recibe nuestras ofertas
        </Typography>
        <Typography variant="h5" gutterBottom>
          Recibe nuestras ofertas
        </Typography>
        <Typography variant="body2" gutterBottom>
          Recibe nuestras ofertas
        </Typography>
        <Typography variant="body1" gutterBottom>
          Recibe nuestras ofertas
        </Typography>
        <Typography variant="button" gutterBottom>
          Recibe nuestras ofertas
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Recibe nuestras ofertas
        </Typography>
      </Container> */}
    </Box>
  );
}

ProductHeroLayout.propTypes = {
  backgroundClassName: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default withRoot(ProductHeroLayout);
