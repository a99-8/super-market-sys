import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, User } from "@/types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user: User) => {
        set({
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateUserBalance: (newBalance: number) => {
        set((state) => ({
          user: state.user ? { ...state.user, creditLimit: newBalance } : null,
        }));
      },
    }),
    {
      name: "grocery-pos-auth",
    },
  ),
);
