'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Add, Edit, Delete, People, CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/AuthContext';
import ClassService, { Class } from '@/app/services/class.service';
import styles from './styles.module.scss';

export default function ClassesListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Check authorization
    if (!user || (user.role !== 'professor' && user.role !== 'admin')) {
      router.push('/login');
      return;
    }

    loadClasses();
  }, [user, router]);

  async function loadClasses() {
    console.log('[ClassesPage] 🔄 Carregando aulas...');
    setLoading(true);
    setError(null);
    
    // Load only teacher's classes
    const result = await ClassService.listClasses(true);
    console.log('[ClassesPage] 📦 Resultado:', result);
    
    if (result.success && result.classes) {
      console.log('[ClassesPage] ✅ Aulas carregadas:', result.classes.length);
      setClasses(result.classes);
    } else {
      console.error('[ClassesPage] ❌ Erro ao carregar aulas:', result.error);
      setError(result.error || 'Erro ao carregar aulas');
    }
    
    setLoading(false);
  }

  function handleCreateNew() {
    router.push('/admin/classes/new');
  }

  function handleEdit(classId: string) {
    router.push(`/admin/classes/${classId}/edit`);
  }

  function handleManageEnrollments(classId: string) {
    router.push(`/admin/classes/${classId}/enrollments`);
  }

  function handleDeleteClick(classData: Class) {
    setClassToDelete(classData);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!classToDelete) return;

    try {
      setDeleting(true);
      
      const result = await ClassService.deleteClass(classToDelete._id);
      
      if (result.success) {
        // ✅ CORREÇÃO: Atualizar estado local IMEDIATAMENTE
        setClasses(prevClasses => prevClasses.filter(c => c._id !== classToDelete._id));
        
        console.log('[ClassesPage] ✅ Aula removida da UI');
        
        setDeleteDialogOpen(false);
        setClassToDelete(null);
      } else {
        setError(result.error || 'Erro ao remover aula');
      }
    } catch (err: any) {
      console.error('[ClassesPage] ❌ Erro ao deletar:', err);
      setError(err.message || 'Erro ao remover aula');
    } finally {
      setDeleting(false);
    }
  }

  function handleDeleteCancel() {
    setDeleteDialogOpen(false);
    setClassToDelete(null);
  }

  // Loading State
  if (loading) {
    return (
      <Box className={styles.classesPage}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box className={styles.classesPage}>
        <Box className={styles.header}>
          <Typography variant="h4" component="h1" className={styles.title}>
            Minhas Aulas
          </Typography>
        </Box>

        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>

        <Box display="flex" justifyContent="center" mt={4}>
          <Button variant="contained" onClick={loadClasses}>
            Tentar Novamente
          </Button>
        </Box>
      </Box>
    );
  }

  // Empty State
  if (classes.length === 0) {
    return (
      <Box className={styles.classesPage}>
        <Box className={styles.header}>
          <Typography variant="h4" component="h1" className={styles.title}>
            Minhas Aulas
          </Typography>
        </Box>

        <Paper className={styles.emptyState}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Nenhuma aula cadastrada
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Crie sua primeira aula para começar a gerenciar alunos
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateNew}
            className={styles.createButton}
          >
            Criar Primeira Aula
          </Button>
        </Paper>
      </Box>
    );
  }

  // Success State
  return (
    <Box className={styles.classesPage}>
      <Box className={styles.header}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Minhas Aulas
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateNew}
          className={styles.createButton}
        >
          Nova Aula
        </Button>
      </Box>

      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}
      >
        {classes.map((classData) => {
            const stats = ClassService.getClassStats(classData);
            
            return (
              <Card key={classData._id} className={styles.classCard}>
                <CardContent>
                  <Typography variant="h6" component="h2" className={styles.className}>
                      {classData.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className={styles.description}>
                      {classData.description.length > 100
                        ? `${classData.description.substring(0, 100)}...`
                        : classData.description}
                    </Typography>

                    <Box className={styles.stats}>
                      <Chip
                        icon={<People />}
                        label={`${stats.approved}/${classData.maxStudents} alunos`}
                        size="small"
                        color={stats.approved >= classData.maxStudents ? 'error' : 'primary'}
                      />
                      {stats.pending > 0 && (
                        <Chip
                          label={`${stats.pending} pendentes`}
                          size="small"
                          color="warning"
                        />
                      )}
                    </Box>

                    {classData.startDate && (
                      <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                        Início: {new Date(classData.startDate).toLocaleDateString('pt-BR')}
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions className={styles.actions}>
                    <Button
                      size="small"
                      startIcon={<CheckCircle />}
                      onClick={() => handleManageEnrollments(classData._id)}
                    >
                      Matrículas
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEdit(classData._id)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteClick(classData)}
                      color="error"
                    >
                      Remover
                    </Button>
                  </CardActions>
                </Card>
            );
          })}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar Remoção</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja remover a aula <strong>{classToDelete?.name}</strong>?
            Esta ação não pode ser desfeita e todos os alunos matriculados perderão acesso.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            Remover
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    );
  }
