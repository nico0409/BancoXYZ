import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import { errorStore } from '@/store/useErrorStore';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isRestoring: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isRestoring: true,
  login: async (token: string, user: User) => {
    try {
      await SecureStore.setItemAsync('userToken', token);
      set({ token, user });
    } catch {
      errorStore
        .getState()
        .setBlockingError('UNKNOWN_ERROR', 'Ocurrio un error al guardar el token', false);
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      set({ token: null, user: null });
    } catch {
      errorStore
        .getState()
        .setBlockingError('UNKNOWN_ERROR', 'Ocurrio un error al cerrar sesion', false);
    }
  },

  restoreSession: async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        set({ token, isRestoring: false });
      } else {
        set({ isRestoring: false });
      }
    } catch {
      errorStore
        .getState()
        .setBlockingError('UNKNOWN_ERROR', 'Ocurrio un error al restaurar la sesion', false);
    }
  },
}));
