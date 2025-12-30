import styles from './styles.module.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  classNumber: string;
  teacher: string;
  classTitle: string;
  classImage: string;
  link: string;
};

export default function ClassCard({ id, classNumber, teacher, classTitle, classImage, link }: Props) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(link);
  };

  return (
    <div key={id} className={`${styles.card}`} style={{ backgroundImage: `url(${classImage})` }}>
      <div className={styles.overlay}>
        <div className={styles.cardContainer}>
          <div className={styles.textContainer}>
            <span className={styles.classNumber}>{classNumber} - {teacher}</span>
            <p className={styles.classTitle}>{classTitle}</p>
          </div>
          <div className={styles.actions}>
            <button className={styles.actionButton}><DeleteIcon /></button>
            <button className={styles.actionButton} onClick={handleNavigate}><EditIcon /></button>
          </div>
        </div>
      </div>
    </div>
  );
}