import type { StateCreator } from 'zustand';

export interface UserSlice {
  userId: string;
  userName: string;
  setUserId: (id: string, name: string) => void;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
  userId: '',
  userName: '',
  setUserId: (id, name) => set({ userId: id, userName: name }),
});
