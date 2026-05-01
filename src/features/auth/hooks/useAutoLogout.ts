import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useAuthStore } from '../store/useAuthStore';

const AUTO_LOGOUT_TIME_MS = 5 * 60 * 1000;

export function useAutoLogout() {
  const appState = useRef(AppState.currentState);
  const backgroundTimestamp = useRef<number | null>(null);

  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (backgroundTimestamp.current) {
          const timeElapsed = Date.now() - backgroundTimestamp.current;

          if (timeElapsed > AUTO_LOGOUT_TIME_MS) {
            console.log('🔒 Tiempo de inactividad superado. Cerrando sesión por seguridad...');
            // 1. Destruimos el token JWT
            logout();
            // 2. Limpiamos toda la data financiera en caché (saldos, transferencias)
            queryClient.clear();
          }
        }
        backgroundTimestamp.current = null;
      } else if (nextAppState.match(/inactive|background/)) {
        // Registramos la hora exacta en la que el usuario minimizó la app
        backgroundTimestamp.current = Date.now();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [logout, queryClient]);
}
