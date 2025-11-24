import styles from './styles.module.scss';
import { Button } from '@mui/material';

import Card from './Card';

export default function Student() {

  const classeCards = [
    {
      classNumber: "Aula 1",
      teacher: "Gustavo",
      title: "User Flow",
      image: "/classes/banner-aula-1.png",
    }
  ];

  return (
    <div className={styles.studentPage}>
      <div className={styles.container}>
        <h1 className={styles.classTitle}>UI/UX para desenvolvedores</h1>

        <div className={styles.cards}>
          {classeCards.map((classe, index) => (
            <Card
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