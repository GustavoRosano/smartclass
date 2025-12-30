import React from "react";
import styles from './styles.module.scss';

import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@mui/material";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img src='/logo.png' alt="Logo" className={styles.logo} />
        <div className={styles.menuLinks}>
          {user?.role === "professor" ? (
            <></>
          ) : (
            <>
              <a href="#" className={styles.menuLink}>UX/UI</a>
              <a href="#" className={styles.menuLink}>React</a>
              <a href="#" className={styles.menuLink}>Next</a>
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