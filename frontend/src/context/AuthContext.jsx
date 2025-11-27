// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode"; // ✅ Correct import for Vite

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token); // ✅ Works

        // Check if token expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Token expired, removing from localStorage");
          localStorage.removeItem("token");
          return null;
        }

        return { ...decoded, token };
      }
      return null;
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      return null;
    }
  });

  useEffect(() => {
    if (user?.token) {
      localStorage.setItem("token", user.token);
    } else {
      localStorage.removeItem("token");
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      const decoded = jwtDecode(token); // ✅ Works
      setUser({ ...decoded, token });

      // Return complete user data including role
      return {
        success: true,
        user: user,
        role: decoded.role
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password, role, gender, dateOfBirth, phoneNumber, carRegNumber, carMake, carModel, carColor) => {
    try {
      const res = await api.post("/auth/register", { name, email, password, role, gender, dateOfBirth, phoneNumber, carRegNumber, carMake, carModel, carColor });
      const { token, user } = res.data;

      const decoded = jwtDecode(token); // ✅ Works
      setUser({ ...decoded, token });

      // Return complete user data including role
      return {
        success: true,
        user: user,
        role: decoded.role
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
