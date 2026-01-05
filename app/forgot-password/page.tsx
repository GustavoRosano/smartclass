"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Alert, CircularProgress } from '@mui/material';
import styles from './styles.module.scss';
import { PasswordResetService } from '../services/password-reset.service';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validar email
    if (!email) {
      setError('Email é obrigatório');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    setLoading(true);

    try {
      const result = await PasswordResetService.requestReset(email);

      if (result.success) {
        setSuccess(true);
        if (result.token) {
          // Em desenvolvimento, armazenar token para facilitar teste
          setToken(result.token);
        }
      } else {
        setError(result.error || 'Erro ao solicitar recuperação');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }

  function goToReset() {
    if (token) {
      router.push(`/reset-password?token=${token}`);
    }
  }

  return (
    <div className={styles.forgotPasswordPage}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Recuperar Senha</h1>
          <p className={styles.subtitle}>
            Digite seu email para receber as instruções de recuperação
          </p>

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" className={styles.alert}>
              Se o email existir, as instruções foram enviadas!
              {token && (
                <div className={styles.devMode}>
                  <p><strong>Modo Desenvolvimento:</strong></p>
                  <p>Token: {token.substring(0, 20)}...</p>
                  <Button 
                    size="small" 
                    onClick={goToReset}
                    className={styles.devButton}
                  >
                    Ir para redefinição
                  </Button>
                </div>
              )}
            </Alert>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className={styles.form}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="seu@email.com"
                className={styles.input}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? <CircularProgress size={24} /> : 'Enviar'}
              </Button>

              <Button
                variant="text"
                fullWidth
                onClick={() => router.push('/Login')}
                disabled={loading}
                className={styles.backButton}
              >
                Voltar ao Login
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
