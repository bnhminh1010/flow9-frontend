'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (pin: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('flow9_token');
    if (savedToken) {
      setToken(savedToken);
      verifyToken(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (t: string) => {
    try {
      const res = await api.post<{ valid: boolean; userId?: string }>(
        '/api/auth/verify',
        {},
        { skipAuth: true, headers: { Authorization: `Bearer ${t}` } }
      );
      if (res.valid && res.userId) {
        setIsAuthenticated(true);
        setUserId(res.userId);
      }
    } catch {
      localStorage.removeItem('flow9_token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (pin: string) => {
    const res = await api.post<{ success: boolean; userId: string; token?: string }>(
      '/api/auth/login',
      { pin },
      { skipAuth: true }
    );
    if (res.success) {
      if (res.token) {
        localStorage.setItem('flow9_token', res.token);
        setToken(res.token);
      }
      setIsAuthenticated(true);
      setUserId(res.userId);
    }
  };

  const logout = () => {
    localStorage.removeItem('flow9_token');
    setToken(null);
    setIsAuthenticated(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout, isLoading, token }}>
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
