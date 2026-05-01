import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

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
    } catch (error) {
      console.error('Error al guardar el token de seguridad:', error);
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      set({ token: null, user: null });
    } catch (error) {
      console.error('Error al eliminar el token de seguridad:', error);
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
    } catch (error) {
      console.error('Error al restaurar la sesión:', error);
      set({ isRestoring: false });
    }
  },
}));
