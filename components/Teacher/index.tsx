import styles from './styles.module.scss';
import { Button } from '@mui/material';

import ClassCard from './ClassCard';
import { classesMock } from "@/app/mocks/classes";

export default function Teacher() {

  return (
    <div className={styles.teacherPage}>
      <div className={styles.container}>
        <h1 className={styles.classTitle}>UI/UX para desenvolvedores</h1>
        <Button variant='contained' className={styles.newClasseButton}>Nova Aula</Button>

        <div className={styles.cards}>
          {classesMock.map((classe, index) => (
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