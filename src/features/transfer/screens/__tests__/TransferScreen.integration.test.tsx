import { ThemeProvider } from '@shopify/restyle';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react-native';
import React from 'react';

import { TransferScreen } from '../TransferScreen';

import theme from '@/theme/theme';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('@/features/balance/api/useBalanceQuery', () => ({
  useBalanceQuery: () => ({
    data: { accountBalance: 1000, currency: 'BRL' },
    isLoading: false,
    isError: false,
  }),
}));

jest.mock('@react-native-community/datetimepicker', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require('react-native');
  return (props: Record<string, unknown>) => {
    return <View testID="date-picker-mock" {...props} />;
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('TransferScreen Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Caso: Aislamiento del selector - no debería mostrar el calendario por defecto ("Ahora" seleccionado)', () => {
    render(<TransferScreen />, { wrapper });

    const picker = screen.queryByTestId ? screen.queryByTestId('date-picker-mock') : null;
    expect(picker).toBeNull();
  });

  it('Caso: Visibilidad del selector - debería mostrar el calendario al activar el toggle de "Agendar"', async () => {
    render(<TransferScreen />, { wrapper });

    const scheduleToggle = screen.getByText('newTransfer.tabScheduled');

    await act(async () => {
      fireEvent.press(scheduleToggle);
    });

    const datePickerButton = screen.getByTestId('date-picker-button');
    await act(async () => {
      fireEvent.press(datePickerButton);
    });

    await waitFor(() => {
      const picker = screen.queryByTestId
        ? screen.queryByTestId('date-picker-mock')
        : screen.getByTestId('date-picker-mock');
      expect(picker).toBeTruthy();
    });
  });

  it('Caso: Mutación del estado - debería actualizar la fecha en el formulario al cambiar el picker', async () => {
    render(<TransferScreen />, { wrapper });

    await act(async () => {
      fireEvent.press(screen.getByText('newTransfer.tabScheduled'));
    });

    const datePickerButton = screen.getByTestId('date-picker-button');
    await act(async () => {
      fireEvent.press(datePickerButton);
    });

    const picker = screen.getByTestId('date-picker-mock');
    const testDate = new Date('2026-12-25T12:00:00Z');

    await act(async () => {
      fireEvent(picker, 'onChange', { type: 'set' }, testDate);
    });

    await waitFor(() => {
      expect(screen.getByText(/2026/)).toBeTruthy();
    });
  });
});
