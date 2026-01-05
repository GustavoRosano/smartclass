"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";
import { PostService, Post } from "../services/post.service";
import { useApiState } from "../hooks/useApiState";
import Loading from "../components/UI/Loading";
import ErrorMessage from "../components/UI/ErrorMessage";
import EmptyState from "../components/UI/EmptyState";
import { Button, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import styles from "./styles.module.scss";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: posts, loading, error, execute } = useApiState<Post[]>();

  useEffect(() => {
    if (!user || (user.role !== 'professor' && user.role !== 'admin')) {
      router.push('/');
      return;
    }
    loadPosts();
  }, [user]);

  async function loadPosts() {
    // Admin vê todos os posts, professor vê apenas os seus
    const userId = user?.role === 'professor' ? user.id : undefined;
    await execute(() => PostService.getAll(false, userId));
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Confirma exclusão de "${title}"?`)) return;
    
    try {
      await PostService.delete(id);
      loadPosts();
    } catch (error) {
      alert('Erro ao excluir post');
    }
  }

  if (loading) return <Loading message="Carregando posts..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadPosts} />;
  if (!posts || posts.length === 0) {
    return (
      <div className={styles.adminPage}>
        <div className={styles.container}>
          <EmptyState
            title="Nenhum post cadastrado"
            message="Comece criando seu primeiro post"
            actionLabel="Criar Post"
            onAction={() => router.push('/new-class')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Gerenciar Posts</h1>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => router.push('/new-class')}
            className={styles.newButton}
          >
            Novo Post
          </Button>
        </div>

        <div className={styles.postList}>
          {posts.map(post => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postInfo}>
                <h3>{post.title}</h3>
                <div className={styles.postMeta}>
                  <span className={post.posted ? styles.published : styles.draft}>
                    {post.posted ? '✓ Publicado' : '○ Rascunho'}
                  </span>
                  <span className={styles.date}>ID: {post.id}</span>
                </div>
              </div>
              <div className={styles.actions}>
                <IconButton 
                  onClick={() => router.push(`/teacher-edit-class?id=${post.id}`)}
                  title="Editar"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleDelete(post.id, post.title)} 
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
