import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useAuthStore } from '../../store/useAuthStore';
import { useLoginMutation } from '../useLoginMutation';

import apiClient from '@/api/client';

// Mock de apiClient para no hacer llamadas reales HTTP
jest.mock('@/api/client', () => ({
  post: jest.fn(),
}));

// Mock del estado global (Zustand)
jest.mock('../../store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

// Wrapper necesario para hooks que usan React Query
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useLoginMutation Endpoint', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuthStore as unknown as jest.Mock).mockImplementation(() => mockLogin);
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('llama al endpoint POST /login y guarda el token en caso de éxito', async () => {
    const mockResponse = {
      data: {
        token: 'fake-jwt-token-123',
        user: { id: 1, name: 'Nicolas', email: 'nico@example.com' },
      },
    };

    // Simulamos una respuesta exitosa del backend
    (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLoginMutation(), { wrapper });

    // Ejecutamos la mutación
    result.current.mutate({ email: 'test@example.com', password: 'password123' });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verificamos que se haya hecho la petición al endpoint correcto con su baseURL
    expect(apiClient.post).toHaveBeenCalledWith(
      '/login',
      { email: 'test@example.com', password: 'password123' },
      { baseURL: 'https://test.api.bancoxyz.com' },
    );

    // Verificamos que onSuccess invocó la función login del store
    expect(mockLogin).toHaveBeenCalledWith('fake-jwt-token-123', mockResponse.data.user);
  });

  it('maneja el error cuando el endpoint rechaza las credenciales (401)', async () => {
    // Simulamos un rechazo del servidor
    (apiClient.post as jest.Mock).mockRejectedValue({ response: { status: 401 } });

    const { result } = renderHook(() => useLoginMutation(), { wrapper });

    result.current.mutate({ email: 'test@example.com', password: 'wrongpassword' });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Verificamos que no se intentó guardar la sesión
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
