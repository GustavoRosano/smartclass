import styles from './styles.module.scss';
import { Button } from '@mui/material';

type Props = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ title, message, actionLabel, onAction }: Props) {
  return (
    <div className={styles.emptyContainer}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction}
          className={styles.actionButton}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
