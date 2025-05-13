import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { ThemeContext } from './contexts/ThemeContext';
import { routes } from './routes';
import { darkTheme, lightTheme } from './theme';

function AppRoutes() {
  const routing = useRoutes(routes);
  return routing;
}

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
