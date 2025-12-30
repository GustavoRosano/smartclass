"use client";

import styles from "./styles.module.scss";
import { Button, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import ClassCard from "./ClassCard";
import { classesMock } from "@/app/mocks/classes";
import { useAuth } from "@/app/auth/AuthContext";

export default function Teacher() {
  const { user } = useAuth();

  if (!user || user.role !== "professor") return null;

  const classesByTeacher = classesMock.filter(
    classe => classe.matter === user.matter
  );

  return (
    <div className={styles.teacherPage}>
      <div className={styles.container}>
        <h1 className={styles.classTitle}>{user.matter}</h1>

        <div className={styles.actions}>
          <TextField
            variant="outlined"
            className={styles.searchInput}
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
          {classesByTeacher.map(classe => (
            <ClassCard
              key={classe.id}
              id={classe.id}
              classNumber={classe.classNumber}
              teacher={classe.teacher}
              classTitle={classe.title}
              classImage={classe.image}
              link={`/aula-${classe.id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}