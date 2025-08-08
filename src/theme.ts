
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B008B', // Dark Magenta
    },
    secondary: {
      main: '#FF69B4', // Hot Pink for accent
    },
    background: {
      default: 'linear-gradient(135deg, #0A0A2A 0%, #1A0A3A 100%)', // Dark blue gradient background
      paper: '#1A1A2A',   // Slightly lighter for surfaces
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0', // Lighter grey for secondary text
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
  shape: {
    borderRadius: 12, // More rounded corners
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%',
          background: 'linear-gradient(135deg, #0A0A2A 0%, #1A0A3A 100%)',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        },
        body: {
          minHeight: '100%',
          background: 'linear-gradient(135deg, #0A0A2A 0%, #1A0A3A 100%)',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          margin: 0,
        },
        '#root': {
          minHeight: '100%',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(40, 0, 40, 0.5)', // Darker Purple with 50% opacity
          boxShadow: '0px 4px 10px rgba(0,0,0,0.5)',
        },
      },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                backgroundColor: 'rgba(40, 0, 40, 0.5)',
                borderRadius: 12, // Apply rounded corners to cards
                boxShadow: '0 4px 8px rgba(0,0,0,0.4)', // Subtle shadow
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 12px 24px 0 rgba(0,0,0,0.6)'
                }
            }
        }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Apply rounded corners to buttons
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)', // Subtle shadow
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Apply rounded corners to text fields
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)', // Subtle shadow
            backgroundColor: 'rgba(40, 0, 40, 0.5)', // Darker Purple with 50% opacity
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Apply rounded corners to toggle buttons
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)', // Subtle shadow
          backgroundColor: 'rgba(40, 0, 40, 0.5)', // Darker Purple with 50% opacity
        },
      },
    },
  },
});

export default theme;
