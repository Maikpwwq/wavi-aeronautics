import React from 'react'
// import PropTypes from 'prop-types'
import withRoot from '../withRoot'
import theme from '../theme'
// import { styled } from '@mui/material/styles'
import MuiAppBar from '@mui/material/AppBar'

const styles = (theme) => ({
  root: {
    color: theme.palette.common.white
  }
})

function AppBar (props) {
  const classes = styles(theme)
  return <MuiAppBar style={classes.root} elevation={0} position="static" {...props} />
}

AppBar.propTypes = {
  // classes: PropTypes.object.isRequired,
}

export default withRoot(AppBar)
