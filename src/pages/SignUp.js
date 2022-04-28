import withRoot from "../modules/withRoot";
// --- Post bootstrap -----
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { Field, Form, FormSpy } from "react-final-form";
import Typography from "../modules/components/Typography";
import AppFooter from "../modules/views/AppFooter";
import AppAppBar from "../modules/views/AppAppBar";
import AppForm from "../modules/views/AppForm";
import { email, required } from "../modules/form/validation";
import RFTextField from "../modules/form/RFTextField";
import FormButton from "../modules/form/FormButton";
import FormFeedback from "../modules/form/FormFeedback";
import { auth } from "../firebase/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(6),
  },
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  feedback: {
    marginTop: theme.spacing(2),
  },
}));

function SignUp() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [userSignupInfo, setSignupInfo] = React.useState({
    userEmail: null,
    userPassword: null,
  });
  const [sent, setSent] = React.useState(false);

  const validate = (values) => {
    const errors = required(
      ["firstName", "lastName", "email", "password"],
      values
    );

    if (!errors.email) {
      const emailError = email(values.email, values);
      if (emailError) {
        errors.email = email(values.email, values);
      }
    }

    return errors;
  };

  const readInputs = () => {
    setSignupInfo({
      ...userSignupInfo,
      userEmail: document.getElementById("emailText").value,
      userPassword: document.getElementById("passwordText").value,
    });
    console.log(userSignupInfo.userEmail, userSignupInfo.userPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    readInputs();
    readInputs();
    if (
      (userSignupInfo.userEmail !== null, userSignupInfo.userPassword !== null)
    ) {
      createUserWithEmailAndPassword(
        auth,
        userSignupInfo.userEmail,
        userSignupInfo.userPassword
      )
        .then((userCredential) => {
          var user = userCredential.user;
          console.log("Anonymous account successfully upgraded", user);
          const data = {
            userMail: user.email,
            userJoined: user.metadata.creationTime,
            userId: user.uid,
            // userName: user.displayName,
          };
          setSent(true);
          navigate('/paper-base/')
        })
        .catch((err) => {
          console.log("Error upgrading anonymous account", err);
          console.log(err.code);
          // var errorCode = err.code;
          var errorMessage = err.message;
          alert(errorMessage);
        });
    }
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Registrarse
          </Typography>
          <Typography variant="body2" align="center">
            <Link href="/sign-in/" underline="always">
              <NavLink to="/sign-in/">{"¿Ya tienes una cuenta?"}</NavLink>
            </Link>
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
          // render
        >
          {({ handleSubmit2, submitting }) => (
            <form
              onSubmit={handleSubmit2}
              className={classes.form}
              method="post"
              noValidate
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    autoFocus
                    component={RFTextField}
                    autoComplete="fname"
                    fullWidth
                    label="Nombres"
                    name="firstName"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    component={RFTextField}
                    autoComplete="lname"
                    fullWidth
                    label="Apellidos"
                    name="lastName"
                    required
                  />
                </Grid>
              </Grid>
              <Field
                autoComplete="email"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                id="emailText"
                label="Email"
                name="email"
                type="email"
                margin="normal"
                required
              />
              <Field
                fullWidth
                component={RFTextField}
                disabled={submitting || sent}
                required
                autoComplete="current-password"
                id="passwordText"
                label="Password"
                name="password"
                type="password"
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
                className={classes.button && "navlink"}
                disabled={submitting || sent}
                type="submit"
                color="secondary"
                fullWidth
                onClick={handleSubmit}
              >
                {submitting || sent ? "En progreso…" : "Registrarse"}
              </FormButton>
            </form>
          )}
        </Form>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignUp);
