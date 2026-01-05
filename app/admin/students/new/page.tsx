'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/AuthContext';
import StudentService, { CreateStudentDto } from '@/app/services/student.service';
import styles from './styles.module.scss';

export default function NewStudentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateStudentDto>({
    nome: '',
    email: '',
    senha: '',
    telefone: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    // Check authorization
    if (!user || (user.role !== 'professor' && user.role !== 'admin')) {
      router.push('/Login');
      return;
    }
  }, [user, router]);

  function handleChange(field: keyof CreateStudentDto, value: string) {
    setFormData({ ...formData, [field]: value });
    // Clear errors when user types
    setError(null);
    setValidationErrors([]);
  }

  function validateForm(): boolean {
    const errors: string[] = [];

    // Validate using service
    const serviceValidation = StudentService.validateStudentData(formData);
    if (!serviceValidation.valid) {
      errors.push(...serviceValidation.errors);
    }

    // Validate password confirmation
    if (formData.senha !== confirmPassword) {
      errors.push('As senhas não coincidem');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    const result = await StudentService.createStudent(formData);

    if (result.success) {
      // Redirect to list after success
      router.push('/admin/students');
    } else {
      setError(result.error || 'Erro ao criar aluno');
    }

    setLoading(false);
  }

  function handleCancel() {
    router.push('/admin/students');
  }

  return (
    <Box className={styles.newStudentPage}>
      <Paper className={styles.paper}>
        <Box className={styles.header}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleCancel}
            className={styles.backButton}
          >
            Voltar
          </Button>
          <Typography variant="h5" component="h1" className={styles.title}>
            Cadastrar Novo Aluno
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {validationErrors.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            label="Nome Completo"
            value={formData.nome}
            onChange={(e) => handleChange('nome', e.target.value)}
            fullWidth
            required
            disabled={loading}
            helperText="Mínimo 3 caracteres"
          />

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            fullWidth
            required
            disabled={loading}
            helperText="Email será usado para login"
          />

          <TextField
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={formData.senha}
            onChange={(e) => handleChange('senha', e.target.value)}
            fullWidth
            required
            disabled={loading}
            helperText="Mínimo 6 caracteres"
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
            label="Confirmar Senha"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            disabled={loading}
            error={confirmPassword.length > 0 && formData.senha !== confirmPassword}
            helperText={
              confirmPassword.length > 0 && formData.senha !== confirmPassword
                ? 'As senhas não coincidem'
                : ''
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="Telefone (Opcional)"
            value={formData.telefone}
            onChange={(e) => handleChange('telefone', e.target.value)}
            fullWidth
            disabled={loading}
            helperText="Formato: (11) 98765-4321"
          />

          <Box className={styles.actions}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              className={styles.cancelButton}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              className={styles.submitButton}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Aluno'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
