"use client";

import styles from './styles.module.scss';
import { ClassContent } from "../types/ClassContent";

type Props = {
  classData: ClassContent;
};

export default function StudentClass({ classData }: Props) {

  console.log('classData: ', classData);


  return (
    <div className={styles.studentClass}>
      <div className={styles.container}>
        <div className={styles.header}>
          <img src={classData.image} alt={`banner - ${classData.title}`} className={styles.classBanner} />
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>{classData.title}</h1>
            <span className={styles.class}>{classData.classNumber} &nbsp; - &nbsp; {classData.teacher}</span>
          </div>
        </div>

        <div className={styles.content}>
          {classData.content.map((item, index) => {
            if (item.type === "title") {
              return <h2 key={index}>{item.value}</h2>;
            }

            if (item.type === "subtitle") {
              return <h3 key={index}>{item.value}</h3>;
            }

            if (item.type === "text") {
              return <p key={index}>{item.value}</p>;
            }

            if (item.type === "link") {
              return (
                <a key={index} href={item.value} target="_blank">
                  {item.value}
                </a>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}