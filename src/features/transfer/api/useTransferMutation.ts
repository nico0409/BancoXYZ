import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { TransferFormValues } from '../schemas/transferSchema';

import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/apiEndpoints';

interface TransferResponse {
  message?: string;
  transactionId?: string;
}

export const useTransferMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TransferResponse, AxiosError, TransferFormValues>({
    mutationFn: async (transferData) => {
      const { baseURL, path } = API_ENDPOINTS.createTransfer;
      const response = await apiClient.post<TransferResponse>(path, transferData, { baseURL });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
    onError: (error) => {
      console.error('Falha na transferência [Código]:', error.response?.status);
    },
  });
};
