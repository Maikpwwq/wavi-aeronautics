"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, Form, FormSpy } from "react-final-form";
import Typography from "@/modules/components/Typography";
import AppFooter from "@/modules/views/AppFooter";
import AppAppBar from "@/modules/views/AppAppBar";
import AppForm from "@/modules/views/AppForm";
import { email, required } from "@/modules/form/validation";
import RFTextField from "@/modules/form/RFTextField";
import FormButton from "@/modules/form/FormButton";
import FormFeedback from "@/modules/form/FormFeedback";

import withRoot from "@/modules/withRoot";
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
  link: {
    fontSize: "21px",
    textDecoration: "none",
    color: "black !important",
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
const SignInForm = () => {
  const classes = styles(theme);
  const router = useRouter();

  const [sent, setSent] = useState(false);
  const [event, setEvent] = useState({ email: "", password: "" });
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

  const fetchSignIn = async (event) => {
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // throw new Error('Error al cargar los comentarios')
    const response = await fetch(`http://localhost:3000/api/sign-in`, {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify(event),
      next: { revalidate: 60 },
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Custom Error message");
      }
      // if (res.redirected) {
      //   window.location.href = response.url;
      // }
      res.json();
      router.push("/tienda/drones");
    });
    return response;
    // .then((data) => console.log("fetch", data));
  };

  const handleSubmit = (e) => {
    // e.preventDefault();
    console.log("submit", e);
  };

  const onSubmit = async (e) => {
    // e.preventDefault();
    console.log("submit", e);
    setEvent({ email: e.email, password: e.password });
    await fetchSignIn(e).then((res) => {
      console.log("submit", res, event, signIn);
      router.push("/tienda/drones");
    });
  };

  const handleChange = (event) => {
    console.log("handleChange", event.target.value);
    setEvent({ value: event.target.value });
  };

  return (
    <Form
      onSubmit={onSubmit}
      subscription={{ submitting: true }}
      validate={validate}
      method="post"
    >
      {({ handleSubmit, submitting }) => (
        <SubForm
          onSubmit={handleSubmit}
          sx={classes.form}
          noValidate
          method="post"
        >
          <Field
            // onChange={() => handleChange}
            // value={event.value}
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
            // onChange={() => handleChange}
            // value={event.value}
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
            value="Submit"
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
  );
};

function SignIn(props) {
  //const { classes } = props;
  const classes = styles(theme);

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
            <LinkTo
              className={classes.link}
              href="auth/sign-up/"
              underline="always"
            >
              {"Registrarse"}
            </LinkTo>
          </Typography>
        </React.Fragment>
        <SignInForm />
        <Typography align="center">
          <LinkTo className="mt-2" href="auth/forgot-password/">
            {"Recordar password"}
          </LinkTo>
        </Typography>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignIn);
