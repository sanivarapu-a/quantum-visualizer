"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { login as apiLogin, register as apiRegister, saveAuth, clearAuth, getStoredAuth } from "./auth";

interface AuthContextValue {
  token: string | null;
  email: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // Runs once on mount, client-side only — localStorage isn't available
  // during server rendering, so auth state starts empty and hydrates here.
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setToken(stored.token);
      setEmail(stored.email);
    }
  }, []);

  async function login(emailInput: string, password: string) {
    const result = await apiLogin(emailInput, password);
    saveAuth(result.token, result.email);
    setToken(result.token);
    setEmail(result.email);
  }

  async function register(emailInput: string, password: string) {
    const result = await apiRegister(emailInput, password);
    saveAuth(result.token, result.email);
    setToken(result.token);
    setEmail(result.email);
  }

  function logout() {
    clearAuth();
    setToken(null);
    setEmail(null);
  }

  return (
    <AuthContext.Provider value={{ token, email, isLoggedIn: token != null, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}