import styles from './styles.module.scss';
import { Button, Box, Typography } from '@mui/material';
import { PersonAddAlt } from '@mui/icons-material';

type Props = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({ title, message, actionLabel, onAction }: Props) {
  return (
    <Box className={styles.emptyContainer}>
      <PersonAddAlt sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
      <Typography variant="h6" className={styles.title}>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" className={styles.message}>
        {message}
      </Typography>
      {actionLabel && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction}
          className={styles.actionButton}
          sx={{ mt: 3 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
