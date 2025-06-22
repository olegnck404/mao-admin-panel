import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // <-- IMPORTANT!
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

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleTheme = () => setMode(mode === "light" ? "dark" : "light");
  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <AppRoutes />
            </SnackbarProvider>
          </ThemeProvider>
        </ThemeContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}