import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import withRoot from "../withRoot";
import theme from "../theme";
import { styled } from "@mui/material/styles";
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
});

function Content(props) {
  // const { classes } = props;
  const classes = styles(theme);

  return (
    <Paper sx={classes.paper}>
      <AppBar sx={classes.searchBar} position="static" color="default" elevation={0}>
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SearchIcon sx={classes.block} color="inherit" />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Buscar por email, número telefonico o, ID de usuario"
                InputProps={{
                  // disableUnderline: true,
                  sx: classes.searchInput,
                }}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" sx={classes.addUser}>
                Agregar usuario
              </Button>
              <Tooltip title="Reload">
                <IconButton>
                  <RefreshIcon sx={classes.block} color="inherit" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Box sx={classes.contentWrapper}>
        <Typography color="textSecondary" align="center">
          No existen usuarios registrados aun
        </Typography>
      </Box>
    </Paper>
  );
}

Content.propTypes = {
  // classes: PropTypes.object.isRequired,
};

export default withRoot(Content);