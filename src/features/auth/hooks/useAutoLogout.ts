import { useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useAuthStore } from '../store/useAuthStore';

const AUTO_LOGOUT_TIME_MS = 5 * 60 * 1000;

export function useAutoLogout() {
  const appState = useRef(AppState.currentState);
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAutoLogout = async () => {
      try {
        const savedTimestampStr = await SecureStore.getItemAsync('backgroundTimestamp');

        if (savedTimestampStr) {
          const savedTimestamp = parseInt(savedTimestampStr, 10);
          const timeElapsed = Date.now() - savedTimestamp;

          if (timeElapsed > AUTO_LOGOUT_TIME_MS) {
            logout();
            queryClient.clear();
          }

          await SecureStore.deleteItemAsync('backgroundTimestamp');
        }
      } catch {
        logout();
        queryClient.clear();
      }
    };

    checkAutoLogout();

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && appState.current !== 'active') {
        checkAutoLogout();
      } else if (nextAppState !== 'active' && appState.current === 'active') {
        SecureStore.setItemAsync('backgroundTimestamp', Date.now().toString());
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [logout, queryClient]);
}
