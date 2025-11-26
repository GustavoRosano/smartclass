import React, { useState } from "react";
import styles from './styles.module.scss';

import Card from './Card';

// TODO: Transformar cards em dinâmicos

const classeCards = [
  {
    id: "12354",
    classNumber: "Aula 1",
    teacher: "Gustavo",
    title: "User Flow",
    image: "/classes/banner-aula-1.png",
  },
  {
    id: "012365",
    classNumber: "Aula 2",
    teacher: "Gustavo",
    title: "User Flow",
    image: "/classes/banner-aula-1.png",
  },
  {
    id: "123146",
    classNumber: "Aula 3",
    teacher: "Gustavo",
    title: "User Flow",
    image: "/classes/banner-aula-1.png",
  },
  {
    id: "5461423",
    classNumber: "Aula 4",
    teacher: "Gustavo",
    title: "User Flow",
    image: "/classes/banner-aula-1.png",
  },
  {
    id: "214654",
    classNumber: "Aula 5",
    teacher: "Gustavo",
    title: "User Flow",
    image: "/classes/banner-aula-1.png",
  },
];

export default function Student() {
  const [activeCard, setActiveCard] = useState(classeCards[0].id);

  const activeCardData = classeCards.find(c => c.id === activeCard);

  return (
    <div className={styles.studentPage} style={{ backgroundImage: `url(${activeCardData?.image})` }}>
      <div className={styles.overlay}>
        <div className={styles.container}>
          <h1 className={styles.classTitle}>UI/UX para desenvolvedores</h1>

          <div className={styles.cards}>
            {classeCards.map((classe, index) => (
              <Card
                key={classe.id}
                id={classe.id}
                classNumber={classe.classNumber}
                teacher={classe.teacher}
                classTitle={classe.title}
                classImage={classe.image}
                activeCard={activeCard}
                setActiveCard={setActiveCard}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}