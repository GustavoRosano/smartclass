'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Skeleton
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth/AuthContext';
import StudentService, { Student } from '@/app/services/student.service';
import EmptyState from '@/app/components/UI/EmptyState';
import styles from './styles.module.scss';

export default function StudentsListPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Check authorization
    if (!user || (user.role !== 'professor' && user.role !== 'admin')) {
      router.push('/login');
      return;
    }

    loadStudents();
  }, [user, router]);

  async function loadStudents() {
    setLoading(true);
    setError(null);
    
    const result = await StudentService.listStudents();
    
    if (result.success) {
      setStudents(result.students || []);
    } else {
      setError(result.error || 'Erro ao carregar alunos');
    }
    
    setLoading(false);
  }

  function handleCreateNew() {
    router.push('/admin/students/new');
  }

  function handleEdit(studentId: string) {
    router.push(`/admin/students/${studentId}/edit`);
  }

  function handleView(studentId: string) {
    router.push(`/admin/students/${studentId}`);
  }

  function handleDeleteClick(student: Student) {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!studentToDelete) return;

    setDeleting(true);
    const result = await StudentService.deleteStudent(studentToDelete._id);
    
    if (result.success) {
      // Remove from list
      setStudents(students.filter(s => s._id !== studentToDelete._id));
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    } else {
      setError(result.error || 'Erro ao remover aluno');
    }
    
    setDeleting(false);
  }

  function handleDeleteCancel() {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  }

  // Loading State com Skeleton
  if (loading) {
    return (
      <Box className={styles.studentsPage}>
        <Box className={styles.header}>
          <Skeleton variant="text" width={250} height={50} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </Box>

        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Telefone</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3].map((n) => (
                <TableRow key={n}>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  // Empty State (lista vazia, mas SEM erro)
  if (!error && students.length === 0) {
    return (
      <Box className={styles.studentsPage}>
        <Box className={styles.header}>
          <Typography variant="h4" component="h1" className={styles.title}>
            Gerenciar Alunos
          </Typography>
        </Box>

        <EmptyState
          title="Nenhum aluno cadastrado"
          message="Comece cadastrando o primeiro aluno da plataforma"
          actionLabel="Cadastrar Novo Aluno"
          onAction={handleCreateNew}
        />
      </Box>
    );
  }

  return (
    <Box className={styles.studentsPage}>
      <Box className={styles.header}>
        <Typography variant="h4" component="h1" className={styles.title}>
          Gerenciar Alunos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateNew}
          className={styles.createButton}
        >
          Novo Aluno
        </Button>
      </Box>

      {/* Alert fixo no topo (não sobreposto) */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Telefone</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id} hover>
                <TableCell>{student.nome}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.telefone || '—'}</TableCell>
                <TableCell>
                  <Chip
                    label={student.isActive ? 'Ativo' : 'Inativo'}
                    color={student.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Visualizar">
                    <IconButton
                      size="small"
                      onClick={() => handleView(student._id)}
                      color="primary"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {user?.role === 'admin' && (
                    <>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(student._id)}
                          color="primary"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Remover">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(student)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>⚠️ Confirmar Remoção</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja remover o aluno <strong>{studentToDelete?.nome}</strong>?
            <br /><br />
            <strong>Email:</strong> {studentToDelete?.email}<br />
            <br />
            Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? 'Removendo...' : 'Confirmar Remoção'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
