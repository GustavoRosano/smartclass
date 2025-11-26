import React from "react";
import styles from './styles.module.scss';

export default function Header() {

  return (
    <header className={styles.header}>
      <div className={styles.container}>Header</div>
    </header>
  );
}