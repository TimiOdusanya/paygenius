import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { User } from '../types';
import { api, getAuthToken, setAuthToken } from '../services/api';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => getAuthToken());
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
  }, []);

  const refreshUser = useCallback(async () => {
    const t = getAuthToken();
    if (!t) {
      setUserState(null);
      return;
    }
    try {
      const res = await api.auth.me();
      if (res.success && res.data?.user) {
        setUserState(res.data.user);
      }
    } catch {
      setAuthToken(null);
      setTokenState(null);
      setUserState(null);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const t = getAuthToken();
    if (!t) {
      setIsLoading(false);
      return;
    }
    setTokenState(t);
    api.auth
      .me()
      .then((res) => {
        if (!cancelled && res.success && res.data?.user) {
          setUserState(res.data.user);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAuthToken(null);
          setTokenState(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    const res = await api.auth.login({ phoneNumber: phone, password });
    if (!res.success || !res.data?.token) {
      throw new Error((res as { message?: string }).message ?? 'Login failed');
    }
    const { token: newToken, user: newUser } = res.data;
    setAuthToken(newToken);
    setTokenState(newToken);
    setUserState(newUser);
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setTokenState(null);
    setUserState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!token && !!user,
      login,
      logout,
      setUser: setUserState,
      refreshUser,
    }),
    [user, token, isLoading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
