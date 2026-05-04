import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import React from 'react';
import { ScrollView } from 'react-native';

import { HomeScreen } from '../HomeScreen';

import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useBalanceQuery } from '@/features/balance/api/useBalanceQuery';
import { useTransferHistoryQuery } from '@/features/transfer/api/useTransferHistoryQuery';
import theme from '@/theme/theme';

// Mock de store
jest.mock('@/features/auth/store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock de queries
jest.mock('@/features/balance/api/useBalanceQuery', () => ({
  useBalanceQuery: jest.fn(),
}));

jest.mock('@/features/transfer/api/useTransferHistoryQuery', () => ({
  useTransferHistoryQuery: jest.fn(),
}));

// Mock de navegación
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>{component}</NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>,
  );
};

describe('HomeScreen', () => {
  const mockInvalidateQueries = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Inyectamos un usuario de prueba en el store
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: { id: 1, name: 'Nicolas', email: 'nico@example.com' },
        logout: jest.fn(),
      });
    });

    // Simulamos que el balance carga exitosamente
    (useBalanceQuery as jest.Mock).mockReturnValue({
      data: { accountBalance: 12500.5, currency: 'BRL' },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    // Simulamos que el historial de transferencias tiene datos
    (useTransferHistoryQuery as jest.Mock).mockReturnValue({
      data: [
        {
          value: 150,
          date: '01 Mai',
          currency: 'BRL',
          payeer: { name: 'Transferência enviada', document: '1' },
        },
      ],
      isLoading: false,
      isError: false,
    });

    jest.spyOn(queryClient, 'invalidateQueries').mockImplementation(mockInvalidateQueries);
  });

  it('renders correctly with user greeting and balance', () => {
    const { getByText } = renderWithProviders(<HomeScreen />);

    // Verifica que el nombre del usuario aparece
    expect(getByText('Nicolas')).toBeTruthy();
    // Verifica que la traducción del saludo aparece
    expect(getByText('home.greeting,')).toBeTruthy();

    // El componente BalanceCard renderiza los textos
    expect(getByText('home.availableBalance')).toBeTruthy();

    // El componente RecentTransfers renderiza su título
    expect(getByText('transfer.recentTitle')).toBeTruthy();
  });

  it('opens and closes the Profile Modal correctly', async () => {
    const { queryByText, getByTestId } = renderWithProviders(<HomeScreen />);

    const profileButton = getByTestId('profile-button');
    fireEvent.press(profileButton);

    await waitFor(() => {
      expect(queryByText('nico@example.com')).toBeTruthy();
      expect(queryByText('auth.logout')).toBeTruthy();
    });

    const closeButton = getByTestId('close-profile-modal');
    fireEvent.press(closeButton);

    expect(closeButton).toBeTruthy();
  });

  it('triggers refresh when pulling down ScrollView', async () => {
    const { UNSAFE_getByType } = renderWithProviders(<HomeScreen />);

    const scrollView = UNSAFE_getByType(ScrollView);

    const { refreshControl } = scrollView.props;

    await act(async () => {
      await refreshControl.props.onRefresh();
    });

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalled();
    });
  });
});
