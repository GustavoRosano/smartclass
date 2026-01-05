import React from "react";
import styles from './styles.module.scss';
import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="/">
          <img src='/logo.png' alt="Logo" className={styles.logo} />
        </a>
        <div className={styles.menuLinks}>
          {user?.role === "professor" ? (
            <>
              <a href="/admin" className={styles.menuLink}>
                <AdminPanelSettingsIcon sx={{ marginRight: 1, fontSize: 20 }} />
                Posts
              </a>
              <a href="/admin/users" className={styles.menuLink}>
                <PeopleIcon sx={{ marginRight: 1, fontSize: 20 }} />
                Usuários
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