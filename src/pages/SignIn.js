import withRoot from '../modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Field, Form, FormSpy } from 'react-final-form';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '../modules/components/Typography';
import AppFooter from '../modules/views/AppFooter';
import AppAppBar from '../modules/views/AppAppBar';
import AppForm from '../modules/views/AppForm';
import { email, required } from '../modules/form/validation';
import RFTextField from '../modules/form/RFTextField';
import FormButton from '../modules/form/FormButton';
import FormFeedback from '../modules/form/FormFeedback';
// import { getApp } from "firebase/app";
import { EmailAuthProvider, signInWithCredential } from "firebase/auth" // getAuth
// import { useFirebaseAuth } from "use-firebase-auth"
// const auth = getAuth();
// const app = getApp();

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

function SignIn() {
  const classes = useStyles();

  // const { user, loading, error, signInWithProvider } = useFirebaseAuth();

  const [sent, setSent] = React.useState(false);
  const [userEmail, setEmail] = React.useState('');
  const [userPassword, setPassword] = React.useState('');

  const validate = (values) => {
    const errors = required(['email', 'password'], values);

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
    setEmail(document.getElementByID('emailText').value);
    setPassword(document.getElementByID('passwordText').value); 
    // auth.signInWithEmailAndPassword   
    let credential = EmailAuthProvider.credential(
      userEmail, userPassword
    );
    signInWithCredential(credential)
    // Auth.updateCurrentUser.linkWithCredential(credential)
    .then((usercred) => {
      // Al iniciar sesion almacena una instancia del usuario
      var user = usercred.user;
      console.log("Anonymous account successfully upgraded", user);
      // console.log("Firebase App", app);
    }).catch((err) => {
      // Manejar los Errores aqui.
      console.log("Error upgrading anonymous account", err);
      // console.log(user, loading, error, signInWithProvider)
      var errorCode = err.code;
      var errorMessage = err.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }      
    });  
  };

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            {'Iniciar sesión'}
          </Typography>
          <Typography variant="body2" align="center">
            {'¿No eres miembro aun? '}
            <Link href="/sign-up/" align="center" underline="always">
              <NavLink to="/sign-up/">
                {'Iniciar sesión aquí'}
              </NavLink>                
            </Link>
          </Typography>
        </React.Fragment>
        <Form onSubmit={handleSubmit} subscription={{ submitting: true }} validate={validate}>
          {({ handleSubmit2, submitting }) => (
            <form onSubmit={handleSubmit2} className={classes.form} noValidate>
              <Field
                autoComplete="email"
                autoFocus
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                id="emailText"
                required
                size="large"
              />
              <Field
                fullWidth
                size="large"
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="password"
                id="passwordText"
                autoComplete="current-password"
                label="Password"
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
                className={classes.button, "navlink"}
                disabled={submitting || sent}
                size="large"
                color="secondary"
                fullWidth
              >
                <NavLink to="/paper-base/">
                  {submitting || sent ? 'En progreso…' : 'Iniciar sesión'}
                </NavLink>                
              </FormButton>
            </form>
          )}
        </Form>
        <Typography align="center">
          <Link underline="always" href="/forgot-password/">
            <NavLink to="/forgot-password/">
              {'Recordar password'}
            </NavLink>            
          </Link>
        </Typography>
      </AppForm>
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(SignIn);