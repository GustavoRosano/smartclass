"use client";
import { useState } from "react";
import { TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useAuth } from "../auth/AuthContext";
import styles from "./styles.module.scss";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // Validação básica
  const isEmailValid = email.includes('@') && email.includes('.');
  const isSenhaValid = senha.length >= 6;
  const isFormValid = isEmailValid && isSenhaValid;

  async function handleLogin() {
    if (!isFormValid) {
      setErro("Preencha email válido e senha com mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    setErro("");

    const response = await login(email, senha);
    
    setLoading(false);

    if (!response.success) {
      setErro(response.error || "Falha no login");
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid && !loading) {
      handleLogin();
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.container}>
        <img src="/login-logo.png" className={styles.logo} alt="Logo SmartClass" />
        
        <div className={styles.loginForm}>
          <h1 className={styles.title}>Login</h1>
          
          <TextField 
            label="Email" 
            variant="outlined" 
            className={styles.loginInput} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            error={email.length > 0 && !isEmailValid}
            helperText={email.length > 0 && !isEmailValid ? "Email inválido" : ""}
            disabled={loading}
          />
          
          <TextField 
            label="Senha" 
            variant="outlined" 
            type="password" 
            className={styles.loginInput} 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)}
            onKeyPress={handleKeyPress}
            error={senha.length > 0 && !isSenhaValid}
            helperText={senha.length > 0 && !isSenhaValid ? "Mínimo 6 caracteres" : ""}
            disabled={loading}
          />
          
          {erro && (
            <Alert severity="error" className={styles.errorAlert}>
              {erro}
            </Alert>
          )}
          
          <Button 
            variant="contained" 
            className={styles.loginButton} 
            onClick={handleLogin}
            disabled={!isFormValid || loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
          </Button>
        </div>
      </div>
    </div>
  );
}