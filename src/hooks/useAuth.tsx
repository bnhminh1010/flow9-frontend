'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (pin: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.post<{ valid: boolean; userId?: string }>('/api/auth/verify', {}, { skipAuth: true });
      if (res.valid && res.userId) {
        setIsAuthenticated(true);
        setUserId(res.userId);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (pin: string) => {
    const res = await api.post<{ success: boolean; userId: string }>('/api/auth/login', { pin }, { skipAuth: true });
    if (res.success) {
      setIsAuthenticated(true);
      setUserId(res.userId);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
