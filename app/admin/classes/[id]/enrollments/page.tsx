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
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import { ArrowBack, CheckCircle, Cancel, Delete } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/app/auth/AuthContext';
import ClassService, { Class, ClassStudent } from '@/app/services/class.service';
import styles from './styles.module.scss';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EnrollmentsManagementPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.id as string;
  const { user } = useAuth();

  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    // Check authorization
    if (!user || (user.role !== 'professor' && user.role !== 'admin')) {
      router.push('/login');
      return;
    }

    if (!classId) {
      setError('ID da aula não fornecido');
      setLoading(false);
      return;
    }

    loadClassData();
  }, [user, router, classId]);

  async function loadClassData() {
    if (!classId) return;

    setLoading(true);
    setError(null);
    
    const result = await ClassService.getClass(classId);
    
    if (result.success && result.class) {
      setClassData(result.class);
    } else {
      setError(result.error || 'Erro ao carregar dados da aula');
    }
    
    setLoading(false);
  }

  async function handleApprove(studentId: string) {
    setProcessing(studentId);
    setError(null);
    setSuccess(null);

    const result = await ClassService.approveEnrollment(classId, studentId);
    
    if (result.success) {
      setSuccess('Matrícula aprovada com sucesso');
      await loadClassData(); // Reload to update status
    } else {
      setError(result.error || 'Erro ao aprovar matrícula');
    }

    setProcessing(null);
  }

  async function handleReject(studentId: string) {
    setProcessing(studentId);
    setError(null);
    setSuccess(null);

    const result = await ClassService.rejectEnrollment(classId, studentId);
    
    if (result.success) {
      setSuccess('Matrícula rejeitada');
      await loadClassData(); // Reload to update status
    } else {
      setError(result.error || 'Erro ao rejeitar matrícula');
    }

    setProcessing(null);
  }

  async function handleRemove(studentId: string) {
    if (!confirm('Tem certeza que deseja remover este aluno da aula?')) {
      return;
    }

    setProcessing(studentId);
    setError(null);
    setSuccess(null);

    const result = await ClassService.removeStudent(classId, studentId);
    
    if (result.success) {
      setSuccess('Aluno removido da aula');
      await loadClassData(); // Reload to update list
    } else {
      setError(result.error || 'Erro ao remover aluno');
    }

    setProcessing(null);
  }

  function handleBack() {
    router.push('/admin/classes');
  }

  function handleTabChange(event: React.SyntheticEvent, newValue: number) {
    setTabValue(newValue);
    setError(null);
    setSuccess(null);
  }

  if (loading) {
    return (
      <Box className={styles.enrollmentsPage}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!classData) {
    return (
      <Box className={styles.enrollmentsPage}>
        <Alert severity="error">Aula não encontrada</Alert>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mt: 2 }}>
          Voltar
        </Button>
      </Box>
    );
  }

  const stats = ClassService.getClassStats(classData);
  const pendingStudents = classData.students.filter(s => s.status === 'pending');
  const approvedStudents = classData.students.filter(s => s.status === 'approved');
  const rejectedStudents = classData.students.filter(s => s.status === 'rejected');

  return (
    <Box className={styles.enrollmentsPage}>
      <Box className={styles.header}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          className={styles.backButton}
        >
          Voltar
        </Button>
      </Box>

      <Paper className={styles.paper}>
        <Typography variant="h5" component="h1" className={styles.title}>
          {classData.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {classData.description}
        </Typography>

        <Box className={styles.statsBar}>
          <Chip label={`${stats.approved}/${classData.maxStudents} aprovados`} color="success" />
          <Chip label={`${stats.pending} pendentes`} color="warning" />
          <Chip label={`${stats.rejected} rejeitados`} color="error" />
          <Chip label={`${stats.availableSlots} vagas disponíveis`} color="info" />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`Pendentes (${pendingStudents.length})`} />
            <Tab label={`Aprovados (${approvedStudents.length})`} />
            <Tab label={`Rejeitados (${rejectedStudents.length})`} />
          </Tabs>
        </Box>

        {/* Pending Tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nome</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Data da Solicitação</strong></TableCell>
                  <TableCell align="right"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                        Nenhuma matrícula pendente
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingStudents.map((student) => (
                    <TableRow key={student.userId}>
                      <TableCell>{student.userName}</TableCell>
                      <TableCell>{student.userEmail}</TableCell>
                      <TableCell>
                        {new Date(student.enrolledAt).toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="success"
                          onClick={() => handleApprove(student.userId)}
                          disabled={processing === student.userId || stats.availableSlots <= 0}
                          title="Aprovar"
                        >
                          <CheckCircle />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleReject(student.userId)}
                          disabled={processing === student.userId}
                          title="Rejeitar"
                        >
                          <Cancel />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Approved Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nome</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Data de Aprovação</strong></TableCell>
                  <TableCell align="right"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                        Nenhum aluno aprovado ainda
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  approvedStudents.map((student) => (
                    <TableRow key={student.userId}>
                      <TableCell>{student.userName}</TableCell>
                      <TableCell>{student.userEmail}</TableCell>
                      <TableCell>
                        {student.approvedAt
                          ? new Date(student.approvedAt).toLocaleString('pt-BR')
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleRemove(student.userId)}
                          disabled={processing === student.userId}
                          title="Remover da aula"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Rejected Tab */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nome</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Data de Rejeição</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rejectedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography variant="body2" color="textSecondary" sx={{ py: 4 }}>
                        Nenhuma matrícula rejeitada
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  rejectedStudents.map((student) => (
                    <TableRow key={student.userId}>
                      <TableCell>{student.userName}</TableCell>
                      <TableCell>{student.userEmail}</TableCell>
                      <TableCell>
                        {student.rejectedAt
                          ? new Date(student.rejectedAt).toLocaleString('pt-BR')
                          : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
}
