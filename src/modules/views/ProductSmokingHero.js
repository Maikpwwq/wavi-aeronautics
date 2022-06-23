import React from "react";
// import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { withStyles } from "@mui/styles";
import Typography from "../components/Typography";
// import producBuoy from "../../../publicAssets/static/themes/producBuoy.svg";
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
  whatsApp: {
    width: 60,
  },
});

function ProductSmokingHero(props) {
  const { classes } = props;

  const handleChatClick = () => {};

  return (
    <Container className={classes.root} component="section">
      <Button className={classes.button}>
        <Typography variant="h4" component="span">
          ¿Tienes preguntas? ¿Buscas ayuda?
        </Typography>
      </Button>
      <Typography variant="subtitle1" className={classes.link}>
      ¡Escríbenos aquí!
      </Typography>
      <a
        href="https://api.whatsapp.com/send?phone=573196138057"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.whatsApp}
      >
        <WhatsAppIcon fontSize="large" alt="WhatsAppChat" style={{ color: "#4fcc5d"}}/>
      </a>
      {/* <Link to={{  pathname: "https://api.whatsapp.com/send?phone=573196138057" }} target="_blank" /> */}
    </Container>
  );
}

ProductSmokingHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductSmokingHero);
