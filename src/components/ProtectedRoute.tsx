import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole, AppRole } from '@/contexts/RoleContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: AppRole[];
  requireAdmin?: boolean;
  requireStaff?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles,
  requireAdmin,
  requireStaff,
}: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { roles, isLoading: rolesLoading, isAdmin, isStaff, hasRole } = useRole();
  const navigate = useNavigate();

  const isLoading = authLoading || rolesLoading;

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
      return;
    }

    if (!isLoading && user) {
      // Check admin requirement
      if (requireAdmin && !isAdmin) {
        navigate('/dashboard');
        return;
      }

      // Check staff requirement
      if (requireStaff && !isStaff) {
        navigate('/dashboard');
        return;
      }

      // Check specific role requirements
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => hasRole(role));
        if (!hasRequiredRole) {
          navigate('/dashboard');
          return;
        }
      }
    }
  }, [user, isLoading, navigate, requireAdmin, requireStaff, requiredRoles, isAdmin, isStaff, hasRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Check permissions
  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (requireStaff && !isStaff) {
    return null;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}
