import { useQuery } from '@tanstack/react-query';

import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/apiEndpoints';

export interface Payeer {
  document: string;
  name: string;
}

export interface TransferItem {
  value: number;
  date: string;
  currency: string;
  payeer: Payeer;
}

export const useTransferHistoryQuery = () => {
  return useQuery({
    queryKey: ['transferHistory'],
    queryFn: async () => {
      const { baseURL, path } = API_ENDPOINTS.getTransferHistory;
      const response = await apiClient.get<TransferItem[]>(path, { baseURL });
      return response.data;
    },

    staleTime: 1000 * 60 * 3,
  });
};
