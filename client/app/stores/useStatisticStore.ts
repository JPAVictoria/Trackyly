import { create } from "zustand";

interface StatsState {
  sosCount: number | null;
  merchCount: number | null;
  loading: boolean;
  error: string | null;
  setSosCount: (count: number) => void;
  setMerchCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetStats: () => void;
}

export const useStatisticStore = create<StatsState>((set) => ({
  sosCount: null,
  merchCount: null,
  loading: true,
  error: null,

  setSosCount: (count) => set({ sosCount: count }),
  setMerchCount: (count) => set({ merchCount: count }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  resetStats: () => set({ sosCount: null, merchCount: null, loading: true, error: null }),
}));
