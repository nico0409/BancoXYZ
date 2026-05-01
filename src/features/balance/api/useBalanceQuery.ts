import { useQuery } from '@tanstack/react-query';

import apiClient from '@/api/client';
import { env } from '@/config/env';

interface BalanceResponse {
  currency: string;
  accountBalance: number;
}

export const useBalanceQuery = () => {
  return useQuery({
    queryKey: ['balance'], // Llave única para la caché
    queryFn: async () => {
      const response = await apiClient.get<BalanceResponse>('/balance', {
        baseURL: env.EXPO_PUBLIC_BALANCE_API_URL || env.EXPO_PUBLIC_API_URL,
      });
      return response.data;
    },
  });
};
