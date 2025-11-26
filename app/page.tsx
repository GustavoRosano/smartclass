"use client";
import styles from "./page.module.scss";

import { useAuth } from "./auth/AuthContext";
import Button from "@mui/material/Button";

import Teacher from "../components/Teacher";
import Student from "../components/Student";

export default function Home() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* <Button onClick={logout} variant="contained" style={{ backgroundColor: "#d9534f", marginTop: "20px" }}>
          Sair
        </Button> */}
        {user.role === "professor" ? (
          <Teacher />
        ) : (
          <Student />
        )}
      </main>
    </div>
  );
}
