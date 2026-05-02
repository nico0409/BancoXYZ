import { create } from 'zustand';

interface BalanceVisibilityState {
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
}

export const useBalanceVisibilityStore = create<BalanceVisibilityState>((set) => ({
  isBalanceVisible: false,
  toggleBalanceVisibility: () => set((state) => ({ isBalanceVisible: !state.isBalanceVisible })),
}));
