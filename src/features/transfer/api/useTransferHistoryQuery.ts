import { useQuery } from '@tanstack/react-query';

import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/apiEndpoints';

export interface Payeer {
  document: string;
  name: string;
}

interface TransferResponse {
  message: string;
  transfers: TransferItem[];
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
      try {
        const { baseURL, path } = API_ENDPOINTS.getTransferHistory;
        const response = await apiClient.get<TransferResponse>(path, { baseURL });
        return response.data.transfers;
      } catch (error) {
        throw error;
      }
    },

    staleTime: 1000 * 60 * 3,
  });
};
