'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Field, Form, FormSpy } from 'react-final-form'
import { styled } from '@mui/material/styles'

import SnackBarAlert from '@/app/components/SnackBarAlert'
import { email, required } from '@/modules/form/validation'
import RFTextField from '@/modules/form/RFTextField'
import FormButton from '@/modules/form/FormButton'
import FormFeedback from '@/modules/form/FormFeedback'
import Typography from '@/modules/components/Typography'
import theme from '@/modules/theme'
import { Button, Divider } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google' 
import FacebookIcon from '@mui/icons-material/Facebook'

import AuthLayout from '../components/AuthLayout'
import authService from '@/services/authService'
import useAuthForm from '../hooks/useAuthForm'

const styles = (theme) => ({
  button: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
    '&:hover': {    
      color: theme.palette.secondary.light,
    }
  },
  feedback: {
    paddingTop: theme.spacing(2)
  },   
  link: {
    paddingTop: theme.spacing(2)
  },
  socialButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    textTransform: 'none',
    fontWeight: 'bold',
  }
})

const SubForm = styled('form')({
  paddingTop: theme.spacing(6)
})

const LinkTo = styled(Link)({
    fontSize: '17px',
    textDecoration: 'none !important',
    color: 'black !important',
    '&:hover': {
      color: theme.palette.secondary.main + ' !important',
    }
})

const SignInForm = () => {
  const classes = styles(theme)
  
  // Custom hook for state and alerts
  const { 
    sent, 
    alert, 
    handleCloseAlert, 
    handleSuccess, 
    handleError 
  } = useAuthForm()

  const validate = (values) => {
    const errors = required(['email', 'password'], values)
    if (!errors.email) {
      const emailError = email(values.email, values)
      if (emailError) errors.email = emailError
    }
    return errors
  }

  const onSubmit = async (values) => {
    // console.log('submit', values)
    const { userID, errorCode, errorMessage } = await authService.signIn(values)
    
    if (!!userID) {
        handleSuccess(userID, 'Se ha iniciado una nueva sesión.')
    } else {
        handleError(errorCode, errorMessage)
    }
  }
  
  const handleSocialClick = async (provider) => {
      const { userID, errorCode, errorMessage } = await authService.signInWithSocial(provider)
      if (!!userID) {
          handleSuccess(userID, 'Se ha iniciado una nueva sesión.')
      } else {
        if (errorCode) {
             handleError(errorCode, errorMessage)
        }
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
              size="large"
              type="submit"
              color="secondary"
              fullWidth
            >
              {submitting || sent ? 'En progreso…' : 'Iniciar sesión'}
            </FormButton>
          </SubForm>
        )}
      </Form>
      
      <Divider sx={{ my: 3 }}>o continúa con</Divider>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<GoogleIcon />}
        onClick={() => handleSocialClick('google')}
        sx={{
            ...classes.socialButton,
            backgroundColor: 'white',
            color: '#757575',
            borderColor: '#ddd',
            '&:hover': {
                backgroundColor: '#f5f5f5',
                borderColor: '#ccc'
            }
        }}
      >
        Continuar con Google
      </Button>

      <Button
        variant="contained"
        fullWidth
        startIcon={<FacebookIcon />}
        onClick={() => handleSocialClick('facebook')}
        sx={{
            ...classes.socialButton,
            backgroundColor: '#1877F2',
            color: 'white',
            '&:hover': {
                backgroundColor: '#166fe5'
            }
        }}
      >
        Continuar con Facebook
      </Button>
    </>
  )
}

function SignIn () {
  const classes = styles(theme)

  const subtitle = (
      <>
        {'¿No eres miembro aun?, '}
        <LinkTo
          className={classes.link}
          href="/auth/sign-up/"
          underline="always"
        >
          {'Registrarse'}
        </LinkTo>
      </>
  )

  return (
    <AuthLayout title="Iniciar sesión" subtitle={subtitle}>
        <SignInForm />
        <Typography align="center" sx={classes.link}>
          <LinkTo href="/auth/forgot-password/">
            {'Recordar password'}
          </LinkTo>
        </Typography>
    </AuthLayout>
  )
}

export default SignIn
