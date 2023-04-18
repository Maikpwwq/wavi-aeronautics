"use client";
import withRoot from "@/modules/withRoot";
// --- Post bootstrap -----
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SnackBarAlert from "@/app/components/SnackBarAlert";
// import "sessionstorage-polyfill";
// import "localstorage-polyfill";
// global.sessionstorage;
// global.localStorage;
import Grid from "@mui/material/Grid";
import { Field, Form, FormSpy } from "react-final-form";
import Typography from "@/modules/components/Typography";
import AppFooter from "@/modules/views/AppFooter";
import AppAppBar from "@/modules/views/AppAppBar";
import AppForm from "@/modules/views/AppForm";
import { email, required } from "@/modules/form/validation";
import RFTextField from "@/modules/form/RFTextField";
import FormButton from "@/modules/form/FormButton";
import FormFeedback from "@/modules/form/FormFeedback";
import theme from "@/modules/theme";
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

const LinkTo = styled(Link)({
  fontSize: "15px",
  textDecoration: "none !important",
  color: "black !important",
});

const fetchSignUp = async (event) => {
  const response = await fetch(`http://localhost:3000/api/sign-up`, {
    method: "POST",
    body: JSON.stringify(event),
    next: { revalidate: 60 },
  }).then((res) => {
    if (!res.ok) {
      // throw new Error("Custom Error message", res);
      console.log("Custom Error message", res);
    }
    return res.json();
  });
  return response;
};

const SignUpForm = () => {
  const classes = styles(theme);
  const router = useRouter();

  const [signupInfo, setSignupInfo] = useState({
    userEmail: null,
    userPassword: null,
    userFirstName: null,
    userLastName: null,
  });

  const [sent, setSent] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleAlert = (message, severity) => {
    setAlert({ ...alert, open: true, message, severity });
  };

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

  const onSubmit = async (e) => {
    // e.preventDefault();
    // console.log("submit", e);
    handleChange(e);
    // const signIn =
    await fetchSignUp(e).then((res) => {
      const { userID, errorCode, errorMessage } = res;
      // console.log("submit userID", res, userID);
      if (typeof window !== "undefined" && !!userID) {
        // Perform localStorage action
        setSent(true);
        handleAlert("Se ha registrado un nuevo usuario de forma exitosa.", "success");
        sessionStorage.setItem("cartID", usedId);
        sessionStorage.setItem("cartUpdated", "new id");
        console.log("shoppingCartID", userID);
        router.push("/tienda/drones");
      }
      if (!!errorCode && !!errorMessage) {
        setSent(false);
        if (
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/user-not-found"
        ) {
          handleAlert("Estas credenciales son incorrectas.", "error");
        } 
        else if (errorCode === "auth/weak-password") {
          handleAlert("Password muy debil.", "error");
        }
        else if (errorCode === "auth/missing-email") {
          handleAlert("Falta un correo.", "error");
        } else {
          console.log("errorCode", errorCode);
          handleAlert("Ha sucedido un error intente de nuevo.", "error");
        }
      }
    });
    console.log("submit", event, signIn);
  };

  const handleChange = (e) => {
    setSignupInfo({
      userEmail: e.email,
      userPassword: e.password,
      userFirstName: e.firstName,
      userLastName: e.lastName,
    });
  };

  const handleClose = (event, reason) => {
    // console.log(reason, event)
    if (reason === "clickaway") {
      return;
    } else {
      setAlert({ ...alert, open: false, message: "" });
    }
  };

  const handleSubmit = (e) => {
    console.log("submit", e);
    e.preventDefault();
  };

  return (
    <>
      {alert.open && (
        <SnackBarAlert
          message={alert.message}
          onClose={handleClose}
          severity={alert.severity} // success, error, warning, info, default
          open={alert.open}
        />
      )}

      <Form
        onSubmit={onSubmit}
        subscription={{ submitting: true }}
        validate={validate}
        method="post"
        // render
      >
        {({ handleSubmit, submitting }) => (
          <SubForm
            onSubmit={handleSubmit}
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
    </>
  );
};

function SignUp() {
  const classes = styles(theme);

  // const readInputs = () => {
  //   setSignupInfo({
  //     ...userSignupInfo,
  //     userEmail: document.getElementById("emailText").value,
  //     userPassword: document.getElementById("passwordText").value,
  //     userFirstName: document.getElementById("firstName").value,
  //     userLastName: document.getElementById("lastName").value,
  //   });
  // };

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
            <LinkTo href="auth/sign-in/" underline="always">
              {" Iniciar sesión aquí"}
            </LinkTo>
          </Typography>
        </React.Fragment>
        <SignUpForm />
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignUp);
