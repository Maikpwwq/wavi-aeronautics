import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { CardActionArea } from "@mui/material";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import Typography from "../../components/Typography";
import { autoPlay } from "react-swipeable-views-utils";
import withRoot from "../../withRoot";
import theme from "../innerTheme";
import { styled } from "@mui/material/styles";

const styles = (theme) => ({
  onSmallCol: {
    display: "flex",
    flexDirection: "row",
    margin: `${theme.spacing(2)} ${theme.spacing(0)}`,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column !important",
    },
  },
  infoProduct: {
    marginLeft: `${theme.spacing(2)}`,
  },
  detailProduct: {
    margin: `${theme.spacing(2)} ${theme.spacing(2)}`,
  },
  moreImgs: {
    flexWrap: "wrap !important",
    display: "flex !important",
    margin: `${theme.spacing(2)} ${theme.spacing(2)}`,
  },
});

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const ProductDetail = (props) => {
  const theme = useTheme();
  const classes = styles(theme);
  // const { classes } = props;
  const { state } = useLocation();
  const { product } = state || {};
  console.log("state", state);
  // const { product } = props;
  const { titulo, precio, descripcion, especificaciones, incluye, imagenes } =
    product ? product : "";
  const maxSteps = imagenes? imagenes.length : 0;

  const [activeStep, setActiveStep] = useState(0);
  const [productInfo, setProductInfo] = useState({
    titulo: titulo || "",
    precio: precio || "",
    descripcion: descripcion || "",
    especificaciones: especificaciones || "",
    incluye: incluye || "",
    imagenes: imagenes || [],
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <>
      <Container fixed>
        <Box sx={{ pt: 8, pb: 6 }}>
          <Card>
            {/* maxWidth="lg" <CardActionArea>
          </CardActionArea> */}
            <CardHeader
              title={productInfo.titulo}
              subheader={productInfo.precio}
              sx={classes.detailProduct}
            ></CardHeader>
            <CardContent>
              <Box sx={classes.onSmallCol}>
                <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
                  <AutoPlaySwipeableViews
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                  >
                    {productInfo.imagenes.map((image) => (
                      <Box
                        component="img"
                        src={image}
                        alt={productInfo.titulo}
                        sx={{
                          height: 400,
                          display: "block",
                          maxWidth: 400,
                          overflow: "hidden",
                          width: "100%",
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
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                      >
                        Siguiente
                        {theme.direction === "rtl" ? (
                          <KeyboardArrowLeft />
                        ) : (
                          <KeyboardArrowRight />
                        )}
                      </Button>
                    }
                    backButton={
                      <Button
                        size="small"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                      >
                        {theme.direction === "rtl" ? (
                          <KeyboardArrowRight />
                        ) : (
                          <KeyboardArrowLeft />
                        )}
                        Anterior
                      </Button>
                    }
                  />
                </Box>
                <Box sx={classes.infoProduct}>
                  <Typography variant="h5">Descripción: </Typography>
                  <Typography variant="body1">{productInfo.descripcion}</Typography>
                </Box>
              </Box>
              <Box sx={classes.detailProduct}>
                <Typography variant="h5">Especificaciones: </Typography>
                <Typography variant="body1">{productInfo.especificaciones}</Typography>
                <br />
                <Typography variant="h5">Incluye: </Typography>
                <Typography variant="body1">{productInfo.incluye}</Typography>
              </Box>
            </CardContent>
            <CardMedia component="div" sx={classes.moreImgs}>
              {productInfo.imagenes.map((image) => (
                <Box
                  component="img"
                  src={image}
                  alt={productInfo.titulo}
                  sx={{
                    height: 330,
                    display: "block",
                    maxWidth: 330,
                    overflow: "hidden",
                    width: "100%",
                  }}
                ></Box>
              ))}
            </CardMedia>
          </Card>
        </Box>
      </Container>
    </>
  );
};

ProductDetail.propTypes = {
  // product: PropTypes.object.isRequired,
};

export default withRoot(ProductDetail);
