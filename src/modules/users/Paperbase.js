import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import withRoot from "../withRoot";
import theme from "../theme";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Navigator from "./Navigator";
// import Content from "./Content";
// import Products from "./views/Products";
import Rutas from "./Rutas";
import Header from "./Header";
import ShopMarcas from "./components/ShopMarcas";
import ShopConditions from "./components/ShopConditions";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://maikpwwq.github.io/wavi-aeronautics/">
        Wavi Aeronautics
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

let innerTheme = createTheme({
  palette: {
    primary: {
      light: "#63ccff",
      main: "#009be5",
      dark: "#006db3",
    },
  },
  // mode: 'dark',
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

innerTheme = {
  ...innerTheme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: "#18202c",
      },
    },
    MuiButton: {
      label: {
        textTransform: "none",
      },
      contained: {
        boxShadow: "none",
        "&:active": {
          boxShadow: "none",
        },
      },
    },
    MuiTabs: {
      root: {
        marginLeft: innerTheme.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: innerTheme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: "none",
        margin: "0 16px",
        minWidth: 0,
        padding: 0,
        [innerTheme.breakpoints.up("md")]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: innerTheme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: "#404854",
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: innerTheme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: "inherit",
        marginRight: 0,
        "& svg": {
          fontSize: 20,
        },
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
  },
};

const drawerWidth = 256;

const styles = (theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
  },
  drawer: {
    [innerTheme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  app: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    overflowX: "auto",
  },
  shopMore: {
    padding: innerTheme.spacing(2),
    background: "#eaeff1",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

const Footer = styled("footer")(({ theme }) => ({
  padding: theme.spacing(2),
  background: "#eaeff1",
}));

const Main = styled("main")(({ theme }) => ({
  flex: 1,
    padding: theme.spacing(2, 2),
    background: "#eaeff1",
    // zIndex: -1,
}));

function Paperbase(props) {
  // const { classes } = props;
  const classes = styles(theme);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={innerTheme}>
      <Box sx={classes.root}>
        <CssBaseline />
        {/* <nav className={classes.drawer}>
          <Box sx={{ display: { xs: 'none', md: 'block' } }} implementation="js">
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          </Hidden>
          <Box sx={{ display: { xs: 'block', md: 'none' } }} implementation="css">
            <Navigator PaperProps={{ style: { width: drawerWidth } }} />
          </Box>
        </nav> */}
        <Box sx={classes.app}>
          <Header onDrawerToggle={handleDrawerToggle} />
          <Main>
            {/* <Products /> */}
            <Rutas />
            {/* <Content /> */}
          </Main>
          <Box sx={classes.shopMore}>
            <ShopConditions />
          </Box>
          <ShopMarcas />
          <Footer>
            <Copyright />
          </Footer>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

Paperbase.propTypes = {
  // classes: PropTypes.object.isRequired,
};

export default withRoot(Paperbase);
