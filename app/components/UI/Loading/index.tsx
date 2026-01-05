import { CircularProgress, Box } from '@mui/material';
import styles from './styles.module.scss';

type Props = {
  message?: string;
};

export default function Loading({ message = 'Carregando...' }: Props) {
  return (
    <Box className={styles.loadingContainer}>
      <CircularProgress sx={{ color: 'var(--primary-color)' }} />
      <p className={styles.message}>{message}</p>
    </Box>
  );
}
