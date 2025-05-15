import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import { ThemeContext } from "./contexts/ThemeContext";
import { routes } from "./routes";
import { darkTheme, lightTheme } from "./theme";

function AppRoutes() {
  return useRoutes(routes);
}

export default function App() {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("themeMode");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", String(isAuthenticated));
  }, [isAuthenticated]);

  const toggleTheme = () => setMode(mode === "light" ? "dark" : "light");
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppRoutes />
          </ThemeProvider>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}
