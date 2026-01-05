"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./styles.module.scss";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClassCard from "./ClassCard";
import { useAuth } from "@/app/auth/AuthContext";
import EmptyState from "@/app/components/UI/EmptyState";
import Loading from "@/app/components/UI/Loading";
import ErrorMessage from "@/app/components/UI/ErrorMessage";
import { useRouter } from "next/navigation";
import { PostService, Post } from "@/app/services/post.service";

export default function Teacher() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, [user]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Admin vê todos os posts, professor vê apenas os seus
      const userId = user?.role === 'professor' ? user.id : undefined;
      const data = await PostService.getAll(false, userId);
      setPosts(data);
    } catch (err) {
      console.error('Erro ao carregar posts:', err);
      setError('Erro ao carregar posts. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== "professor" && user.role !== "admin")) return null;

  // Admin vê todos os posts carregados, professor já tem filtro no loadPosts
  const postsByTeacher = posts;

  // Busca funcional em tempo real
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return postsByTeacher;
    
    const term = searchTerm.toLowerCase();
    return postsByTeacher.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term)
    );
  }, [postsByTeacher, searchTerm]);

  if (loading) return <Loading message="Carregando aulas..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadPosts} />;

  return (
    <div className={styles.teacherPage}>
      <div className={styles.container}>
        <h1 className={styles.classTitle}>{user.matter}</h1>

        <div className={styles.actions}>
          <TextField
            variant="outlined"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título ou conteúdo..."
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <a href="/new-class" className={styles.newClasseButton}>
            Nova Aula
          </a>
        </div>

        <div className={styles.cards}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <ClassCard
                key={post.id}
                id={post.id}
                classNumber={user.matter || 'Matéria'}
                teacher={user.name || 'Professor'}
                classTitle={post.title}
                classImage={post.urlImage || '/banner-home.jpg'}
                link={`/teacher-edit-class?id=${post.id}`}
                onDelete={loadPosts}
              />
            ))
          ) : (
            <EmptyState
              title="Nenhuma aula encontrada"
              message={searchTerm ? `Nenhum resultado para "${searchTerm}"` : "Nenhuma aula cadastrada"}
              actionLabel={searchTerm ? undefined : "Criar Primeira Aula"}
              onAction={searchTerm ? undefined : () => router.push('/new-class')}
            />
          )}
        </div>
      </div>
    </div>
  );
}