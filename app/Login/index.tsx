"use client";
import { useState } from "react";
import { TextField, Button } from '@mui/material'
import { useAuth } from "../auth/AuthContext";

import styles from "./styles.module.scss";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin() {
    const ok = await login(email, senha);
    if (!ok) {
      setErro("Email ou senha incorretos");
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.container}>
        <img src="/login-logo.png" className={styles.logo} />
        <div className={styles.loginForm}>
          <h1 className={styles.title}>Login</h1>
          <TextField label="Email" variant="outlined" className={styles.loginInput} value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Senha" variant="outlined" type="password" className={styles.loginInput} value={senha} onChange={(e) => setSenha(e.target.value)} />
          {erro && <p style={{ color: "red" }}>{erro}</p>}
          <Button variant="contained" className={styles.loginButton} onClick={handleLogin}>
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
}