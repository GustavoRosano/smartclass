"use client";

import React, { useState } from "react";
import styles from "./styles.module.scss";

import Card from "./Card";
import { classesMock } from "@/app/mocks/classes";

export default function Student() {
  const [activeCard, setActiveCard] = useState(classesMock[0].id);

  const activeCardData = classesMock.find(c => c.id === activeCard);

  return (
    <div
      className={styles.studentPage}
      style={{ backgroundImage: `url(${activeCardData?.image})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.container}>
          <h1 className={styles.classTitle}>UI/UX para desenvolvedores</h1>

          <div className={styles.cards}>
            {classesMock.map(classe => (
              <Card
                key={classe.id}
                id={classe.id}
                classNumber={classe.classNumber}
                teacher={classe.teacher}
                classTitle={classe.title}
                classImage={classe.image}
                activeCard={activeCard}
                setActiveCard={setActiveCard}
                link={`/aula-${classe.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}