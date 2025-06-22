import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const liquidAnimation = keyframes`
  0% {
    background-position: 0% 50%;
    transform: scale(1);
    filter: hue-rotate(0deg) brightness(1);
  }
  25% {
    background-position: 50% 25%;
    transform: scale(1.1);
    filter: hue-rotate(90deg) brightness(1.2);
  }
  50% {
    background-position: 100% 50%;
    transform: scale(1.15);
    filter: hue-rotate(180deg) brightness(1.1);
  }
  75% {
    background-position: 50% 75%;
    transform: scale(1.1);
    filter: hue-rotate(270deg) brightness(1.2);
  }
  100% {
    background-position: 0% 50%;
    transform: scale(1);
    filter: hue-rotate(360deg) brightness(1);
  }
`;

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(formData.email, formData.password);
    setLoading(false);
    if (ok) {
      navigate("/mao-admin-panel");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        backgroundColor: theme.palette.mode === "light" ? "#0A0A0F" : "#000000",
        "&::before": {
          content: '""',
          position: "fixed",
          top: "-100%",
          left: "-100%",
          width: "300%",
          height: "300%",
          background: `linear-gradient(45deg,
            rgba(66, 0, 255, 0.5),
            rgba(123, 31, 162, 0.5),
            rgba(103, 58, 183, 0.5),
            rgba(57, 73, 171, 0.5))`,
          backgroundSize: "400% 400%",
          animation: `${liquidAnimation} 15s ease-in-out infinite`,
          filter: "blur(50px)",
          opacity: theme.palette.mode === "light" ? 0.5 : 0.3,
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "fixed",
          top: "-100%",
          left: "-100%",
          width: "300%",
          height: "300%",
          background: `linear-gradient(-45deg,
            rgba(0, 136, 255, 0.3),
            rgba(0, 84, 255, 0.3),
            rgba(0, 38, 255, 0.3),
            rgba(76, 0, 255, 0.3))`,
          backgroundSize: "400% 400%",
          animation: `${liquidAnimation} 20s ease-in-out infinite reverse`,
          filter: "blur(70px)",
          opacity: theme.palette.mode === "light" ? 0.4 : 0.2,
          zIndex: 0,
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 480 },
          minHeight: { xs: "100vh", sm: "auto" },
          m: { xs: 0, sm: 3 },
          p: { xs: 3, sm: 6 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
          position: "relative",
          zIndex: 2,
          backdropFilter: { xs: "none", sm: "blur(20px) saturate(180%)" },
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(20, 20, 25, 0.85)"
              : "rgba(255, 255, 255, 0.25)",
          border: `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(255, 255, 255, 0.3)"
          }`,
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          borderRadius: { xs: 0, sm: 3 },
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 30px rgba(0, 0, 0, 0.3)"
              : "0 4px 30px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            transform: { xs: "none", sm: "translateY(-2px)" },
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(20, 20, 25, 0.95)"
                : "rgba(255, 255, 255, 0.35)",
          },
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.025em",
              mb: 1,
              background: "linear-gradient(45deg, #FF1CAE, #FF5E3A)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ letterSpacing: "-0.011em" }}
          >
            Sign in to continue to your account
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={!!error}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backdropFilter: { xs: "none", sm: "blur(10px)" },
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(0, 0, 0, 0.2)"
                      : "rgba(255, 255, 255, 0.9)",
                  border:
                    theme.palette.mode === "light"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : "none",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0, 0, 0, 0.3)"
                        : "rgba(255, 255, 255, 1)",
                  },
                  "&.Mui-focused": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0, 0, 0, 0.4)"
                        : "rgba(255, 255, 255, 1)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(0, 0, 0, 0.7)",
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              error={!!error}
              helperText={error}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backdropFilter: { xs: "none", sm: "blur(10px)" },
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(0, 0, 0, 0.2)"
                      : "rgba(255, 255, 255, 0.9)",
                  border:
                    theme.palette.mode === "light"
                      ? "1px solid rgba(0, 0, 0, 0.1)"
                      : "none",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0, 0, 0, 0.3)"
                        : "rgba(255, 255, 255, 1)",
                  },
                  "&.Mui-focused": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0, 0, 0, 0.4)"
                        : "rgba(255, 255, 255, 1)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(0, 0, 0, 0.7)",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{
                        color: "neutral.main",
                        transition: "all 0.2s",
                        "&:hover": {
                          color: "primary.main",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                height: 48,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: "-0.011em",
                backdropFilter: "blur(10px)",
                background: "linear-gradient(45deg, #FF1CAE, #FF5E3A)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 16px rgba(255, 28, 174, 0.2)",
                },
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>
        </form>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Don't have an account?{" "}
          <Button
            color="primary"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              letterSpacing: "-0.011em",
              background: "linear-gradient(45deg, #FF1CAE, #FF5E3A)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            onClick={() => {
              /* Handle registration */
            }}
          >
            Sign Up
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
}
