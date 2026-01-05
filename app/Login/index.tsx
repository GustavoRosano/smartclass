"use client";
import { useState, useEffect, Suspense } from "react";
import { TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useAuth } from "../auth/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles.module.scss";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess("✅ Conta criada com sucesso! Faça login para continuar.");
    }
  }, [searchParams]);

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
          
          {success && (
            <Alert severity="success" className={styles.successAlert}>
              {success}
            </Alert>
          )}

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

          <div className={styles.linksContainer}>
            <button 
              type="button"
              className={styles.link}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push('/forgot-password');
              }}
            >
              Esqueceu sua senha?
            </button>
            
            <span className={styles.separator}>•</span>
            
            <button 
              type="button"
              className={styles.link}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push('/register');
              }}
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className={styles.loginContainer}>
        <div className={styles.container}>
          <CircularProgress sx={{ color: '#37ADA5' }} />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}