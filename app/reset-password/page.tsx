"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TextField, Button, Alert, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from './styles.module.scss';
import { PasswordResetService } from '../services/password-reset.service';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    
    if (!tokenParam) {
      setError('Token não fornecido');
      setValidating(false);
      return;
    }

    setToken(tokenParam);
    validateToken(tokenParam);
  }, [searchParams]);

  async function validateToken(tokenToValidate: string) {
    try {
      const result = await PasswordResetService.validateToken(tokenToValidate);
      
      if (result.valid) {
        setTokenValid(true);
        setEmail(result.email || '');
      } else {
        setError(result.error || 'Token inválido ou expirado');
        setTokenValid(false);
      }
    } catch (err) {
      setError('Erro ao validar token');
      setTokenValid(false);
    } finally {
      setValidating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // Validações
    if (!newPassword || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const result = await PasswordResetService.resetPassword(token, newPassword);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(result.error || 'Erro ao redefinir senha');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }

  if (validating) {
    return (
      <div className={styles.resetPasswordPage}>
        <div className={styles.container}>
          <div className={styles.card}>
            <CircularProgress />
            <p>Validando token...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className={styles.resetPasswordPage}>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Token Inválido</h1>
            <Alert severity="error" className={styles.alert}>
              {error || 'Este link de recuperação é inválido ou já expirou'}
            </Alert>
            <Button
              variant="contained"
              fullWidth
              onClick={() => router.push('/forgot-password')}
              className={styles.submitButton}
            >
              Solicitar Novo Token
            </Button>
            <Button
              variant="text"
              fullWidth
              onClick={() => router.push('/login')}
              className={styles.backButton}
            >
              Voltar ao Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resetPasswordPage}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Redefinir Senha</h1>
          {email && (
            <p className={styles.subtitle}>
              Criando nova senha para: <strong>{email}</strong>
            </p>
          )}

          {error && (
            <Alert severity="error" className={styles.alert}>
              {error}
            </Alert>
          )}

          {success ? (
            <Alert severity="success" className={styles.alert}>
              Senha redefinida com sucesso! Redirecionando para o login...
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <TextField
                fullWidth
                label="Nova Senha"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                placeholder="Mínimo 6 caracteres"
                className={styles.input}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Confirmar Senha"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                placeholder="Digite a senha novamente"
                className={styles.input}
              />

              <div className={styles.passwordHints}>
                <p className={newPassword.length >= 6 ? styles.valid : ''}>
                  ✓ Mínimo 6 caracteres
                </p>
                <p className={newPassword === confirmPassword && confirmPassword ? styles.valid : ''}>
                  ✓ Senhas coincidem
                </p>
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? <CircularProgress size={24} /> : 'Redefinir Senha'}
              </Button>

              <Button
                variant="text"
                fullWidth
                onClick={() => router.push('/login')}
                disabled={loading}
                className={styles.backButton}
              >
                Cancelar
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className={styles.resetPasswordPage}>
        <div className={styles.container}>
          <div className={styles.card}>
            <CircularProgress />
          </div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
