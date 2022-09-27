import withRoot from "../modules/withRoot";
// --- Post bootstrap -----
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "sessionstorage-polyfill";
import "localstorage-polyfill";
global.sessionstorage;
global.localStorage;
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
import theme from "../modules/theme";
import { styled } from "@mui/material/styles";

const styles = (theme) => ({
  button: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  feedback: {
    paddingTop: theme.spacing(2),
  },
});

const SubForm = styled("form")({
  paddingTop: theme.spacing(6),
});

function SignUp() {
  const classes = styles(theme);

  // const [userSignupInfo, setSignupInfo] = useState({
  //   userEmail: null,
  //   userPassword: null,
  //   userFirstName: null,
  //   userLastName: null,
  // });
  
  const [sent, setSent] = useState(false);

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

  // const readInputs = () => {
  //   setSignupInfo({
  //     ...userSignupInfo,
  //     userEmail: document.getElementById("emailText").value,
  //     userPassword: document.getElementById("passwordText").value,
  //     userFirstName: document.getElementById("firstName").value,
  //     userLastName: document.getElementById("lastName").value,
  //   });
  // };

  const handleSubmit = (e) => {
    console.log("submit", e);
    e.preventDefault();
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
            ¿Ya tienes una cuenta?,
            <NavLink to="/sign-in/" underline="always">
              {" Iniciar sesión aquí"}
            </NavLink>
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
          method="post"
          // render
        >
          {({ handleSubmit2, submitting }) => (
            <SubForm
              onSubmit={handleSubmit2}
              sx={classes.form}
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
                    id="firstName"
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
                    id="lastName"
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
                    <FormFeedback sx={classes.feedback} error>
                      {submitError}
                    </FormFeedback>
                  ) : null
                }
              </FormSpy>
              <FormButton
                sx={classes.button}
                // className="navlink"
                disabled={submitting || sent}
                mounted={!sent}
                type="submit"
                color="secondary"
                fullWidth
                // onClick={handleSubmit}
              >
                {submitting || sent ? "En progreso…" : "Registrarse"}
              </FormButton>
            </SubForm>
          )}
        </Form>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignUp);
