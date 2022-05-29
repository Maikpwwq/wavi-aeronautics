import React from "react";
import { useLocation } from "react-router-dom";
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
import { withStyles } from "@mui/styles";

const styles = (theme) => ({
  onSmallCol: {
    margin: `${theme.spacing(2)} ${theme.spacing(4)}`,
    [theme.breakpoints.down("md")]: {
      flexDirection: "column !important",
    },
  },
  infoProduct: {
    marginLeft: `${theme.spacing(4)}`,
  },
  detailProduct: {
    margin: `${theme.spacing(2)} ${theme.spacing(4)}`,
  },
  moreImgs: {
    flexWrap: "wrap !important",
    display: "flex !important",
    margin: `${theme.spacing(2)} ${theme.spacing(4)}`,
  },
});

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const ProductDetail = (props) => {
  const { state } = useLocation() || {};
  const { product } = state || "";
  const { classes } = props;
  const theme = useTheme();
  const { titulo, precio, descripcion, especificaciones, incluye, imagenes } =
    product;
  const maxSteps = imagenes.length;
  const [activeStep, setActiveStep] = React.useState(0);

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
              title={titulo}
              subheader={precio}
              className={classes.detailProduct}
            ></CardHeader>
            <CardContent>
              <Box
                className={classes.onSmallCol}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
                  <AutoPlaySwipeableViews
                    axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                  >
                    {imagenes.map((image) => (
                      <Box
                        component="img"
                        src={image}
                        alt={titulo}
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
                <Box className={classes.infoProduct}>
                  <Typography variant="h3">Descripción: </Typography>
                  <Typography variant="body1">{descripcion}</Typography>
                </Box>
              </Box>
              <Box className={classes.detailProduct}>
                <Typography variant="h3">Especificaciones: </Typography>
                <Typography variant="body1">{especificaciones}</Typography>
                <br />
                <Typography variant="h3">Incluye: </Typography>
                <Typography variant="body1">{incluye}</Typography>
              </Box>
            </CardContent>
            <CardMedia component="div" className={classes.moreImgs}>
              {imagenes.map((image) => (
                <Box
                  component="img"
                  src={image}
                  alt={titulo}
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

export default withStyles(styles)(ProductDetail);
