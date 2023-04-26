'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { sharingInformationService } from '@/services/sharing-information'
// import Link from 'next/link'
import { Field, Form, FormSpy } from 'react-final-form'

import SnackBarAlert from '@/app/components/SnackBarAlert'
import Typography from '@/modules/components/Typography'
import AppFooter from '@/modules/views/AppFooter'
import AppAppBar from '@/modules/views/AppAppBar'
import AppForm from '@/modules/views/AppForm'
import { email, required } from '@/modules/form/validation'
import RFTextField from '@/modules/form/RFTextField'
import FormButton from '@/modules/form/FormButton'
import FormFeedback from '@/modules/form/FormFeedback'

import withRoot from '@/modules/withRoot'
import theme from '@/modules/theme'
import { styled } from '@mui/material/styles'

const styles = (theme) => ({
  button: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2)
  },
  feedback: {
    paddingTop: theme.spacing(2)
  },
  link: {
    fontSize: '21px',
    textDecoration: 'none',
    color: 'black !important'
  }
})

const SubForm = styled('form')({
  paddingTop: theme.spacing(6)
})

const ForgotPasswordForm = () => {
  const classes = styles(theme)
  const router = useRouter()

  const [sent, setSent] = useState(false)
  const [event, setEvent] = useState({ email: '' })
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleAlert = (message, severity) => {
    setAlert({ ...alert, open: true, message, severity })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      console.log(reason, event)
    } else {
      setAlert({ ...alert, open: false, message: '' })
    }
  }

  const validate = (values) => {
    const errors = required(['email'], values)

    // TODO: Set Alerts
    if (!errors.email) {
      const emailError = email(values.email, values)
      if (emailError) {
        errors.email = email(values.email, values)
      }
    }

    return errors
  }

  const fetchForgotPassword = async (event) => {
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // throw new Error('Error al cargar los comentarios')
    const response = await fetch('http://localhost:3000/api/forgot-password', {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify(event),
      next: { revalidate: 60 }
    }).then((res) => {
      if (!res.ok) {
        // throw new Error("Custom Error message", res);
        console.log('Custom Error message', res)
      }
      // if (res.redirected) {
      //   window.location.href = response.url;
      // }
      // console.log("fetchSignIn", res, res.body);
      return res.json()
      // router.push("/tienda/drones");
    })
    return response
    // .then((data) => console.log("fetch", data));
  }

  // const handleSubmit = (e) => {
  //   // e.preventDefault();
  //   console.log('submit', e)
  // }

  const onSubmit = async (e) => {
    // e.preventDefault();
    console.log('submit', e)
    handleChange(e)
    await fetchForgotPassword(e).then((res) => {
      const { errorCode, errorMessage } = res
      // sharingInformationService.setSubject({ userID });
      if (!!errorCode && !!errorMessage) {
        setSent(false)
        if (errorCode === 'auth/user-not-found') {
          handleAlert('Debe usar un email registrado.', 'error')
        } else if (errorCode === 'auth/network-request-failed') {
          handleAlert('Fallo de red para completar la solicitud.', 'error')
        } else {
          console.log('errorCode', errorCode)
          handleAlert('Ha sucedido un error intente de nuevo.', 'error')
        }
      } else {
        if (typeof window !== 'undefined') {
          // Perform localStorage action
          setSent(true)
          handleAlert(
            'Se ha enviado un correo para modificar la contraseña.',
            'success'
          )
          router.push('/auth/sign-in/')
        }
      }
    })
  }

  const handleChange = (e) => {
    setEvent({ email: e.email })
  }

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
              {submitting || sent ? 'En progreso…' : 'Enviar email'}
            </FormButton>
          </SubForm>
        )}
      </Form>
    </>
  )
}

function ForgotPassword (props) {
  // const classes = styles(theme)

  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            {'Modificar contraseña'}
          </Typography>
        </React.Fragment>
        <ForgotPasswordForm />
      </AppForm>
      <AppFooter />
    </React.Fragment>
  )
}

export default withRoot(ForgotPassword)
