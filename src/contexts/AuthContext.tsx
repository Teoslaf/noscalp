'use client';

import { createContext, useContext, useCallback, ReactNode } from 'react';
import { create } from 'zustand';
import { IDKitWidget, ISuccessResult } from '@worldcoin/idkit';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id?: string;
    worldId?: string;
    email?: string;
    username?: string;
    isProfileComplete: boolean;
  } | null;
  setUser: (user: AuthState['user']) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthState['user'];
  onWorldIDSuccess: (result: ISuccessResult) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user, setUser, setIsAuthenticated, setIsLoading, logout } = useAuthStore();

  const onWorldIDSuccess = useCallback(async (result: ISuccessResult) => {
    try {
      setIsLoading(true);
      // TODO: Send proof to your backend for verification
      const response = await fetch('/api/verify-world-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proof: result }),
      });

      const data = await response.json();

      if (data.success) {
        setUser({
          id: data.user.id,
          worldId: data.user.worldId,
          isProfileComplete: data.user.isProfileComplete,
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('World ID verification failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setUser, setIsAuthenticated]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      onWorldIDSuccess,
      logout,
    }}>
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