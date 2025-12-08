'use client'
import React from 'react'
import Link from 'next/link'
import { Field, Form, FormSpy } from 'react-final-form'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'

import SnackBarAlert from '@/app/components/SnackBarAlert'
import { email, required } from '@/modules/form/validation'
import RFTextField from '@/modules/form/RFTextField'
import FormButton from '@/modules/form/FormButton'
import FormFeedback from '@/modules/form/FormFeedback'
import theme from '@/modules/theme'

import AuthLayout from '../components/AuthLayout'
import authService from '@/services/authService'
import useAuthForm from '../hooks/useAuthForm'

const styles = (theme) => ({
  button: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2)
  },
  feedback: {
    paddingTop: theme.spacing(2)
  }
})

const SubForm = styled('form')({
  paddingTop: theme.spacing(6)
})

const LinkTo = styled(Link)({
  fontSize: '15px',
  textDecoration: 'none !important',
  color: 'black !important'
})

const SignUpForm = () => {
  const classes = styles(theme)
  
  const { 
    sent, 
    alert, 
    handleCloseAlert, 
    handleSuccess, 
    handleError 
  } = useAuthForm()

  const validate = (values) => {
    const errors = required(
      ['firstName', 'lastName', 'email', 'password'],
      values
    )

    if (!errors.email) {
      const emailError = email(values.email, values)
      if (emailError) errors.email = emailError
    }
    return errors
  }

  const onSubmit = async (values) => {
      // console.log("submit", values);
      // Map form values to API expected payload if needed
      // const payload = { 
      //   userEmail: values.email, 
      //   userPassword: values.password,
      //   userFirstName: values.firstName, 
      //   userLastName: values.lastName
      // } 
      // Original code just passed 'e' which was the values object
      
      const { userID, errorCode, errorMessage } = await authService.signUp(values)

      if (!!userID) {
          handleSuccess(userID, 'Se ha registrado un nuevo usuario de forma exitosa.')
      } else {
          handleError(errorCode, errorMessage)
      }
  }

  return (
    <>
      {alert.open && (
        <SnackBarAlert
          message={alert.message}
          onClose={handleCloseAlert}
          severity={alert.severity}
          open={alert.open}
        />
      )}

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
            method="post"
            noValidate
          >
            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 6 }}>
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
              <Grid item size={{ xs: 12, sm: 6 }}>
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
                submitError
                  ? (
                  <FormFeedback sx={classes.feedback} error>
                    {submitError}
                  </FormFeedback>
                    )
                  : null
              }
            </FormSpy>
            <FormButton
              sx={classes.button}
              disabled={submitting || sent}
              mounted={!sent}
              type="submit"
              color="secondary"
              fullWidth
            >
              {submitting || sent ? 'En progreso…' : 'Registrarse'}
            </FormButton>
          </SubForm>
        )}
      </Form>
    </>
  )
}

function SignUp () {
    const subtitle = (
        <>
            ¿Ya tienes una cuenta?,
            <LinkTo href="/auth/sign-in/" underline="always">
              {' Iniciar sesión aquí'}
            </LinkTo>
        </>
    )

  return (
    <AuthLayout title="Registrarse" subtitle={subtitle}>
        <SignUpForm />
    </AuthLayout>
  )
}

export default SignUp
