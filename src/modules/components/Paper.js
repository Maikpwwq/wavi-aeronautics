import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import MuiPaper from '@mui/material/Paper'
import { capitalize } from '@mui/material/utils'
import withRoot from '../withRoot'
import theme from '../theme'
// import { styled } from '@mui/material/styles'

const styles = (theme) => ({
  backgroundLight: {
    backgroundColor: theme.palette.secondary.light
  },
  backgroundMain: {
    backgroundColor: theme.palette.secondary.main
  },
  backgroundDark: {
    backgroundColor: theme.palette.secondary.dark
  },
  padding: {
    padding: theme.spacing(1)
  }
})

function Paper (props) {
  const { background = 'light', className, padding = false, ...other } = props
  const classes = styles(theme)
  return (
    <MuiPaper
      elevation={0}
      square
      className={clsx(
        classes[`background${capitalize(background)}`],
        {
          [classes.padding]: padding
        },
        className
      )}
      {...other}
    />
  )
}

Paper.propTypes = {
  background: PropTypes.oneOf(['light', 'main', 'dark']),
  // classes: PropTypes.object.isRequired,
  className: PropTypes.object,
  padding: PropTypes.bool
}

export default withRoot(Paper)
