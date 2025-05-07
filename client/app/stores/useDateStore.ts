import { create } from 'zustand';

interface DateStore {
  fromDate: Date | null;
  toDate: Date | null;
  setFromDate: (date: Date | null) => void;
  setToDate: (date: Date | null) => void;
  resetDates: () => void;
}

export const useDateStore = create<DateStore>((set) => ({
  fromDate: null,
  toDate: null,
  setFromDate: (date) => set({ fromDate: date }),
  setToDate: (date) => set({ toDate: date }),
  resetDates: () => set({ fromDate: null, toDate: null }),
}));
