import { create } from 'zustand';

import type { IMenuStore } from '@models/store/menuStore';

export const useMenuStore = create<IMenuStore>()((set) => ({
  isOpen: false,
  setIsOpen: (callbackFunction) =>
    set((state) => {
      if (typeof callbackFunction === 'boolean') {
        return { isOpen: callbackFunction };
      }
      const isOpen = callbackFunction(state.isOpen);
      return { isOpen };
    }),
}));
