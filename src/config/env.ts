import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url('La URL de la API debe ser válida y obligatoria'),
  EXPO_PUBLIC_BALANCE_API_URL: z.string().url('La URL de balance debe ser válida').optional(),
});

const _env = envSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_BALANCE_API_URL: process.env.EXPO_PUBLIC_BALANCE_API_URL,
});

if (!_env.success) {
  console.error('❌ Variables de entorno inválidas:', _env.error.format());
  throw new Error('Variables de entorno inválidas');
}

export const env = _env.data;
