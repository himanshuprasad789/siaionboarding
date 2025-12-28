import React, { createContext, useContext, ReactNode } from 'react';
import { useUserRoles, UserRole } from '@/hooks/useUserRole';
import { useProfile } from '@/hooks/useProfiles';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database["public"]["Enums"]["app_role"];

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  roles: AppRole[];
  primaryRole: AppRole;
}

interface RoleContextType {
  user: CurrentUser | null;
  roles: AppRole[];
  isLoading: boolean;
  hasRole: (role: AppRole) => boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isClient: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useAuth();
  const { data: userRoles, isLoading: rolesLoading } = useUserRoles();
  const { data: profile, isLoading: profileLoading } = useProfile();

  const isLoading = rolesLoading || profileLoading;
  
  const roles = userRoles?.map(r => r.role) || [];
  
  // Determine primary role (highest privilege first)
  const getPrimaryRole = (): AppRole => {
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('research')) return 'research';
    if (roles.includes('press')) return 'press';
    if (roles.includes('paper')) return 'paper';
    return 'client';
  };

  const currentUser: CurrentUser | null = authUser && profile ? {
    id: authUser.id,
    name: profile.full_name || profile.email,
    email: profile.email,
    roles,
    primaryRole: getPrimaryRole(),
  } : null;

  const hasRole = (role: AppRole): boolean => {
    return roles.includes(role);
  };

  const isAdmin = roles.includes('admin');
  const isStaff = roles.some(r => ['admin', 'press', 'research', 'paper'].includes(r));
  const isClient = roles.includes('client') || roles.length === 0;

  return (
    <RoleContext.Provider value={{ 
      user: currentUser, 
      roles,
      isLoading,
      hasRole,
      isAdmin,
      isStaff,
      isClient,
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

// Re-export AppRole type for convenience
export type { AppRole };
