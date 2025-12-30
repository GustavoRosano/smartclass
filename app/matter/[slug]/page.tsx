"use client";

import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import styles from "./styles.module.scss";

import Card from "./Card";
import { classesMock } from "@/app/mocks/classes";

const matterMap: Record<string, string> = {
  "ui-ux": "UI/UX para desenvolvedores",
  react: "React",
  next: "Next",
};

export default function MatterPage() {
  const { slug } = useParams<{ slug: string }>();

  const matterName = matterMap[slug];

  const classesByMatter = useMemo(
    () => classesMock.filter(c => c.matter === matterName),
    [matterName]
  );

  const [activeCard, setActiveCard] = useState(
    classesByMatter[0]?.id
  );

  const activeCardData = classesByMatter.find(
    c => c.id === activeCard
  );

  if (!matterName || classesByMatter.length === 0) {
    return <p>Matéria não encontrada</p>;
  }

  return (
    <div
      className={styles.studentPage}
      style={{ backgroundImage: `url(${activeCardData?.image})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.container}>
          <h1 className={styles.classTitle}>{matterName}</h1>

          <div className={styles.cards}>
            {classesByMatter.map(classe => (
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