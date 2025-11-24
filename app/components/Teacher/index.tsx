import styles from './styles.module.scss';
import { Button } from '@mui/material';

import ClassCard from './ClassCard';

export default function Teacher() {

  const classeCards = [
    {
      classNumber: "Aula 1",
      teacher: "Gustavo",
      title: "User Flow",
      image: "/classes/banner-aula-1.png",
    }
  ];

  return (
    <div className={styles.teacherPage}>
      <div className={styles.container}>
        <h1 className={styles.classTitle}>UI/UX para desenvolvedores</h1>
        <Button variant='contained' className={styles.newClasseButton}>Nova Aula</Button>

        <div className={styles.cards}>
          {classeCards.map((classe, index) => (
            <ClassCard
              key={index}
              classNumber={classe.classNumber}
              teacher={classe.teacher}
              classTitle={classe.title}
              classImage={classe.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}