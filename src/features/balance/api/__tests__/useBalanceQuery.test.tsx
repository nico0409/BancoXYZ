import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useBalanceQuery } from '../useBalanceQuery';

import apiClient from '@/api/client';
import { env } from '@/config/env';

// Mock de apiClient
jest.mock('@/api/client', () => ({
  get: jest.fn(),
}));

// Mock de variables de entorno
jest.mock('@/config/env', () => ({
  env: {
    EXPO_PUBLIC_API_URL: 'https://test-api.com',
    EXPO_PUBLIC_BALANCE_API_URL: 'https://test-balance-api.com',
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useBalanceQuery Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('llama al endpoint GET /balance usando el microservicio correspondiente', async () => {
    const mockResponse = {
      data: {
        accountBalance: 5000,
        currency: 'USD',
      },
    };

    // Simulamos una respuesta exitosa
    (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useBalanceQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verificamos que se haya hecho la petición a /balance
    expect(apiClient.get).toHaveBeenCalledWith('/balance', {
      baseURL: env.EXPO_PUBLIC_BALANCE_API_URL || env.EXPO_PUBLIC_API_URL,
    });

    // Verificamos que la data devuelta es correcta
    expect(result.current.data).toEqual(mockResponse.data);
  });

  it('retorna estado de error si el endpoint de AWS falla', async () => {
    // Simulamos un error del servidor (e.g. 500 o 403)
    (apiClient.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useBalanceQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
  });
});
