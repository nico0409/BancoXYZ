import { useQueryClient } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import * as SecureStore from 'expo-secure-store';
import { AppState, AppStateStatus, NativeEventSubscription } from 'react-native';

import { useAuthStore } from '../../store/useAuthStore';
import { useAutoLogout } from '../useAutoLogout';

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));

jest.mock('../../store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

describe('useAutoLogout', () => {
  let mockLogout: jest.Mock;
  let mockClear: jest.Mock;
  let appStateCallback: (state: AppStateStatus) => void;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T12:00:00.000Z'));

    mockLogout = jest.fn();
    mockClear = jest.fn();

    (useAuthStore as unknown as jest.Mock).mockImplementation(() => {
      // Como solo usamos state.logout, devolvemos el mock directamente
      return mockLogout;
    });

    (useQueryClient as jest.Mock).mockReturnValue({
      clear: mockClear,
    });

    jest.spyOn(AppState, 'addEventListener').mockImplementation((type, handler) => {
      if (type === 'change') {
        appStateCallback = handler as (state: AppStateStatus) => void;
      }
      return { remove: jest.fn() } as unknown as NativeEventSubscription;
    });

    AppState.currentState = 'active';

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('guarda el tiempo exacto en SecureStore cuando la app se va a segundo plano', async () => {
    renderHook(() => useAutoLogout());

    appStateCallback('background');

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      'backgroundTimestamp',
      new Date('2024-01-01T12:00:00.000Z').getTime().toString(),
    );
  });

  it('cierra sesión si pasaron más de 5 minutos al regresar a la app', async () => {
    const pastTime = new Date('2024-01-01T11:54:00.000Z').getTime().toString();
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(pastTime);

    AppState.currentState = 'background';
    renderHook(() => useAutoLogout());

    appStateCallback('active');

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockClear).toHaveBeenCalled();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('backgroundTimestamp');
    });
  });

  it('mantiene la sesión abierta si pasaron menos de 5 minutos', async () => {
    const pastTime = new Date('2024-01-01T11:58:00.000Z').getTime().toString();
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(pastTime);

    AppState.currentState = 'background';
    renderHook(() => useAutoLogout());

    appStateCallback('active');

    await waitFor(() => {
      expect(mockLogout).not.toHaveBeenCalled();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('backgroundTimestamp');
    });
  });

  it('cierra sesión por seguridad si SecureStore falla (Fail-Safe)', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Corrupted Keystore'));

    AppState.currentState = 'background';
    renderHook(() => useAutoLogout());

    appStateCallback('active');

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(mockClear).toHaveBeenCalled();
    });
  });
});
