import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createUserSlice } from './userSlice';
import type { UserSlice } from './userSlice';
import { createSettingsSlice } from './settingsSlice';
import type { SettingsSlice } from './settingsSlice';
import { createResultsSlice } from './resultsSlice';
import type { ResultsSlice } from './resultsSlice';

export type AppState = UserSlice & SettingsSlice & ResultsSlice;

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
