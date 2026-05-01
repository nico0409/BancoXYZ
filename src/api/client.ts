import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { env } from '@/config/env';

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
      console.error('Error al recuperar el token de seguridad:', error);
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
    if (error.response && error.response.status === 401) {
      console.error('Acceso denegado: Token inválido o expirado');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
