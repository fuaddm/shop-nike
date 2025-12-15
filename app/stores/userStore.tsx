import { create } from 'zustand';

import type { IUserStore } from '@models/store/userStore';

export const useUserStore = create<IUserStore>()((set) => ({
  userData: null,
  setUserData: (userData) => set(() => ({ userData })),
}));
