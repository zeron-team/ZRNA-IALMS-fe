import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50', // Dark Slate Gray - professional and modern
      light: '#4A6572',
      dark: '#1A2634',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1ABC9C', // Turquoise - complementary and vibrant
      light: '#48C9B0',
      dark: '#148F77',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#E74C3C', // Alizarin Crimson
    },
    warning: {
      main: '#F39C12', // Orange
    },
    info: {
      main: '#3498DB', // Peter River
    },
    success: {
      main: '#2ECC71', // Emerald
    },
    background: {
      default: '#ECF0F1', // Light Gray - subtle background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50', // Dark Slate Gray
      secondary: '#7F8C8D', // Gray
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none', // Keep button text as is
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2C3E50', // Use primary dark for AppBar
          color: '#FFFFFF',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly rounded buttons
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Rounded cards
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Subtle shadow
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#34495E', // Darker background for sidebar
          color: '#FFFFFF',
        },
      },
    },
  },
});

export default theme;