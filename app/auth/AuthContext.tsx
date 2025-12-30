"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  email: string;
  name: string;
  role: "professor" | "aluno";
  matter?: string
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
      "professor1@teste.com": {
        id: "1",
        email: "professor1@teste.com",
        name: "Gustavo",
        role: "professor",
        matter: "UI/UX para desenvolvedores",
      },
      "professor2@teste.com": {
        id: "2",
        email: "professor2@teste.com",
        name: "Ricardo",
        role: "professor",
        matter: "React",
      },
      "professor3@teste.com": {
        id: "3",
        email: "professor3@teste.com",
        name: "Bruno",
        role: "professor",
        matter: "Next",
      },
      "aluno@teste.com": {
        id: "4",
        email: "aluno@teste.com",
        name: "Gustavo",
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