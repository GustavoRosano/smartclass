import React from "react";
import styles from './styles.module.scss';

export default function Header() {

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img src='/logo.png' alt="Logo" className={styles.logo} />
        <div className={styles.menuLinks}>
          <a href="#" className={styles.menuLink}>UX/UI</a>
          <a href="#" className={styles.menuLink}>React</a>
          <a href="#" className={styles.menuLink}>Next</a>
        </div>
      </div>
    </header>
  );
}