import styles from './styles.module.scss';

export default function Card({ id, classNumber, teacher, classTitle, classImage, activeCard, setActiveCard, link  }: any) {


 const handleActiveCard = () => {
  setActiveCard(id);
 }

  return (
    <div key={id} onClick={handleActiveCard} className={`${styles.card} ${activeCard === id ? styles.active : ""}`} style={{ backgroundImage: `url(${classImage})` }}>
      <div className={styles.overlay}>
        <span className={styles.classNumber}>{classNumber} - {teacher}</span>
        <p className={styles.classTitle}>{classTitle}</p>
        <a href={link} className={styles.cardButton}>Ver conteúdo</a>
      </div>
    </div>
  );
}