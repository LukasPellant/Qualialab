
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // A light blue, good for primary actions
    },
    secondary: {
      main: '#f48fb1', // A light pink, for secondary actions
    },
    background: {
      default: '#121212', // Standard dark background
      paper: '#1e1e1e',   // Slightly lighter for surfaces like cards and menus
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5', // Lighter grey for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h4: {
        fontSize: '1.75rem',
        fontWeight: 600,
    },
    h5: {
        fontSize: '1.5rem',
        fontWeight: 500,
    },
    h6: {
        fontSize: '1.25rem',
        fontWeight: 500,
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e', // Use paper color for app bar
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                backgroundColor: '#2c2c2c',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 8px 16px 0 rgba(0,0,0,0.5)'
                }
            }
        }
    }
  },
});

export default theme;
