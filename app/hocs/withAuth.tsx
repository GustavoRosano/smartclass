import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * HOC to protect routes that require authentication
 * Usage: export default withAuth(MyPage);
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
      if (!loading && !user) {
        // User not authenticated, redirect to login
        router.push('/login');
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

    // Don't render component if not authenticated
    if (!user) {
      return null;
    }

    // User is authenticated, render the component
    return <WrappedComponent {...props} />;
  };
}
