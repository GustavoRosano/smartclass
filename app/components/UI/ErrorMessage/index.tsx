import { Alert, Button } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className={styles.errorContainer}>
      <Alert severity="error" className={styles.alert}>
        {message}
      </Alert>
      {onRetry && (
        <Button 
          variant="contained" 
          onClick={onRetry} 
          className={styles.retryButton}
        >
          Tentar Novamente
        </Button>
      )}
    </div>
  );
}
