'use client'
import React from 'react'
import AppFooter from '@/modules/views/AppFooter'
import AppAppBar from '@/modules/views/AppAppBar'
import AppForm from '@/modules/views/AppForm'
import Typography from '@/modules/components/Typography'
import withRoot from '@/modules/withRoot'

/**
 * Shared Layout for Auth pages (Sign In / Sign Up)
 * @param {Object} props
 * @param {string} props.title - Title of the page (e.g. "Iniciar sesión")
 * @param {React.ReactNode} props.subtitle - Subtitle link/text
 * @param {React.ReactNode} props.children - Form content
 */
const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <React.Fragment>
      <AppAppBar />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            {title}
          </Typography>
          <Typography variant="body2" align="center">
            {subtitle}
          </Typography>
        </React.Fragment>
        
        {children}
        
      </AppForm>
      <AppFooter />
    </React.Fragment>
  )
}

export default withRoot(AuthLayout)
