import { z } from 'zod';

export const transferSchema = z.object({
  payeerDocument: z.string().min(1, 'O documento é obrigatório'),
  currency: z.string().min(1, 'A moeda é obrigatória'),
  value: z
    .number({
      message: 'O valor deve ser um número válido',
    })
    .positive('O valor deve ser maior que zero'),
  transferDate: z
    .string()
    .min(10, 'A data é obrigatória')
    .refine((date) => {
      const today = new Date().toISOString().split('T')[0];
      return date >= today;
    }, 'A data não pode ser anterior a hoje'),
});

export type TransferFormValues = z.infer<typeof transferSchema>;
