import withRoot from "../modules/withRoot";
// --- Post bootstrap -----
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { collection, doc, setDoc } from "firebase/firestore";
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
import { auth, firestore } from "../firebase/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";

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

function SignUp() {
  const navigate = useNavigate();
  const classes = useStyles();
  const _firestore = firestore;
  const shoppingsRef = collection(_firestore, "shoppingCart");
  const usersRef = collection(_firestore, "users");
  const [userSignupInfo, setSignupInfo] = React.useState({
    userEmail: null,
    userPassword: null,
    userFirstName: null,
    userLastName: null,
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
      userFirstName: document.getElementById("firstName").value,
      userLastName: document.getElementById("lastName").value,
    });
  };

  const userToFirestore = async (updateInfo, userID) => {
    await setDoc(doc(usersRef, userID), updateInfo, { merge: true });
  };

  const shoppingsToFirestore = async (updateInfo, userRef) => {
    await setDoc(doc(shoppingsRef, userRef), updateInfo, { merge: true });
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
          const displayName =
            userSignupInfo.userFirstName + " " + userSignupInfo.userLastName;
          const data = {
            userMail: user.email,
            userJoined: user.metadata.creationTime,
            userId: user.uid,
            userName: displayName,
          };
          const usedId = user.uid;
          userToFirestore(data, usedId);
          // Instancia un carrito de compras vacio
          shoppingsToFirestore({ productos: [] }, usedId);
          localStorage.setItem("cartID", usedId);
          localStorage.setItem("cartUpdated", "id");
          setSent(true);
          alert("Se ha registrado el usuario", displayName);
          navigate("/tienda-base/");
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
            ¿Ya tienes una cuenta?,
            <Link href="/sign-in/" underline="always">
              <NavLink to="/sign-in/">{" Iniciar sesión aquí"}</NavLink>
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
