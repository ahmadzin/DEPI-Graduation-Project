import { createContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, data } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(token);
      setUser(data.user);

      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      const { token, data } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(token);
      setUser(data.user);

      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isSuperAdmin = user?.role === "SuperAdmin";
  const isManager = user?.role === "Manager";
  const isGuest = user?.role === "Guest";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isSuperAdmin,
        isManager,
        isGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
