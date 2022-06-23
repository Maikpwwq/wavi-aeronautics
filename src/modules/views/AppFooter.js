import React from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Typography from "../components/Typography";
import TextField from "../components/TextField";
// import appFooterFacebook from "../../../publicAssets/static/themes/appFooterFacebook.png";
// import appFooterTwitter from "../../../publicAssets/static/themes/appFooterTwitter.png";
import appFooterLinkedin from "../../../publicAssets/static/themes/appFooterLinkedin.png";

const appFooterFacebook =
  "https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2Ficonos%2FappFooterFacebook.png?alt=media&token=b54b1ff2-c2b3-4d57-a7fa-c2e0e06d150e";
// const appFooterLinkedin =
("https://firebasestorage.googleapis.com/v0/b/wavi-aeronautics.appspot.com/o/pagina%2Ficonos%2FappFooterLinkedin.png?alt=media&token=d1475fcd-9ae1-4c3c-84f5-ee38d76c2da6");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.primary.dark,
  },
  container: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: "flex",
  },
  iconsWrapper: {
    height: 120,
  },
  icons: {
    display: "flex",
  },
  icon: {
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.warning.main,
    marginRight: theme.spacing(1),
    "&:hover": {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  list: {
    margin: 0,
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  textWhite: {
    color: theme.palette.secondary.light,
  },
  // language: {
  //   marginTop: theme.spacing(1),
  //   width: 150,
  // },
}));

// const LANGUAGES = [
//   {
//     code: 'en-US',
//     name: 'English',
//   },
//   {
//     code: 'fr-FR',
//     name: 'Français',
//   },
// ];

export default function AppFooter() {
  const classes = useStyles();

  function Copyright() {
    return (
      <React.Fragment>
        <Link
          href="https://maikpwwq.github.io/wavi-aeronautics/"
          style={{ color: "#fff5f8" }}
        >
          Wavi Aeronautics {"© "}
          {new Date().getFullYear()}
        </Link>
      </React.Fragment>
    );
  }

  return (
    <Typography component="footer" className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={6} md={4}>
            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              className={classes.iconsWrapper}
              spacing={2}
            >
              <Grid item className={classes.icons}>
                <a
                  href="https://www.facebook.com/wavi.aeronautics/"
                  className={classes.icon}
                >
                  <img src={appFooterFacebook} alt="Facebook" />
                </a>
                <a
                  href="https://www.linkedin.com/company/wavi-aeronautics/"
                  className={classes.icon}
                >
                  <img
                    src={appFooterLinkedin}
                    width="28px"
                    height="28px"
                    alt="Linkedin"
                  />
                </a>
              </Grid>
              <Grid item>
                <Copyright />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              className={classes.textWhite}
              variant="h6"
              marked="left"
              gutterBottom
            >
              Legal
            </Typography>
            <ul className={classes.list}>
              <li className={classes.listItem}>
                <NavLink to="/terms/" className={classes.textWhite}>
                  {"Terminos"}
                </NavLink>
              </li>
              <li className={classes.listItem}>
                <NavLink to="/privacy/" className={classes.textWhite}>
                  {"Privacidad"}
                </NavLink>
              </li>
            </ul>
          </Grid>
          {/* <Grid item xs={6} sm={8} md={4}>
            <Typography variant="h6" marked="left" gutterBottom>
              Lenguaje
            </Typography>
            <TextField
              select
              SelectProps={{
                native: true,
              }}
              className={classes.language}
            >
              {LANGUAGES.map((language) => (
                <option value={language.code} key={language.code}>
                  {language.name}
                </option>
              ))}
            </TextField>
          </Grid> */}
          {/* <Grid item>
            <Typography variant="caption">
              {"Icons made by "}
              <Link
                href="https://www.freepik.com"
                rel="sponsored"
                title="Freepik"
              >
                Freepik
              </Link>
              {" from "}
              <Link
                href="https://www.flaticon.com"
                rel="sponsored"
                title="Flaticon"
              >
                www.flaticon.com
              </Link>
              {" is licensed by "}
              <Link
                href="https://creativecommons.org/licenses/by/3.0/"
                title="Creative Commons BY 3.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                CC 3.0 BY
              </Link>
            </Typography>
          </Grid> */}
        </Grid>
      </Container>
    </Typography>
  );
}
