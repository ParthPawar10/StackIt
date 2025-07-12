import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to home page with a state to show login modal
    return <Navigate to="/" state={{ from: location, showLogin: true }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin' && user?.role !== 'moderator') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
