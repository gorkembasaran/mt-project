import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3d63f2',
      dark: '#2949c7',
      light: '#eaf0ff',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4e9a57',
    },
    warning: {
      main: '#de842d',
    },
    error: {
      main: '#d74a63',
    },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2a44',
      secondary: '#7c8aa5',
    },
    divider: '#e5ebf4',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.8rem',
      lineHeight: 1.08,
      letterSpacing: '-0.04em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at top left, rgba(74, 114, 255, 0.06), transparent 18%), radial-gradient(circle at top right, rgba(45, 89, 214, 0.07), transparent 16%), #f4f7fb',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 22px 60px rgba(34, 53, 92, 0.07)',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          paddingInline: 18,
          minHeight: 44,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 28,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#5b6780',
          fontSize: '0.8rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          backgroundColor: '#f2f5fb',
          borderBottomColor: '#e8eef8',
        },
        body: {
          borderBottomColor: '#eef2f8',
        },
      },
    },
  },
})
