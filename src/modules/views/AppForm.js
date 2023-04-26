import React from 'react'
import PropTypes from 'prop-types'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import withRoot from '@/modules/withRoot'
import theme from '@/modules/theme'
import Paper from '../components/Paper'
const appCurvyLines = 'public/static/themes/appCurvyLines.png'

const styles = (theme) => ({
  root: {
    display: 'flex',
    backgroundImage: `url(${appCurvyLines})`,
    backgroundRepeat: 'no-repeat'
  },
  paper: {
    padding: theme.spacing(4, 3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(8, 6)
    }
  }
})

function AppForm (props) {
  const { children } = props
  const classes = styles(theme)
  return (
    <div style={classes.root}>
      <Container maxWidth="sm">
        <Box mt={7} mb={12}>
          <Paper sx={classes.paper}>{children}</Paper>
        </Box>
      </Container>
    </div>
  )
}

AppForm.propTypes = {
  children: PropTypes.node.isRequired
  // classes: PropTypes.object.isRequired,
}

export default withRoot(AppForm)
