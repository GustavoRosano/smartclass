"use client";
import styles from "./page.module.scss";

import { useAuth } from "./auth/AuthContext";

import Teacher from "../components/Teacher";
import Student from "../components/Student";

export default function Home() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {user.role === "professor" ? (
          <Teacher />
        ) : (
          <Student />
        )}
      </main>
    </div>
  );
}
