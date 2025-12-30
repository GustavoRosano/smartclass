"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { default as api } from '../../api/middle.axios';

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
    try{
    const response = await api.get<User[]>('/api/users/login', {
           params:{
              email: email,
              password: senha
           }
        });
     
     const foundUsers = response.data;
       
        // Verifica se o array tem um usuário (login bem-sucedido)
        if (foundUsers[0].email === email) {
           
            const loggedInUser = foundUsers[0];
           
            setUser(loggedInUser);
            localStorage.setItem("user", JSON.stringify(loggedInUser));
            return true;
       
        } else {
           // falha: Array vazio (credenciais incorretas)
            return false;
        }

    } catch (error) {
        console.error("Erro na API ou na lógica:", error);
        return false;
    }
   
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
