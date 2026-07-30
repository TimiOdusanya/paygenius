import { create } from 'zustand';

export type AppRegion = 'USA' | 'NGN';

type PreferencesState = {
  region: AppRegion | null;
  setRegion: (region: AppRegion) => void;
  currency: () => 'USD' | 'NGN' | null;
};

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  region: null,

  setRegion: (region) => set({ region }),

  currency: () => {
    const region = get().region;
    if (region === 'USA') return 'USD';
    if (region === 'NGN') return 'NGN';
    return null;
  },
}));
