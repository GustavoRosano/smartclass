"use client";

import Link from "next/link";
import styles from "./styles.module.scss";

export default function Student() {
  return (
    <div
      className={styles.studentPage}
      style={{ backgroundImage: `url(/banner-home.jpg)` }}
    >
      <div className={styles.overlay}>
        <div className={styles.container}>
          <div className={styles.matterCards}>
            <Link href="/matter/ui-ux" className={styles.card}>
              UI/UX para desenvolvedores
            </Link>

            <Link href="/matter/react" className={styles.card}>
              React JS
            </Link>

            <Link href="/matter/next" className={styles.card}>
              Next JS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
