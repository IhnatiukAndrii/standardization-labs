import type { StateCreator } from 'zustand';
import type { UserSlice } from './userSlice';

/**
 * Details of a successfully completed game session.
 */
export interface GameResult {
  /**
   * Unique client-generated UUID for the specific result entry.
   */
  id: string;
  /**
   * The number of slider moves taken to solve the puzzle.
   */
  moves: number;
  /**
   * The formatted time duration string (e.g., 'MM:SS').
   */
  time: string;
  /**
   * ISO string representing the date/time of completion.
   */
  date: string;
}

/**
 * Represents the Results/Leaderboard Slice of the global Zustand store.
 * Tracks local game performance records categorized by userId.
 */
export interface ResultsSlice {
  /**
   * Record mapping userIds to their history of completed game results.
   */
  results: Record<string, GameResult[]>;
  /**
   * Action to record a new game completion result for the current active user.
   * @param result The move count and solve time details.
   */
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
