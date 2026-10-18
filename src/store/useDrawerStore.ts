import { DrawerState } from "@/types";
import { create } from "zustand";

export const useDrawerStore = create<DrawerState>((set) => ({
  currentSession: null,
  isOpen: false,

  setCurrentSession: (session) => set({ currentSession: session }),
  setIsOpen: (isOpen) => set({ isOpen }),

  updateDenominations: (denominations) =>
    set((state) => {
      if (!state.currentSession) return state;
      const totalBalance = denominations.reduce(
        (sum, item) => sum + item.denomination * item.count,
        0,
      );
      return {
        currentSession: {
          ...state.currentSession,
          denominations,
          currentBalance: totalBalance,
        },
      };
    }),
}));
