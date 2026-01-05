import React from "react";
import styles from './styles.module.scss';
import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ArticleIcon from '@mui/icons-material/Article';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/">
          <img src='/logo.png' alt="Logo SmartClass" className={styles.logo} />
        </a>
        
        <div className={styles.menuLinks}>
          {user?.role === "admin" ? (
            <>
              <a href="/admin" className={styles.menuLink} title="Gerenciar Posts">
                <ArticleIcon sx={{ marginRight: 0.5, fontSize: 20 }} />
                Posts
              </a>
              <a href="/admin/users" className={styles.menuLink} title="Gerenciar Usuários">
                <PeopleIcon sx={{ marginRight: 0.5, fontSize: 20 }} />
                Usuários
              </a>
              <a href="/admin/classes" className={styles.menuLink} title="Gerenciar Aulas">
                <SchoolIcon sx={{ marginRight: 0.5, fontSize: 20 }} />
                Aulas
              </a>
            </>
          ) : user?.role === "professor" ? (
            <>
              <a href="/admin" className={styles.menuLink} title="Meus Posts">
                <ArticleIcon sx={{ marginRight: 0.5, fontSize: 20 }} />
                Meus Posts
              </a>
              <a href="/admin/classes" className={styles.menuLink} title="Minhas Aulas">
                <SchoolIcon sx={{ marginRight: 0.5, fontSize: 20 }} />
                Minhas Aulas
              </a>
              <a href="/admin/students" className={styles.menuLink} title="Gerenciar Alunos">
                <PeopleIcon sx={{ marginRight: 0.5, fontSize: 20 }} />
                Alunos
              </a>
            </>
          ) : (
            <>
              <a href="/matter/ui-ux" className={styles.menuLink}>UX/UI</a>
              <a href="/matter/react" className={styles.menuLink}>React</a>
              <a href="/matter/next" className={styles.menuLink}>Next</a>
            </>
          )}
          
          <Button onClick={logout} variant="contained" className={styles.logoutButton}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}