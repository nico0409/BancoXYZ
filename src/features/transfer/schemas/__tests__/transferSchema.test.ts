import { transferSchema } from '../transferSchema';

describe('transferSchema Validation', () => {
  const TODAY = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  it('debería pasar (success) con el payload esperado por la API', () => {
    const validData = {
      value: 100.0,
      currency: 'BRL',
      payeerDocument: '12345678900',
      transferDate: TODAY,
    };

    const result = transferSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('debería fallar si el valor (value) es 0 o negativo', () => {
    const base = { currency: 'BRL', payeerDocument: '12345678900', transferDate: TODAY };
    const invalidDataZero = { ...base, value: 0 };
    const invalidDataNegative = { ...base, value: -50 };

    const resultZero = transferSchema.safeParse(invalidDataZero);
    const resultNegative = transferSchema.safeParse(invalidDataNegative);

    expect(resultZero.success).toBe(false);
    expect(resultNegative.success).toBe(false);

    if (!resultZero.success) {
      expect(resultZero.error.issues[0].message).toBe('O valor deve ser maior que zero');
    }
  });

  it('debería fallar si el documento (payeerDocument) está vacío', () => {
    const invalidData = {
      value: 100.0,
      currency: 'BRL',
      payeerDocument: '',
      transferDate: TODAY,
    };

    const result = transferSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('O documento é obrigatório');
    }
  });

  it('debería fallar si transferDate está ausente o tiene formato inválido', () => {
    const base = { value: 100.0, currency: 'BRL', payeerDocument: '12345678900' };

    const resultMissing = transferSchema.safeParse(base);
    const resultShort = transferSchema.safeParse({ ...base, transferDate: '2025' });

    expect(resultMissing.success).toBe(false);
    expect(resultShort.success).toBe(false);

    if (!resultShort.success) {
      expect(resultShort.error.issues[0].message).toBe('A data é obrigatória');
    }
  });
});
