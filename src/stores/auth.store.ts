import { create } from 'zustand';
import type { User } from '@/types';

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,

  setAuth: (token, user) => set({ token, user }),

  setUser: (user) => set({ user }),

  clearAuth: () => set({ token: null, user: null }),

  isAuthenticated: () => !!get().token,
}));
