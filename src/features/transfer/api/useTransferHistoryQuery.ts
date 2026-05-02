import { useQuery } from '@tanstack/react-query';

import apiClient from '@/api/client';

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
      const response = await apiClient.get<TransferItem[]>('/transferlist');
      return response.data;
    },

    staleTime: 1000 * 60 * 3,
  });
};
