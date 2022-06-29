import React from "react";
import PropTypes from "prop-types";
import withRoot from "../withRoot";
import theme from "../theme";
import { styled } from "@mui/material/styles";
import { capitalize } from "@mui/material/utils";
import MuiTypography from "@mui/material/Typography";

const styles = (theme) => ({
  markedH2Center: {
    height: 4,
    width: 73,
    display: "block",
    margin: `${theme.spacing(1)} auto 0`,
    backgroundColor: theme.palette.secondary.main,
  },
  markedH3Center: {
    height: 4,
    width: 55,
    display: "block",
    margin: `${theme.spacing(1)} auto 0`,
    backgroundColor: theme.palette.secondary.main,
  },
  markedH4Center: {
    height: 4,
    width: 55,
    display: "block",
    margin: `${theme.spacing(1)} auto 0`,
    backgroundColor: theme.palette.secondary.main,
  },
  markedH6Left: {
    height: 2,
    width: 28,
    display: "block",
    marginTop: theme.spacing(0.5),
    background: "currentColor",
  },
});

const SPAN =styled('span')({

})

const variantMapping = {
  h1: "h1",
  h2: "h1",
  h3: "h1",
  h4: "h1",
  h5: "h3", 
  h6: "h2",
  subtitle1: "h3",
};
 
function Typography(props) {
  const { children, marked = false, variant, ...other } = props;
  const classes = styles(theme);

  return (
    <MuiTypography variantMapping={variantMapping} variant={variant} {...other}>
      {children}
      {marked ? (
        <SPAN
          sx={
            classes[`marked${capitalize(variant) + capitalize(marked)}`]
          }
        />
      ) : null}
    </MuiTypography>
  );
}

Typography.propTypes = {
  children: PropTypes.node,
  // classes: PropTypes.object.isRequired,
  marked: PropTypes.oneOf([false, "center", "left"]),
  variant: PropTypes.string,
};

export default withRoot(Typography);