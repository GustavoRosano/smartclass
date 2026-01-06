"use client";
import { useState } from "react";
import { TextField, Button, Alert, CircularProgress, MenuItem } from '@mui/material';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserService } from "../services/user.service";
import styles from "./styles.module.scss";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<'aluno' | 'professor'>('aluno');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 6;
  const isPasswordMatch = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid = name.length > 0 && isEmailValid && isPasswordValid && isPasswordMatch;

  async function handleRegister() {
    if (!isFormValid) {
      setError("Preencha todos os campos corretamente");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await UserService.create({
        name,
        email,
        password,
        role
      });

      // Redirecionar para login após sucesso
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid && !loading) {
      handleRegister();
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.container}>
        <img src="/login-logo.png" className={styles.logo} alt="Logo SmartClass" />
        
        <div className={styles.registerForm}>
          <h1 className={styles.title}>Criar Conta</h1>
          
          <TextField 
            label="Nome Completo" 
            variant="outlined" 
            className={styles.input} 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            error={name.length > 0 && name.length < 3}
            helperText={name.length > 0 && name.length < 3 ? "Mínimo 3 caracteres" : ""}
            disabled={loading}
            fullWidth
          />

          <TextField 
            label="Email" 
            variant="outlined" 
            type="email"
            className={styles.input} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            error={email.length > 0 && !isEmailValid}
            helperText={email.length > 0 && !isEmailValid ? "Email inválido" : ""}
            disabled={loading}
            fullWidth
          />

          <TextField 
            label="Senha" 
            variant="outlined" 
            type="password" 
            className={styles.input} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            error={password.length > 0 && !isPasswordValid}
            helperText={password.length > 0 && !isPasswordValid ? "Mínimo 6 caracteres" : ""}
            disabled={loading}
            fullWidth
          />

          <TextField 
            label="Confirmar Senha" 
            variant="outlined" 
            type="password" 
            className={styles.input} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            error={confirmPassword.length > 0 && !isPasswordMatch}
            helperText={confirmPassword.length > 0 && !isPasswordMatch ? "Senhas não conferem" : ""}
            disabled={loading}
            fullWidth
          />

          <TextField 
            select
            label="Tipo de Conta" 
            variant="outlined" 
            className={styles.input} 
            value={role} 
            onChange={(e) => setRole(e.target.value as 'aluno' | 'professor')}
            disabled={loading}
            fullWidth
          >
            <MenuItem value="aluno">Aluno</MenuItem>
            <MenuItem value="professor">Professor</MenuItem>
          </TextField>
          
          {error && (
            <Alert severity="error" className={styles.errorAlert}>
              {error}
            </Alert>
          )}
          
          <Button 
            variant="contained" 
            className={styles.registerButton} 
            onClick={handleRegister}
            disabled={!isFormValid || loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Criar Conta'}
          </Button>

          <div className={styles.linksContainer}>
            <span className={styles.text}>Já tem uma conta?</span>
            <Link href="/login" className={styles.link}>
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
