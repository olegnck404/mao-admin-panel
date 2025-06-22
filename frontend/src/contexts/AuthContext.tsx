import axios from "axios";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { Navigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  user: null | { id: string; name: string; email: string; role: string };
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  useEffect(() => {
    if (token) {
      // User info can be retrieved from the backend, but for simplicity, it's taken from localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) setUser(JSON.parse(userStr));
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return true;
    } catch {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!token;

  // Axios interceptor for token substitution
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = token;
      }
      return config;
    });
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/mao-admin-panel/login" />
  );
}
