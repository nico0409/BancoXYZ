import { z } from 'zod';

export const transferSchema = z.object({
  payeerDocument: z.string().min(1, 'O documento é obrigatório'),
  currency: z.string().min(1, 'A moeda é obrigatória'),
  value: z
    .number({
      message: 'O valor deve ser um número válido',
    })
    .positive('O valor deve ser maior que zero'),
});

export type TransferFormValues = z.infer<typeof transferSchema>;
