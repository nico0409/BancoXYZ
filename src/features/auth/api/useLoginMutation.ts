import { useMutation } from '@tanstack/react-query';

import { LoginFormValues } from '../schemas/loginSchema';
import { useAuthStore } from '../store/useAuthStore';

import apiClient from '@/api/client';

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

  return useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      const response = await apiClient.post<LoginResponse>('/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.token, data.user);
    },
    onError: (error) => {
      console.error('Falha no login:', error);
    },
  });
};
