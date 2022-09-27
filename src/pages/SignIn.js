// --- Post bootstrap -----
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Field, Form, FormSpy } from "react-final-form";
import Link from "@mui/material/Link";
import Typography from "../modules/components/Typography";
import AppFooter from "../modules/views/AppFooter";
import AppAppBar from "../modules/views/AppAppBar";
import AppForm from "../modules/views/AppForm";
import { email, required } from "../modules/form/validation";
import RFTextField from "../modules/form/RFTextField";
import FormButton from "../modules/form/FormButton";
import FormFeedback from "../modules/form/FormFeedback";

import withRoot from "../modules/withRoot";
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

function SignIn(props) {
  //const { classes } = props;
  const classes = styles(theme);

  const [sent, setSent] = useState(false);
  // const [userSigninInfo, setSigninInfo] = useState({
  //   userEmail: null,
  //   userPassword: null,
  // });

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

  // const readInputs = () => {
  //   setSigninInfo({
  //     ...userSigninInfo,
  //     userEmail: document.getElementById("emailText").value,
  //     userPassword: document.getElementById("passwordText").value,
  //   });
  //   console.log(userSigninInfo.userEmail, userSigninInfo.userPassword);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit", e);
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
            {"¿No eres miembro aun?, "}
            <NavLink to="/sign-up/" underline="always">
              {"Registrarse"}
            </NavLink>
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
          method="post"
        >
          {({ handleSubmit2, submitting }) => (
            <SubForm
              onSubmit={handleSubmit2}
              sx={classes.form}
              noValidate
              method="post"
            >
              <Field
                autoComplete="email"
                autoFocus
                component={RFTextField}
                variant="outlined"
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
                size="large"
                type="submit"
                color="secondary"
                // onClick={refetch}
                // onClick={handleSubmit}
                fullWidth
              >
                {submitting || sent ? "En progreso…" : "Iniciar sesión"}
              </FormButton>
            </SubForm>
          )}
        </Form>
        <Typography align="center">
          <NavLink to="/forgot-password/">{"Recordar password"}</NavLink>
        </Typography>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignIn);
