"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../auth/AuthContext";
import { UserService, UserProfile } from "../../services/user.service";
import { useApiState } from "../../hooks/useApiState";
import Loading from "../../components/UI/Loading";
import ErrorMessage from "../../components/UI/ErrorMessage";
import EmptyState from "../../components/UI/EmptyState";
import { Button, IconButton, Chip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import styles from "./styles.module.scss";

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: users, loading, error, execute } = useApiState<UserProfile[]>();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    loadUsers();
  }, [user]);

  async function loadUsers() {
    await execute(() => UserService.getAll());
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Confirma exclusão de "${name}"?`)) return;
    
    try {
      await UserService.delete(id);
      loadUsers();
    } catch (error) {
      alert('Erro ao excluir usuário');
    }
  }

  if (loading) return <Loading message="Carregando usuários..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadUsers} />;
  if (!users || users.length === 0) {
    return (
      <div className={styles.usersPage}>
        <div className={styles.container}>
          <EmptyState
            title="Nenhum usuário cadastrado"
            message="Comece criando o primeiro usuário"
            actionLabel="Criar Usuário"
            onAction={() => alert('Funcionalidade em desenvolvimento')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.usersPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gerenciar Usuários</h1>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => alert('Funcionalidade em desenvolvimento')}
            className={styles.newButton}
          >
            Novo Usuário
          </Button>
        </div>

        <div className={styles.userList}>
          {users.map(user => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.userInfo}>
                <h3>{user.name}</h3>
                <p className={styles.email}>{user.email}</p>
                <div className={styles.userMeta}>
                  <Chip 
                    label={user.role === 'professor' ? 'Professor' : 'Aluno'} 
                    color={user.role === 'professor' ? 'primary' : 'default'}
                    size="small"
                  />
                  {user.matter && <span className={styles.matter}>{user.matter}</span>}
                </div>
              </div>
              <div className={styles.actions}>
                <IconButton 
                  onClick={() => handleDelete(user.id, user.name)} 
                  color="error"
                  title="Excluir"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
