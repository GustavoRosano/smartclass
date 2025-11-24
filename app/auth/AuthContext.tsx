"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  email: string;
  role: "professor" | "aluno";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  async function login(email: string, senha: string) {
    if (senha !== "123456") return false;

    const mockUsers: Record<string, User> = {
      "professor@teste.com": {
        id: "1",
        email: "professor@teste.com",
        role: "professor",
      },
      "aluno@teste.com": {
        id: "2",
        email: "aluno@teste.com",
        role: "aluno",
      },
    };

    const found = mockUsers[email];
    if (!found) return false;

    setUser(found);
    localStorage.setItem("user", JSON.stringify(found));
    return true;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}