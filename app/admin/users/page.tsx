"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../auth/AuthContext";
import Loading from "../../components/UI/Loading";
import ErrorMessage from "../../components/UI/ErrorMessage";
import EmptyState from "../../components/UI/EmptyState";
import { 
  Button, 
  IconButton, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  Alert 
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import styles from "./styles.module.scss";
import api from "../../lib/axios";

type UserProfile = {
  _id: string;
  name: string;
  email: string;
  role: 'professor' | 'aluno' | 'admin';
  matter?: string;
  isActive: boolean;
};

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState({ professors: 0, students: 0, total: 0 });

  useEffect(() => {
    // Apenas Admin pode acessar
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    loadUsers();
  }, [user, router]);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);

      // Admin vê TODOS os usuários (professores e alunos)
      const response = await api.get('/users', {
        headers: {
          'x-user-id': user?.id || user?.email
        }
      });
      
      // Filtrar para NÃO exibir outros admins
      const filteredUsers = response.data.filter((u: UserProfile) => u.role !== 'admin');
      
      setUsers(filteredUsers);

      // Calcular estatísticas
      setStats({
        professors: filteredUsers.filter((u: UserProfile) => u.role === 'professor').length,
        students: filteredUsers.filter((u: UserProfile) => u.role === 'aluno').length,
        total: filteredUsers.length
      });

    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err);
      setError(err.response?.data?.message || 'Erro ao carregar usuários. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteClick(userData: UserProfile) {
    setUserToDelete(userData);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!userToDelete) return;

    try {
      await api.delete(`/users/${userToDelete._id}`, {
        headers: {
          'x-user-id': user?.id || user?.email
        }
      });
      
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao excluir usuário');
      console.error(error);
    }
  }

  function handleEdit(userId: string) {
    router.push(`/admin/users/${userId}/edit`);
  }

  function handleCreateNew() {
    router.push('/admin/users/new');
  }

  if (loading) return <Loading message="Carregando usuários..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadUsers} />;
  
  if (users.length === 0) {
    return (
      <div className={styles.usersPage}>
        <div className={styles.container}>
          <EmptyState
            title="Nenhum usuário cadastrado"
            message="Comece criando o primeiro usuário"
            actionLabel="Criar Usuário"
            onAction={handleCreateNew}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.usersPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <PeopleIcon sx={{ fontSize: 40, color: 'var(--primary-color)' }} />
            <div>
              <h1 className={styles.title}>Gerenciar Usuários</h1>
              <p className={styles.subtitle}>
                Total: {stats.total} | Professores: {stats.professors} | Alunos: {stats.students}
              </p>
            </div>
          </div>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            className={styles.newButton}
          >
            Novo Usuário
          </Button>
        </div>

        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Visualização Administrativa:</strong> Você está vendo todos os professores e alunos do sistema. 
          Outros administradores não são listados por segurança.
        </Alert>

        <div className={styles.userList}>
          {users.map(userData => (
            <div key={userData._id} className={styles.userCard}>
              <div className={styles.userInfo}>
                <h3>{userData.name}</h3>
                <p className={styles.email}>{userData.email}</p>
                <div className={styles.userMeta}>
                  <Chip 
                    label={userData.role === 'professor' ? '👨‍🏫 Professor' : '🎓 Aluno'} 
                    color={userData.role === 'professor' ? 'primary' : 'default'}
                    size="small"
                  />
                  {userData.matter && (
                    <Chip 
                      label={userData.matter} 
                      variant="outlined"
                      size="small"
                    />
                  )}
                  <Chip
                    label={userData.isActive ? '✅ Ativo' : '❌ Inativo'}
                    color={userData.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </div>
              </div>
              <div className={styles.actions}>
                <IconButton 
                  onClick={() => handleEdit(userData._id)} 
                  color="primary"
                  title="Editar"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleDeleteClick(userData)} 
                  color="error"
                  title="Excluir"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </div>

        {/* Dialog de Confirmação de Exclusão */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>⚠️ Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja excluir o usuário <strong>{userToDelete?.name}</strong>?
              <br /><br />
              <strong>Email:</strong> {userToDelete?.email}<br />
              <strong>Role:</strong> {userToDelete?.role}<br />
              <br />
              Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Confirmar Exclusão
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
