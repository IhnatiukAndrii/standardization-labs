import type { StateCreator } from 'zustand';

/**
 * Represents the User Slice of the global Zustand store.
 * Manages player authentication and registration identifiers.
 */
export interface UserSlice {
  /**
   * Unique client-generated UUID for the player.
   */
  userId: string;
  /**
   * The display name of the player.
   */
  userName: string;
  /**
   * Action to update the user identity state.
   * @param id The new unique user identifier.
   * @param name The new player display name.
   */
  setUserId: (id: string, name: string) => void;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
  userId: '',
  userName: '',
  setUserId: (id, name) => set({ userId: id, userName: name }),
});
