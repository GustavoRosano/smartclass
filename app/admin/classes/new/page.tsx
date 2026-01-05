'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/AuthContext';
import ClassService, { CreateClassDto } from '@/app/services/class.service';
import styles from './styles.module.scss';

export default function NewClassPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateClassDto>({
    name: '',
    description: '',
    maxStudents: 30,
    startDate: '',
    endDate: ''
  });
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

  function handleChange(field: keyof CreateClassDto, value: string | number) {
    setFormData({ ...formData, [field]: value });
    // Clear errors when user types
    setError(null);
    setValidationErrors([]);
  }

  function validateForm(): boolean {
    const serviceValidation = ClassService.validateClassData(formData);
    setValidationErrors(serviceValidation.errors);
    return serviceValidation.valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    // Remove empty optional fields
    const dataToSubmit: CreateClassDto = {
      name: formData.name,
      description: formData.description
    };

    if (formData.maxStudents && formData.maxStudents > 0) {
      dataToSubmit.maxStudents = formData.maxStudents;
    }
    if (formData.startDate) {
      dataToSubmit.startDate = formData.startDate;
    }
    if (formData.endDate) {
      dataToSubmit.endDate = formData.endDate;
    }

    const result = await ClassService.createClass(dataToSubmit);

    if (result.success) {
      // Redirect to class details or list
      router.push('/admin/classes');
    } else {
      setError(result.error || 'Erro ao criar aula');
    }

    setLoading(false);
  }

  function handleCancel() {
    router.push('/admin/classes');
  }

  return (
    <Box className={styles.newClassPage}>
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
            Criar Nova Aula
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
            label="Nome da Aula"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            fullWidth
            required
            disabled={loading}
            helperText="Mínimo 3 caracteres"
          />

          <TextField
            label="Descrição"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
            required
            multiline
            rows={4}
            disabled={loading}
            helperText="Mínimo 10 caracteres"
          />

          <TextField
            label="Máximo de Alunos"
            type="number"
            value={formData.maxStudents}
            onChange={(e) => handleChange('maxStudents', parseInt(e.target.value))}
            fullWidth
            disabled={loading}
            InputProps={{ inputProps: { min: 1, max: 100 } }}
            helperText="Entre 1 e 100 alunos"
          />

          <TextField
            label="Data de Início (Opcional)"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            fullWidth
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Data de Término (Opcional)"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            fullWidth
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            helperText={formData.startDate ? 'Deve ser posterior à data de início' : ''}
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
              {loading ? 'Criando...' : 'Criar Aula'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
