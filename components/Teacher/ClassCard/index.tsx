import styles from './styles.module.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';

export default function ClassCard({ id, classNumber, teacher, classTitle, classImage, setActiveCard, link }: any) {


  const handleActiveCard = () => {
    setActiveCard(id);
  }

  return (
    <div key={id} onClick={handleActiveCard} className={`${styles.card}`} style={{ backgroundImage: `url(${classImage})` }}>
      <div className={styles.overlay}>
        <div className={styles.cardContainer}>
          <div className={styles.textContainer}>
            <span className={styles.classNumber}>{classNumber} - {teacher}</span>
            <p className={styles.classTitle}>{classTitle}</p>
          </div>
          <div className={styles.actions}>
            <button className={styles.actionButton}><DeleteIcon /></button>
            <button className={styles.actionButton}><EditIcon /></button>
          </div>
        </div>
      </div>
    </div>
  );
}