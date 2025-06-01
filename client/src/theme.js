import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
    },
    secondary: {
      main: '#EC4899',
      light: '#F472B6',
      dark: '#DB2777',
    },
    error: {
      main: '#F43F5E',
      light: '#FB7185',
      dark: '#E11D48',
    },
    background: {
      default: '#0F172A',
      paper: 'rgba(30, 41, 59, 0.7)',
    },
    text: {
      primary: '#F8FAFC',
      secondary: 'rgba(248, 250, 252, 0.7)',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Poppins', sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          minHeight: '100dvh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          padding: '10px 24px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #6366F1 0%, #818CF8 100%)',
          border: 'none',
          '&:hover': {
            background: 'linear-gradient(45deg, #4F46E5 0%, #6366F1 100%)',
          },
        },
        outlined: {
          borderColor: 'rgba(99, 102, 241, 0.5)',
          '&:hover': {
            borderColor: '#6366F1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              border: '1px solid rgba(99, 102, 241, 0.5)',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
            },
            '&.Mui-focused': {
              border: '1px solid #6366F1',
              backgroundColor: 'rgba(30, 41, 59, 0.9)',
              boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(248, 250, 252, 0.7)',
            '&.Mui-focused': {
              color: '#6366F1',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

export default theme; 