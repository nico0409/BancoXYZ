import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { queryClient } from '@/api/queryClient';
import { env } from '@/config/env';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { errorStore } from '@/store/useErrorStore';

const apiClient = axios.create({
  baseURL: env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');

      if (token && config.headers) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      errorStore.getState().setBlockingError('AUTH_ERROR');
      return Promise.reject(error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/login');

    if (isLoginEndpoint) {
      return Promise.reject(error);
    }

    if (!error.response || error.response.status >= 500) {
      errorStore.getState().setBlockingError('SERVER_DOWN');
    } else if (error.response.status === 400) {
      errorStore.getState().setBlockingError('UNKNOWN_ERROR');
    } else if (error.response.status === 401 || error.response.status === 403) {
      useAuthStore.getState().logout();
      queryClient.clear();
    }

    return Promise.reject(error);
  },
);

export default apiClient;
