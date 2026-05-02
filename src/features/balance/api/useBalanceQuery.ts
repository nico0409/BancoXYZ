import { useQuery } from '@tanstack/react-query';

import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/apiEndpoints';

interface BalanceResponse {
  currency: string;
  accountBalance: number;
}

export const useBalanceQuery = () => {
  return useQuery({
    queryKey: ['balance'], // Llave única para la caché
    queryFn: async () => {
      const { baseURL, path } = API_ENDPOINTS.getBalance;
      const response = await apiClient.get<BalanceResponse>(path, { baseURL });
      return response.data;
    },
  });
};
