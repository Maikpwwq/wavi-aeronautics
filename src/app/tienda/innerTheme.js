import { createTheme } from '@mui/material/styles'

// ============================================================================
// BRAND COLORS - Wavi Aeronautics Design System
// ============================================================================
export const BRAND_COLORS = {
  primary: '#1976d2',      // Brand blue
  primaryDark: '#1565c0',  // Hover state
  primaryLight: '#42a5f5', // Active state
  accent: '#00bcd4',       // Cyan accent
  success: '#4caf50',      // Success green
  text: {
    primary: '#1a2744',
    secondary: '#546e7a',
    link: '#455a64',       // High contrast for links
    disabled: '#9e9e9e',
  },
  background: {
    page: '#fcfcfc',
    paper: '#ffffff',
    subtle: '#f5f5f5',
  },
  border: {
    light: '#f0f0f0',
    default: '#e0e0e0',
  }
}

let innerTheme = createTheme({
  palette: {
    primary: {
      light: BRAND_COLORS.primaryLight,
      main: BRAND_COLORS.primary,
      dark: BRAND_COLORS.primaryDark
    }
  },
  // mode: 'dark',
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5
    }
  },
  shape: {
    borderRadius: 8
  },
  props: {
    MuiTab: {
      disableRipple: true
    }
  },
  mixins: {
    toolbar: {
      minHeight: 48
    }
  }
})

innerTheme = {
  ...innerTheme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#18202c'
      }
    },
    MuiButton: {
      label: {
        textTransform: 'none'
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none'
        }
      }
    },
    MuiTabs: {
      root: {
        marginLeft: innerTheme.spacing(1)
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: innerTheme.palette.common.white
      }
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
        [innerTheme.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0
        }
      }
    },
    MuiIconButton: {
      root: {
        padding: innerTheme.spacing(1)
      }
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: '#404854'
      }
    },
    MuiListItemText: {
      primary: {
        fontWeight: innerTheme.typography.fontWeightMedium
      }
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20
        }
      }
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32
      }
    }
  }
}

export default innerTheme
