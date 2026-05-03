import { errorStore } from '../useErrorStore';

describe('useErrorStore', () => {
  beforeEach(() => {
    errorStore.getState().clearError();
  });

  it('debería inicializarse con valores nulos', () => {
    const state = errorStore.getState();
    expect(state.errorCode).toBeNull();
    expect(state.errorMessage).toBeNull();
    expect(state.isBlockingError).toBe(false);
  });

  it('debería establecer un error de bloqueo correctamente', () => {
    const { setBlockingError } = errorStore.getState();

    setBlockingError('SERVER_DOWN');

    const state = errorStore.getState();
    expect(state.errorCode).toBe('SERVER_DOWN');
    expect(state.isBlockingError).toBe(true);
  });

  it('debería limpiar el error correctamente', () => {
    const { setBlockingError, clearError } = errorStore.getState();

    setBlockingError('SERVER_DOWN');
    clearError();

    const state = errorStore.getState();
    expect(state.errorCode).toBeNull();
    expect(state.isBlockingError).toBe(false);
  });

  it('debería manejar setBlockingError(null) para limpiar el error', () => {
    const { setBlockingError } = errorStore.getState();

    setBlockingError('SERVER_DOWN');
    setBlockingError(null);

    const state = errorStore.getState();
    expect(state.errorCode).toBeNull();
    expect(state.isBlockingError).toBe(false);
  });
});
