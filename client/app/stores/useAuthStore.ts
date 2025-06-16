import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  role: string | null;
  _hasHydrated: boolean;
  setRole: (role: string | null) => void;
  clearRole: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      role: null,
      _hasHydrated: false,
      setRole: (role) => set({ role }),
      clearRole: () => set({ role: null }),
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ role: state.role }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
