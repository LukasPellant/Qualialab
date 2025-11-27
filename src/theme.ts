
import { createTheme } from '@mui/material/styles';

// Deep Space Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f3ff', // Cyan Neon
      light: '#7dfafc',
      dark: '#00a0a8',
      contrastText: '#000000',
    },
    secondary: {
      main: '#bc13fe', // Neon Purple
      light: '#d669ff',
      dark: '#8a00c2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#050511', // Very dark blue/black
      paper: 'rgba(20, 20, 35, 0.6)', // Glassy dark
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    action: {
      hover: 'rgba(0, 243, 255, 0.08)',
      selected: 'rgba(0, 243, 255, 0.16)',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #ffffff 0%, #00f3ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%',
          scrollBehavior: 'smooth',
        },
        body: {
          minHeight: '100%',
          background: 'radial-gradient(circle at 50% 0%, #1a1a40 0%, #050511 100%)',
          backgroundAttachment: 'fixed',
          margin: 0,
          overflowX: 'hidden',
        },
        '#root': {
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        // Custom scrollbar
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: '#050511',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#333355',
          borderRadius: '4px',
          '&:hover': {
            background: '#555577',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(5, 5, 17, 0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px -10px rgba(0, 243, 255, 0.15)',
            border: '1px solid rgba(0, 243, 255, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(0, 243, 255, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 243, 255, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.2s',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(0, 243, 255, 0.05)',
              '& fieldset': {
                borderColor: '#00f3ff',
              },
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        filled: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});

export default theme;
