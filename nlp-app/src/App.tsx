import React from 'react';
import { Provider } from 'react-redux';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import { store } from './store/store';
import TextAnalysis from './components/TextAnalysis';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <TextAnalysis />
        </Container>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
