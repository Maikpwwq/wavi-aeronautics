import React from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import withRoot from "../withRoot";
import theme from "../theme";
import Typography from "../components/Typography";
// import producBuoy from "public/static/themes/producBuoy.svg";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const styles = (theme) => ({
  root: {
    display: "flex !important",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: theme.spacing(9),
    paddingBottom: theme.spacing(9),
  },
  button: {
    border: "4px solid currentColor !important",
    borderRadius: 0,
    height: "auto",
    padding: theme.spacing(2, 5),
  },
  link: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
});

const WhatsAppContacto = styled("a")({
  width: 60,
});

function ProductSmokingHero(props) {
  // const { classes } = props;
  const classes = styles(theme);
  const handleChatClick = () => {};

  return (
    <Container sx={classes.root} component="section">
      <Button sx={classes.button}>
        <Typography variant="h4" component="span">
          ¿Tienes preguntas? ¿Buscas ayuda?
        </Typography>
      </Button>
      <Typography variant="subtitle1" sx={classes.link}>
        ¡Escríbenos aquí!
      </Typography>
      <WhatsAppContacto
        href="https://api.whatsapp.com/send?phone=573196138057"
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon
          fontSize="large"
          alt="WhatsAppChat"
          style={{ color: "#4fcc5d" }}
        />
      </WhatsAppContacto>
      {/* <Link href={{  pathname: "https://api.whatsapp.com/send?phone=573196138057" }} target="_blank" /> */}
    </Container>
  );
}

ProductSmokingHero.propTypes = {
  // classes: PropTypes.object.isRequired,
};

export default withRoot(ProductSmokingHero);
