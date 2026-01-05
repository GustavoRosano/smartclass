import styles from './styles.module.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from "next/navigation";
import { PostService } from "@/app/services/post.service";

type Props = {
  id: string;
  classNumber: string;
  teacher: string;
  classTitle: string;
  classImage: string;
  link: string;
  onDelete?: () => void;
};

export default function ClassCard({ id, classNumber, teacher, classTitle, classImage, link, onDelete }: Props) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(link);
  };

  const handleDelete = async () => {
    if (!confirm(`Deseja realmente excluir "${classTitle}"?`)) return;
    
    try {
      await PostService.delete(id);
      alert("Aula excluída com sucesso!");
      
      // Chamar callback se fornecido
      if (onDelete) {
        onDelete();
      } else {
        window.location.reload();
      }
    } catch (error) {
      alert("Erro ao excluir aula");
      console.error(error);
    }
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
            <button className={styles.actionButton} onClick={handleDelete} title="Excluir">
              <DeleteIcon />
            </button>
            <button className={styles.actionButton} onClick={handleNavigate} title="Editar">
              <EditIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}