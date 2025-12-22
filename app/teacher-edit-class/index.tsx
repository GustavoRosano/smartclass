import React from "react";
import styles from './styles.module.scss';
import { ClassContent } from "../types/ClassContent";

type Props = {
  classData: ClassContent;
};

export default function TeacherEditClass({ classData }: Props) {

  return (
    <div className={styles.editClassContainer}>
      <div className={styles.container}>
        <h1>{classData.title}</h1>
        <span>{classData.classNumber} - {classData.teacher}</span>

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
  );
}