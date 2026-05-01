import { useQuery } from '@tanstack/react-query';

import apiClient from '@/api/client';

interface BalanceResponse {
  balance: number;
}

export const useBalanceQuery = () => {
  return useQuery({
    queryKey: ['balance'], // Llave única para la caché
    queryFn: async () => {
      const response = await apiClient.get<BalanceResponse>('/balance');
      return response.data;
    },
  });
};
