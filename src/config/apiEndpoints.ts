import { env } from '@/config/env';

/**
 * Mapa centralizado de todos los endpoints de la API.
 *
 * Cada entrada define:
 *  - `baseURL`: el servidor al que pertenece el endpoint (puede variar por microservicio)
 *  - `path`: la ruta relativa del recurso
 *  - `method`: el verbo HTTP que se debe usar
 */
export const API_ENDPOINTS = {
  // ─── Auth ────────────────────────────────────────────────────────────────
  login: {
    baseURL: env.EXPO_PUBLIC_API_URL,
    path: '/login',
    method: 'POST',
  },

  // ─── Balance ─────────────────────────────────────────────────────────────
  getBalance: {
    baseURL: env.EXPO_PUBLIC_BALANCE_API_URL,
    path: '/balance',
    method: 'GET',
  },

  // ─── Transferencias ───────────────────────────────────────────────────────
  createTransfer: {
    baseURL: env.EXPO_PUBLIC_TRANSFER_API_URL,
    path: '/transfer',
    method: 'POST',
  },
  getTransferHistory: {
    baseURL: env.EXPO_PUBLIC_TRANSFER_HISTORY_API_URL,
    path: '/transferList',
    method: 'GET',
  },
} as const;

/** Tipo utilitario: extrae las claves del mapa */
export type ApiEndpointKey = keyof typeof API_ENDPOINTS;
