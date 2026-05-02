import * as SecureStore from 'expo-secure-store';

import apiClient from '../client';

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
});
