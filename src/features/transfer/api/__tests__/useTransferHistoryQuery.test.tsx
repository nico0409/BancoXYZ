import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useTransferHistoryQuery } from '../useTransferHistoryQuery';

import apiClient from '@/api/client';

jest.mock('@/api/client');

const mockTransfers = [
  {
    id: '1',
    value: 1000,
    currency: 'USD',
    date: '2024-08-25',
    payeer: {
      document: '123',
      name: 'Ronaldo de Assis Moreira',
    },
  },
];

describe('useTransferHistoryQuery', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('fetches transfer history successfully', async () => {
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: { transfers: mockTransfers },
    });

    const { result } = renderHook(() => useTransferHistoryQuery(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockTransfers);
    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/transferList', {
      baseURL: 'https://test.history.bancoxyz.com',
    });
  });

  it('handles API errors correctly', async () => {
    (apiClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useTransferHistoryQuery(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/transferList', {
      baseURL: 'https://test.history.bancoxyz.com',
    });
  });
});
