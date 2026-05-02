import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { TransferFormValues } from '../schemas/transferSchema';

import apiClient from '@/api/client';

interface TransferResponse {
  message?: string;
  transactionId?: string;
}

export const useTransferMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<TransferResponse, AxiosError, TransferFormValues>({
    mutationFn: async (transferData) => {
      const response = await apiClient.post<TransferResponse>('/transfer', transferData);
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
