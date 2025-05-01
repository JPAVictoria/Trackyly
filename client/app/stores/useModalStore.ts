import { create } from 'zustand';

type FilterType = 'Custom' | 'Outlet' | 'Default';

interface ModalState {
  selectedFilter: FilterType | string;
  isDateModalOpen: boolean;
  isOutletModalOpen: boolean;
  setSelectedFilter: (filter: FilterType | string) => void;
  setIsDateModalOpen: (open: boolean) => void;
  setIsOutletModalOpen: (open: boolean) => void;
  handleFilterClick: (label: FilterType) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  selectedFilter: 'Default',
  isDateModalOpen: false,
  isOutletModalOpen: false,
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  setIsDateModalOpen: (open) => set({ isDateModalOpen: open }),
  setIsOutletModalOpen: (open) => set({ isOutletModalOpen: open }),
  handleFilterClick: (label) => {
    switch (label) {
      case 'Custom':
        set({ isDateModalOpen: true });
        break;
      case 'Outlet':
        set({ isOutletModalOpen: true });
        break;
      default:
        set({ selectedFilter: label });
    }
  },
}));