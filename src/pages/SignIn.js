import withRoot from "../modules/withRoot";
// --- Post bootstrap -----
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Field, Form, FormSpy } from "react-final-form";
import { makeStyles } from "@mui/styles";
import Link from "@mui/material/Link";
import Typography from "../modules/components/Typography";
import AppFooter from "../modules/views/AppFooter";
import AppAppBar from "../modules/views/AppAppBar";
import AppForm from "../modules/views/AppForm";
import { email, required } from "../modules/form/validation";
import RFTextField from "../modules/form/RFTextField";
import FormButton from "../modules/form/FormButton";
import FormFeedback from "../modules/form/FormFeedback";
import { auth } from "../firebase/firebaseClient";
import { EmailAuthProvider, signInWithCredential } from "firebase/auth";

const useStyles = makeStyles((theme) => ({
  form: {
    paddingTop: theme.spacing(6),
  },
  button: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  feedback: {
    paddingTop: theme.spacing(2),
  },
}));

function SignIn() {
  const navigate = useNavigate();
  const classes = useStyles();

  // const { user, loading, error, signInWithProvider } = useFirebaseAuth();

  const [sent, setSent] = React.useState(false);
  const [userSigninInfo, setSigninInfo] = React.useState({
    userEmail: null,
    userPassword: null,
  });

  const validate = (values) => {
    const errors = required(["email", "password"], values);

    if (!errors.email) {
      const emailError = email(values.email, values);
      if (emailError) {
        errors.email = email(values.email, values);
      }
    }

    return errors;
  };

  const readInputs = () => {
    setSigninInfo({
      ...userSigninInfo,
      userEmail: document.getElementById("emailText").value,
      userPassword: document.getElementById("passwordText").value,
    });
    console.log(userSigninInfo.userEmail, userSigninInfo.userPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    readInputs();
    readInputs();
    if (
      (userSigninInfo.userEmail !== null, userSigninInfo.userPassword !== null)
    ) {
      let credential = EmailAuthProvider.credential(
        userSigninInfo.userEmail,
        userSigninInfo.userPassword
      );
      signInWithCredential(auth, credential)
        // Auth.updateCurrentUser.linkWithCredential(credential)
        .then((usercred) => {
          // Al iniciar sesion almacena una instancia del usuario
          var user = usercred.user;
          setSent(true);
          alert("Se ha iniciado una nueva sesión");
          navigate("/paper-base/");
        })
        .catch((err) => {
          // Manejar los Errores aqui.
          console.log("Error upgrading anonymous account", err);
          // console.log(user, loading, error, signInWithProvider)
          var errorCode = err.code;
          var errorMessage = err.message;
          if (errorCode === "auth/wrong-password") {
            alert("Wrong password.");
          } else {
            alert(errorMessage);
          }
        });
    }
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            {"Iniciar sesión"}
          </Typography>
          <Typography variant="body2" align="center">
            {"¿No eres miembro aun? "}
            <Link href="/sign-up/" align="center" underline="always">
              <NavLink to="/sign-up/">{"Registrarse"}</NavLink>
            </Link>
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit2, submitting }) => (
            <form onSubmit={handleSubmit2} className={classes.form} noValidate>
              <Field
                autoComplete="email"
                autoFocus
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                id="emailText"
                label="Email"
                name="email"
                type="email"
                margin="normal"
                required
                size="large"
              />
              <Field
                fullWidth
                size="large"
                component={RFTextField}
                disabled={submitting || sent}
                required
                id="passwordText"
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                margin="normal"
              />
              <FormSpy subscription={{ submitError: true }}>
                {({ submitError }) =>
                  submitError ? (
                    <FormFeedback className={classes.feedback} error>
                      {submitError}
                    </FormFeedback>
                  ) : null
                }
              </FormSpy>
              <FormButton
                className={(classes.button, "navlink")}
                disabled={submitting || sent}
                size="large"
                type="submit"
                color="secondary"
                onClick={handleSubmit}
                fullWidth
              >
                {submitting || sent ? "En progreso…" : "Iniciar sesión"}
              </FormButton>
            </form>
          )}
        </Form>
        <Typography align="center">
          <Link underline="always" href="/forgot-password/">
            <NavLink to="/forgot-password/">{"Recordar password"}</NavLink>
          </Link>
        </Typography>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignIn);
