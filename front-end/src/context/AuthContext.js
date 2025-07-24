import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
// import jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = `http://${window.location.hostname}:5000`;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        // const decoded = jwt_decode(storedToken);
        const decoded = jwtDecode(storedToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          logout();
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Token inválido o malformado:", error);
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });

      const { token, userId, userName, userRole } = response.data;
      const userData = { id: userId, name: userName, email, role: userRole };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(token);
      setUser(userData);

      toast.success("¡Inicio de sesión exitoso!");
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al iniciar sesión.";
      toast.error(errorMessage);
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        name,
        email,
        password,
      });
      toast.success(response.data.message);
      return true;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al registrar usuario.";
      toast.error(errorMessage);
      console.error("Register error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast("¡Sesión cerrada!");
  };

  const authContextValue = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user && user.role === "admin",
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
