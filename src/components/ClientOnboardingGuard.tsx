import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { useClientOnboardingStatus } from '@/hooks/useClientOnboarding';
import { Loader2 } from 'lucide-react';

interface ClientOnboardingGuardProps {
  children: React.ReactNode;
}

export function ClientOnboardingGuard({ children }: ClientOnboardingGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { isClient, isStaff, isLoading: roleLoading } = useRole();
  const { data: onboardingStatus, isLoading: onboardingLoading } = useClientOnboardingStatus();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoading = authLoading || roleLoading || onboardingLoading;

  useEffect(() => {
    if (isLoading || !user) return;

    // Staff users skip onboarding check
    if (isStaff) return;

    // If user is a client and hasn't completed onboarding, redirect to onboarding
    if (isClient && !onboardingStatus?.onboarding_completed) {
      // Don't redirect if already on onboarding page
      if (!location.pathname.startsWith('/onboarding')) {
        navigate('/onboarding');
      }
    }
  }, [user, isLoading, isClient, isStaff, onboardingStatus, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
