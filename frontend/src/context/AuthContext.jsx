import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser as apiLogin,
  signupUser as apiSignup,
  logoutUser as apiLogout,
} from "../api/auth";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await apiLogin(email, password);
    localStorage.setItem("token", data.token);
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    toast.success(`Welcome back, ${data.name || "writer"}!`);
    return data;
  };

  const signup = async (name, email, password) => {
    const { data } = await apiSignup(name, email, password);
    localStorage.setItem("token", data.token);
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    toast.success("Account created! Welcome aboard.");
    return data;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // Even if server logout fails, clear local state
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
