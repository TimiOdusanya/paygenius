import React, { createContext, useCallback, useContext, useMemo } from "react";
import type { User } from "@/types";
import { useAuthStore } from "@/stores/auth.store";
import { useGetMeQuery, useLoginMutation } from "@/services/auth/auth.query";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token, user, setAuth, setUser, clearAuth } = useAuthStore();

  const { refetch: refetchMe, isFetching: isMeLoading } = useGetMeQuery({
    enabled: !!token,
    retry: false,
  });

  const loginMutation = useLoginMutation();

  const login = useCallback(
    async (phone: string, password: string) => {
      const res = await loginMutation.mutateAsync({
        identifier: phone,
        password,
      });
      if (!res.success || !res.data?.token) {
        throw new Error(res.message ?? "Login failed");
      }
    },
    [loginMutation],
  );

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const refreshUser = useCallback(() => {
    if (token) refetchMe();
  }, [token, refetchMe]);

  const isLoading = !!token && (!user || isMeLoading);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!token && !!user,
      login,
      logout,
      setUser,
      refreshUser,
    }),
    [user, token, isLoading, login, logout, setUser, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
