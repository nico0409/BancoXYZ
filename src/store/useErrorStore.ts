import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'SERVER_DOWN'
  | 'MAINTENANCE'
  | 'FORCE_UPDATE'
  | 'NOT_FOUND'
  | 'AUTH_ERROR'
  | 'UNKNOWN_ERROR';

interface ErrorState {
  errorCode: AppErrorCode | null;
  errorMessage: string | null;
  isCritical: boolean;
  isBlockingError: boolean;
  setBlockingError: (
    code: AppErrorCode | null,
    message?: string | null,
    isCritical?: boolean,
  ) => void;
  clearError: () => void;
}

export const errorStore = createStore<ErrorState>((set) => ({
  errorCode: null,
  errorMessage: null,
  isCritical: true,
  isBlockingError: false,
  setBlockingError: (code, message = null, isCritical = true) =>
    set({
      errorCode: code,
      errorMessage: message,
      isCritical,
      isBlockingError: code !== null,
    }),
  clearError: () =>
    set({ errorCode: null, errorMessage: null, isCritical: true, isBlockingError: false }),
}));

export const useErrorStore = () => useStore(errorStore);
