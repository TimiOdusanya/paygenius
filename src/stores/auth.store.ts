import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@/types';
import { usePreferencesStore } from './preferences.store';

type AuthState = {
  token: string | null;
  user: User | null;
  hasHydrated: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hasHydrated: false,

      setAuth: (token, user) => set({ token, user }),

      setUser: (user) => set({ user }),

      clearAuth: () => {
        const phone = get().user?.phoneNumber;
        if (phone) {
          usePreferencesStore.getState().setLastPhoneNumber(phone);
        }
        set({ token: null, user: null });
      },

      isAuthenticated: () => !!get().token,

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'paygenius-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true });
      },
    }
  )
);
