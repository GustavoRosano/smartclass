"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService, User, LoginResponse } from '../services/auth.service';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<LoginResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = AuthService.getSession();
    setUser(savedUser);
    setLoading(false);
  }, []);

  async function login(email: string, senha: string): Promise<LoginResponse> {
    const response = await AuthService.login(email, senha);
    
    if (response.success && response.user) {
      setUser(response.user);
      AuthService.saveSession(response.user);
    }
    
    return response;
  }

  function logout() {
    setUser(null);
    AuthService.clearSession();
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
