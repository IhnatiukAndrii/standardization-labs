import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createUserSlice } from './userSlice';
import type { UserSlice } from './userSlice';
import { createSettingsSlice } from './settingsSlice';
import type { SettingsSlice } from './settingsSlice';
import { createResultsSlice } from './resultsSlice';
import type { ResultsSlice } from './resultsSlice';

/**
 * The combined global application state, merging user, settings, and results slices.
 */
export type AppState = UserSlice & SettingsSlice & ResultsSlice;

/**
 * The global Zustand store with persistent storage middleware.
 * Provides access to user details, game settings, and local leaderboard records.
 */
export const useStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createSettingsSlice(...a),
      ...createResultsSlice(...a),
    }),
    {
      name: '15-puzzle-storage',
    }
  )
);
