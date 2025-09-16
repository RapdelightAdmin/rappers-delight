import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Rubik, sans-serif',
    h1: { fontFamily: 'Roboto, sans-serif' },
    h2: { fontFamily: 'Roboto, sans-serif' },
    h3: { fontFamily: 'Roboto, sans-serif' },
    h4: { fontFamily: 'Roboto, sans-serif' },
    h5: { fontFamily: 'Roboto, sans-serif' },
    h6: { fontFamily: 'Roboto, sans-serif' },
  },
});

export default theme;
