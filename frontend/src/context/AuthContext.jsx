import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token is already stored, treat the user as
  // logged in optimistically using the cached profile fields.
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const cachedUser = localStorage.getItem("authUser");
    if (token && cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        localStorage.removeItem("authUser");
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const data = await authApi.login(email, password);
    const profile = {
      id: data.user_id,
      username: data.username,
      role: data.role,
    };
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(profile));
    setUser(profile);
    return profile;
  }

  async function signup(name, email, password) {
    const data = await authApi.signup(name, email, password);
    const profile = {
      id: data.user_id,
      username: data.username,
      role: data.role,
    };
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(profile));
    setUser(profile);
    return profile;
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setUser(null);
    }
  }

  const value = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
