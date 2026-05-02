import { transferSchema } from '../transferSchema';

describe('transferSchema Validation', () => {
  it('debería pasar (success) con el payload esperado por la API', () => {
    const validData = {
      value: 100.0,
      currency: 'BRL',
      payeerDocument: '12345678900',
      // Nota: Aquí agregaremos el campo "tra..." cuando lo confirmemos
    };

    const result = transferSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('debería fallar si el valor (value) es 0 o negativo', () => {
    const invalidDataZero = { value: 0, currency: 'BRL', payeerDocument: '12345678900' };
    const invalidDataNegative = { value: -50, currency: 'BRL', payeerDocument: '12345678900' };

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
    };

    const result = transferSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].message).toBe('O documento é obrigatório');
    }
  });
});
