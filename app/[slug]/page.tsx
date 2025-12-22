"use client";

import styles from "./styles.module.scss";
import { useParams } from "next/navigation";
import { useAuth } from "../auth/AuthContext";

import { classesMock } from "../mocks/classes";
import StudentClass from "../student-class";
import TeacherEditClass from "../teacher-edit-class";

export default function ContentPage() {
  const { user } = useAuth();
  const params = useParams();

  if (!user) return null;

  const slug = params.slug as string;
  const classId = slug.replace("aula-", "");
  const classData = classesMock.find(c => c.id === classId);

  if (!classData) return null;

  return (
    <div className={styles.contentPage}>
      <div className={styles.container}>
        {user.role === "professor" ? (
          <TeacherEditClass classData={classData} />
        ) : (
          <StudentClass classData={classData} />
        )}
      </div>
    </div>
  );
}