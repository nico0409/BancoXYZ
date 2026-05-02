import { transferSchema } from '../transferSchema';

describe('transferSchema Validation', () => {
  const TODAY = new Date().toISOString().split('T')[0];
  const TOMORROW = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const YESTERDAY = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const validBase = {
    value: 100.0,
    currency: 'BRL',
    payeerDocument: '12345678900',
  };

  it('Caso de éxito (Fecha futura): debería aceptar una fecha posterior al día actual', () => {
    const data = { ...validBase, transferDate: TOMORROW };
    const result = transferSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('Caso límite (Fecha actual): debería aceptar la fecha de hoy', () => {
    const data = { ...validBase, transferDate: TODAY };
    const result = transferSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('Caso de fallo (Fecha en el pasado): debería rechazar una fecha anterior a hoy', () => {
    const data = { ...validBase, transferDate: YESTERDAY };
    const result = transferSchema.safeParse(data);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('A data não pode ser anterior a hoje');
    }
  });

  it('Caso de fallo (Formato incorrecto): debería rechazar formatos no estándar', () => {
    const data = { ...validBase, transferDate: '01/01/2026' };
    const result = transferSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it('debería fallar si el valor (value) es 0 o negativo', () => {
    const invalidDataZero = { ...validBase, transferDate: TODAY, value: 0 };
    const result = transferSchema.safeParse(invalidDataZero);
    expect(result.success).toBe(false);
  });

  it('debería fallar si el documento (payeerDocument) está vacío', () => {
    const invalidData = { ...validBase, transferDate: TODAY, payeerDocument: '' };
    const result = transferSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
