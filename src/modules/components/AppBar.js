import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import MuiAppBar from '@mui/material/AppBar';

const styles = (theme) => ({
  root: {
    color: theme.palette.common.white,
  },
});

function AppBar(props) {
  return <MuiAppBar elevation={0} position="static" {...props} />;
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppBar);