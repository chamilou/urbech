"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, role }
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  const login = ({ token }) => {
    if (!token) {
      console.error("No token provided to login()");
      return;
    }

    localStorage.setItem("token", token);

    try {
      const { name, role, exp } = jwtDecode(token);
      setUser({ name, role, exp });
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Failed to decode token:", error);
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { name, role, exp } = jwtDecode(token);
      if (Date.now() < exp * 1000) {
        setUser({ name, role, exp });
        setIsLoggedIn(true);
      } else {
        logout(); // expired
      }
    } catch {
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use context
export const useAuth = () => useContext(AuthContext);
