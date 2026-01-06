"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";
import { PostService, Post } from "../services/post.service";
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || (user.role !== 'professor' && user.role !== 'admin')) {
      router.push('/');
      return;
    }
    loadPosts();
  }, [user]);

  async function loadPosts() {
    try {
      setLoading(true);
      setError(null);
      // Admin vê todos os posts, professor vê apenas os seus
      const userId = user?.role === 'professor' ? user.id : undefined;
      const data = await PostService.getAll(false, userId);
      setPosts(data);
    } catch (err: any) {
      console.error('[AdminPage] ❌ Erro ao carregar posts:', err);
      setError(err.message || 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Confirma exclusão de "${title}"?`)) return;
    
    try {
      setDeletingId(id);
      
      await PostService.delete(id);
      
      // ✅ CORREÇÃO: Atualizar estado local IMEDIATAMENTE
      setPosts(prevPosts => prevPosts.filter(p => p.id !== id));
      
      console.log('[AdminPage] ✅ Post removido da UI');
      
    } catch (error: any) {
      console.error('[AdminPage] ❌ Erro ao excluir:', error);
      alert(error.message || 'Erro ao excluir post');
    } finally {
      setDeletingId(null);
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