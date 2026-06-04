import type { StateCreator } from 'zustand';
import type { UserSlice } from './userSlice';

export interface GameResult {
  id: string;
  moves: number;
  time: string;
  date: string;
}

export interface ResultsSlice {
  results: Record<string, GameResult[]>;
  addResult: (result: Omit<GameResult, 'id' | 'date'>) => void;
}

export const createResultsSlice: StateCreator<ResultsSlice & UserSlice, [], [], ResultsSlice> = (set) => ({
  results: {},
  addResult: (result) => set((state) => {
    if (!state.userId) return state;
    const newResult: GameResult = {
      ...result,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    const userResults = state.results[state.userId] || [];
    return {
      results: {
        ...state.results,
        [state.userId]: [...userResults, newResult],
      },
    };
  }),
});
