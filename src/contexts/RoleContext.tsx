import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppRole } from '@/types/admin';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: AppRole;
}

interface RoleContextType {
  user: MockUser | null;
  login: (role: AppRole) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const mockUsers: Record<AppRole, MockUser> = {
  client: {
    id: 'user-client',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'client',
  },
  press: {
    id: 'user-press',
    name: 'Alice Chen',
    email: 'alice@example.com',
    role: 'press',
  },
  research: {
    id: 'user-research',
    name: 'Carol Davis',
    email: 'carol@example.com',
    role: 'research',
  },
  paper: {
    id: 'user-paper',
    name: 'Eva Martinez',
    email: 'eva@example.com',
    role: 'paper',
  },
  admin: {
    id: 'user-admin',
    name: 'Frank Wilson',
    email: 'frank@example.com',
    role: 'admin',
  },
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  const login = (role: AppRole) => {
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <RoleContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
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
