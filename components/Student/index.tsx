"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TextField, InputAdornment, CircularProgress, Alert, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAuth } from "@/app/auth/AuthContext";
import styles from "./styles.module.scss";
import ClassService, { Class } from "../../app/services/class.service";

export default function Student() {
  const { user } = useAuth();
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[Student] 🔄 Componente montado');
    console.log('[Student] 👤 Usuário:', user);
    
    if (!user) {
      console.warn('[Student] ⚠️ Usuário não autenticado. Redirecionando...');
      router.push('/login');
      return;
    }
    
    if (user.role !== 'aluno') {
      console.warn('[Student] ⚠️ Usuário não é aluno. Redirecionando...');
      router.push('/');
      return;
    }
    
    loadClasses();
  }, [user, router]);

  async function loadClasses() {
    try {
      console.log('[Student] 📞 Iniciando carregamento de aulas...');
      setLoading(true);
      setError(null);
      
      const result = await ClassService.listClasses(false);
      
      console.log('[Student] 📦 Resultado da API:', result);
      
      if (result.success && result.classes) {
        console.log('[Student] ✅ Aulas carregadas:', result.classes.length);
        setClasses(result.classes);
        setError(null);
      } else {
        console.error('[Student] ❌ Erro ao carregar aulas:', result.error);
        setError(result.error || "Erro ao carregar aulas. Tente novamente.");
      }
    } catch (err: any) {
      console.error("[Student] ❌ Exceção ao carregar aulas:", err);
      setError(err.message || "Erro ao carregar aulas. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  const filteredClasses = useMemo(() => {
    if (!searchTerm.trim()) return classes;
    
    const term = searchTerm.toLowerCase();
    return classes.filter(cls => 
      cls.name?.toLowerCase().includes(term) ||
      cls.description?.toLowerCase().includes(term) ||
      cls.teacherName?.toLowerCase().includes(term)
    );
  }, [classes, searchTerm]);

  if (!user || user.role !== 'aluno') {
    return null;
  }

  return (
    <div
      className={styles.studentPage}
      style={{ backgroundImage: `url(/banner-home.jpg)` }}
    >
      <div className={styles.overlay}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Aulas Disponíveis</h1>

          <div className={styles.searchContainer}>
            <TextField
              fullWidth
              placeholder="Buscar por nome, descrição ou professor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {loading && (
            <div className={styles.loadingContainer}>
              <CircularProgress sx={{ color: '#fff' }} />
              <p style={{ color: '#fff', marginTop: '1rem' }}>Carregando aulas...</p>
            </div>
          )}

          {error && !loading && (
            <div className={styles.errorContainer}>
              <Alert 
                severity="error" 
                sx={{ 
                  marginBottom: 2,
                  backgroundColor: 'rgba(211, 47, 47, 0.9)',
                  color: '#fff',
                  maxWidth: '600px'
                }}
              >
                {error}
              </Alert>
              <Button 
                variant="contained" 
                startIcon={<RefreshIcon />}
                onClick={loadClasses}
                sx={{ 
                  backgroundColor: '#667eea',
                  '&:hover': { backgroundColor: '#764ba2' }
                }}
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          {!loading && !error && filteredClasses.length === 0 && (
            <div className={styles.emptyState}>
              <p style={{ color: '#fff', fontSize: '1.2rem' }}>
                {searchTerm.trim() 
                  ? `Nenhuma aula encontrada para "${searchTerm}"`
                  : "Você ainda não está matriculado em nenhuma aula"}
              </p>
              {searchTerm.trim() && (
                <Button 
                  variant="outlined" 
                  onClick={() => setSearchTerm("")}
                  sx={{ 
                    marginTop: 2,
                    color: '#fff',
                    borderColor: '#fff',
                    '&:hover': { borderColor: '#667eea', backgroundColor: 'rgba(102, 126, 234, 0.1)' }
                  }}
                >
                  Limpar Busca
                </Button>
              )}
            </div>
          )}

          {!loading && !error && filteredClasses.length > 0 && (
            <div className={styles.classesGrid}>
              {filteredClasses.map((cls) => (
                <div key={cls._id} className={styles.classCard}>
                  <div className={styles.cardHeader}>
                    <h3>{cls.name}</h3>
                    <span className={styles.teacher}>Prof. {cls.teacherName}</span>
                  </div>
                  
                  <p className={styles.description}>
                    {cls.description && cls.description.length > 100
                      ? `${cls.description.substring(0, 100)}...`
                      : cls.description || "Sem descrição"}
                  </p>
                  
                  <div className={styles.cardFooter}>
                    <span className={styles.students}>
                      👥 {cls.students?.filter(s => s.status === 'approved').length || 0} aluno(s)
                    </span>
                    
                    <Link href={`/student-class?id=${cls._id}`}>
                      <button className={styles.viewButton}>Ver Aula</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
