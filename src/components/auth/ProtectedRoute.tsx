import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
}

/**
 * ProtectedRoute component that guards routes requiring authentication
 * and optionally email verification.
 *
 * @param children - The component(s) to render if authorized
 * @param requireVerification - Whether to require email verification (default: true)
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireVerification = true
}) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!currentUser) {
    // Store the attempted URL to redirect back after login
    sessionStorage.setItem('redirectAfterAuth', location.pathname);
    return <Navigate to="/auth/login" replace />;
  }

  // Authenticated but email not verified - redirect to verification page
  if (requireVerification && !currentUser.emailVerified) {
    return <Navigate to="/auth/verify-email" replace />;
  }

  // Authorized - render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
