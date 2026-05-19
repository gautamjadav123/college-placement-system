import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("user_id");
    if (token && role) {
      setUser({ token, role, username, userId });
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("role", data.role);
    localStorage.setItem("username", data.username);
    localStorage.setItem("user_id", data.user_id);
    setUser({ token: data.access, role: data.role, username: data.username, userId: data.user_id });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
