// --- Post bootstrap -----
import React from "react";
import { NavLink } from "react-router-dom";
import { Field, Form, FormSpy } from "react-final-form";
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
});

const SubForm = styled("form")({
  paddingTop: theme.spacing(6),
});

function ForgotPassword(props) {
  // const { classes } = props;
  const classes = styles(theme);
  const [sent, setSent] = React.useState(false);

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

  const handleSubmit = () => {
    setSent(true);
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            {"¿Olvido su contraseña?"}
          </Typography>
          <Typography variant="body2" align="center">
            {
              "Ingrese su dirección de email a continuación y le enviaremos un enlace de restablecimiento para recuperar su contraseña."
            }
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit2, submitting }) => (
            <SubForm onSubmit={handleSubmit2} sx={classes.form} noValidate>
              <Field
                autoFocus
                autoComplete="email"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                required
                size="large"
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
                className="navlink"
                sx={classes.button}
                disabled={submitting || sent}
                size="large"
                color="secondary"
                fullWidth
              >
                <NavLink to="/">
                  {submitting || sent ? "En progreso…" : "Enviar enlace"}
                </NavLink>
              </FormButton>
            </SubForm>
          )}
        </Form>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(ForgotPassword);
