import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import Home from './pages/Home';
import Livestream from './pages/Livestream';
import Header from './components/Header';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/livestream/:id" element={<Livestream />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
