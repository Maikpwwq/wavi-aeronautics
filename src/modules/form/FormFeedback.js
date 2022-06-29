import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from "@mui/material/styles";
import withRoot from "../withRoot";
import theme from "../theme";
import Typography from '../components/Typography';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  error: {
    backgroundColor: theme.palette.error.xLight,
    color: theme.palette.error.dark,
  },
  success: {
    backgroundColor: theme.palette.success.xLight,
    color: theme.palette.success.dark,
  },
});

function FormFeedback(props) {
  const classes = styles(theme);
  return (
    <div
      className={clsx(
        classes.root,
        { [classes.error]: props.error, [classes.success]: props.success },
        props.className,
      )}
    >
      <Typography color="inherit">{props.children}</Typography>
    </div>
  );
}

FormFeedback.propTypes = {
  children: PropTypes.node,
  // classes: PropTypes.object.isRequired,
  className: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
};

export default withRoot(FormFeedback);