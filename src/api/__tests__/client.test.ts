import * as SecureStore from 'expo-secure-store';

import apiClient from '../client';

import { errorStore } from '@/store/useErrorStore';

jest.mock('@/config/env', () => ({
  env: {
    EXPO_PUBLIC_API_URL: 'https://test-api.com',
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

describe('apiClient Interceptors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('agrega el header de Authorization si el token existe en SecureStore', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('fake-jwt-token');

    const config = {
      headers: {
        set: jest.fn(),
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestInterceptor = (apiClient.interceptors.request as any).handlers[0].fulfilled;

    const modifiedConfig = await requestInterceptor(config);

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('userToken');

    expect(config.headers.set).toHaveBeenCalledWith('Authorization', 'Bearer fake-jwt-token');

    expect(modifiedConfig).toBe(config);
  });

  it('no inyecta Authorization si el token no existe', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    const config = {
      headers: {
        set: jest.fn(),
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestInterceptor = (apiClient.interceptors.request as any).handlers[0].fulfilled;

    const modifiedConfig = await requestInterceptor(config);

    expect(config.headers.set).not.toHaveBeenCalled();
    expect(modifiedConfig).toBe(config);
  });

  it('dispara un error de bloqueo si SecureStore falla', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('SecureStore failure'));

    const setBlockingErrorSpy = jest.spyOn(errorStore.getState(), 'setBlockingError');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestInterceptor = (apiClient.interceptors.request as any).handlers[0].fulfilled;

    try {
      await requestInterceptor({});
    } catch {
      expect(setBlockingErrorSpy).toHaveBeenCalledWith('AUTH_ERROR');
    }
  });

  describe('Response Interceptor Errors', () => {
    it('dispara un error de bloqueo en errores 500+', async () => {
      const setBlockingErrorSpy = jest.spyOn(errorStore.getState(), 'setBlockingError');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseInterceptor = (apiClient.interceptors.response as any).handlers[0].rejected;

      const error = {
        response: { status: 500 },
      };

      try {
        await responseInterceptor(error);
      } catch {
        expect(setBlockingErrorSpy).toHaveBeenCalledWith('SERVER_DOWN');
      }
    });

    it('dispara un error de bloqueo en errores 400', async () => {
      const setBlockingErrorSpy = jest.spyOn(errorStore.getState(), 'setBlockingError');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseInterceptor = (apiClient.interceptors.response as any).handlers[0].rejected;

      const error = {
        response: { status: 400 },
      };

      try {
        await responseInterceptor(error);
      } catch {
        expect(setBlockingErrorSpy).toHaveBeenCalledWith('UNKNOWN_ERROR');
      }
    });
  });
});
