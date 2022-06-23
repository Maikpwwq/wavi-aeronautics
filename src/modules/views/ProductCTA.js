import React from "react";
import { firestore } from "../../firebase/firebaseClient";
import { collection, doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Hidden from "@mui/material/Hidden";
import Container from "@mui/material/Container";
import Typography from "../components/Typography";
import TextField from "../components/TextField";
import Snackbar from "../components/Snackbar";
import Button from "../components/Button";

import productCTAImageDots from "../../../publicAssets/static/themes/productCTAImageDots.png";
// import PostalOfertas from "../../../publicAssets/static/img/Toma-Aerea-Ciudad.png";

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(10),
    marginBottom: 0,
    display: "flex",
  },
  cardWrapper: {
    zIndex: 1,
  },
  card: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: theme.palette.warning.main,
    padding: theme.spacing(8, 3),
  },
  cardContent: {
    maxWidth: 400,
  },
  textField: {
    width: "100%",
    margin: `${theme.spacing(3)} 0 ${theme.spacing(2)} 0 !important`,
    backgroundColor: theme.palette.common.white,
  },
  button: { 
    width: "100%",
    margin: `${theme.spacing(1, 0)} !important`,
    padding: `${theme.spacing(2, 0)} !important`,
  },
  imagesWrapper: {
    position: "relative",
  },
  imageDots: {
    position: "absolute",
    top: -67,
    left: -67,
    right: 0,
    bottom: 0,
    width: "100%",
    background: `url(${productCTAImageDots})`,
  },
  image: {
    position: "absolute",
    top: -28,
    left: -28,
    right: 0,
    bottom: 0,
    width: "100%",
    maxWidth: 600,
  },
});

function ProductCTA(props) {
  const { classes } = props;
  const _firestore = firestore;
  const suscribeRef = collection(_firestore, "suscritos");
  const [open, setOpen] = React.useState(false);
  const [suscribeMail, setSuscribeMail] = React.useState(null);

  const userSuscribe = async (updateInfo, userID) => {
    await setDoc(doc(suscribeRef, userID), updateInfo, { merge: true });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setOpen(true);
    const suscriptionId = uuidv4();
    userSuscribe(suscribeMail, suscriptionId);
  };

  const handleClose = () => {
    setOpen(false);

  };

  const PostalOfertas = "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2FToma-Aerea-Ciudad.png?alt=media&token=d16460b1-8e78-4f85-977f-afff44385b09"

  return (
    <Container className={classes.root} component="section">
      <Grid container>
        <Grid item xs={12} md={6} className={classes.cardWrapper}>
          <div className={classes.card}>
            <form onSubmit={handleSubmit} className={classes.cardContent}>
              <Typography variant="h2" component="h2" gutterBottom>
                Recibe nuestras ofertas
              </Typography>
              <Typography variant="h5">
                Descubre nuestras actualizaciones primero.
              </Typography>
              <TextField
                noBorder
                className={classes.textField}
                placeholder="Tu email"
                onChange={(e) => setSuscribeMail({ correo: e.target.value })}
              />
              <Button
                type="submit"
                color="primary"
                variant="contained"
                className={classes.button}
              >
                Suscribirme!
              </Button>
            </form>
          </div>
        </Grid>
        <Grid item xs={12} md={6} className={classes.imagesWrapper}>
          <Hidden smDown>
            <div className={classes.imageDots} />
            <img
              src={PostalOfertas}
              alt="Tomas aéreas rápidas y confiables"
              className={classes.image}
            />
          </Hidden>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        onClose={handleClose}
        message="Te enviaremos nuestras mejores ofertas, una vez por mes."
      />
    </Container>
  );
}

ProductCTA.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductCTA);
