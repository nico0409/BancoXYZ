import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { LoginFormValues } from '../schemas/loginSchema';
import { useAuthStore } from '../store/useAuthStore';

import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/config/apiEndpoints';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const useLoginMutation = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation<LoginResponse, AxiosError, LoginFormValues>({
    mutationFn: async (credentials) => {
      const { baseURL, path } = API_ENDPOINTS.login;
      const response = await apiClient.post<LoginResponse>(path, credentials, { baseURL });
      return response.data;
    },
    onSuccess: (data) => {
      login(data.token, data.user);
    },
    onError: (error) => {
      console.error('Falha no login [Código]:', error.response?.status);
    },
  });
};
