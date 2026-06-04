import type { StateCreator } from 'zustand';

export interface GameSettings {
  boardSize: number;
}

export interface SettingsSlice {
  settings: GameSettings;
  setSettings: (settings: GameSettings) => void;
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  settings: { boardSize: 4 },
  setSettings: (settings) => set({ settings }),
});
