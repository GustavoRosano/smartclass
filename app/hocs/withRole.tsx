import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';
import { CircularProgress, Box, Alert, Paper, Button } from '@mui/material';

type Role = 'admin' | 'professor' | 'aluno';

/**
 * HOC to protect routes that require specific roles
 * Usage: export default withRole(['admin', 'professor'])(MyPage);
 * 
 * @param allowedRoles - Array of roles that can access this route
 * @param redirectTo - Optional custom redirect path (default: '/Login')
 */
export function withRole<P extends object>(
  allowedRoles: Role[],
  redirectTo: string = '/Login'
) {
  return function (WrappedComponent: React.ComponentType<P>) {
    return function RoleProtectedComponent(props: P) {
      const router = useRouter();
      const { user, loading } = useAuth();

      useEffect(() => {
        if (!loading) {
          // Not authenticated
          if (!user) {
            router.push(redirectTo);
            return;
          }

          // Authenticated but wrong role
          if (!allowedRoles.includes(user.role as Role)) {
            // Don't redirect, just show unauthorized message
            return;
          }
        }
      }, [user, loading, router]);

      // Show loading while checking authentication
      if (loading) {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
          >
            <CircularProgress />
          </Box>
        );
      }

      // Not authenticated
      if (!user) {
        return null;
      }

      // Wrong role - show unauthorized message
      if (!allowedRoles.includes(user.role as Role)) {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            padding={3}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                maxWidth: 500,
                textAlign: 'center'
              }}
            >
              <Alert severity="error" sx={{ mb: 3 }}>
                <strong>Acesso Negado</strong>
              </Alert>
              <p>
                Você não tem permissão para acessar esta página.
              </p>
              <p>
                Roles permitidos: <strong>{allowedRoles.join(', ')}</strong>
              </p>
              <p>
                Seu role atual: <strong>{user.role}</strong>
              </p>
              <Button
                variant="contained"
                onClick={() => router.push('/')}
                sx={{ mt: 2 }}
              >
                Voltar para Home
              </Button>
            </Paper>
          </Box>
        );
      }

      // User has correct role, render the component
      return <WrappedComponent {...props} />;
    };
  };
}

/**
 * Convenience HOC for admin-only routes
 * Usage: export default withAdminRole(MyPage);
 */
export function withAdminRole<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return withRole<P>(['admin'])(WrappedComponent);
}

/**
 * Convenience HOC for teacher/admin routes
 * Usage: export default withTeacherRole(MyPage);
 */
export function withTeacherRole<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return withRole<P>(['admin', 'professor'])(WrappedComponent);
}

/**
 * Convenience HOC for student routes
 * Usage: export default withStudentRole(MyPage);
 */
export function withStudentRole<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return withRole<P>(['aluno'])(WrappedComponent);
}
