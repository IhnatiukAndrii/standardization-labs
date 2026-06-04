import type { StateCreator } from 'zustand';

/**
 * Configuration preferences for the 15-puzzle game.
 */
export interface GameSettings {
  /**
   * The width/height of the square puzzle grid (e.g. 3, 4, 5).
   */
  boardSize: number;
}

/**
 * Represents the Settings Slice of the global Zustand store.
 * Manages player settings and board size preferences.
 */
export interface SettingsSlice {
  /**
   * The current game settings configuration.
   */
  settings: GameSettings;
  /**
   * Action to update the active game settings.
   * @param settings The new game configurations object.
   */
  setSettings: (settings: GameSettings) => void;
}

export const createSettingsSlice: StateCreator<SettingsSlice, [], [], SettingsSlice> = (set) => ({
  settings: { boardSize: 4 },
  setSettings: (settings) => set({ settings }),
});
