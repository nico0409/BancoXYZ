import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@shopify/restyle';
import { render, fireEvent, screen } from '@testing-library/react-native';
import React from 'react';

import { useTransferHistoryQuery } from '../../api/useTransferHistoryQuery';
import { TransferHistoryScreen } from '../TransferHistoryScreen';

import theme from '@/theme/theme';

jest.mock('../../api/useTransferHistoryQuery');
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'es-CO' },
  }),
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

const mockTransfers = [
  {
    id: '1',
    value: 1000,
    currency: 'USD',
    date: '2024-08-25',
    payeer: {
      document: '123',
      name: 'Ronaldo de Assis Moreira',
    },
  },
  {
    id: '2',
    value: 3500,
    currency: 'USD',
    date: '2024-06-12',
    payeer: {
      document: '456',
      name: 'Lionel Andres Messi',
    },
  },
  {
    id: '3',
    value: 2000,
    currency: 'USD',
    date: '2026-05-01',
    payeer: {
      document: '789',
      name: 'Maria Silva',
    },
  },
];

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <TransferHistoryScreen />
      </NavigationContainer>
    </ThemeProvider>,
  );

describe('TransferHistoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a loading indicator when isLoading is true', () => {
    (useTransferHistoryQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    renderComponent();
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders the list of transfers successfully', () => {
    (useTransferHistoryQuery as jest.Mock).mockReturnValue({
      data: mockTransfers,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });

    renderComponent();

    expect(screen.getByText('Ronaldo de Assis Moreira')).toBeTruthy();
    expect(screen.getByText('Lionel Andres Messi')).toBeTruthy();
    expect(screen.getByText('Maria Silva')).toBeTruthy();
  });

  describe('Filter Engine', () => {
    beforeEach(() => {
      (useTransferHistoryQuery as jest.Mock).mockReturnValue({
        data: mockTransfers,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
    });

    it('filters by name correctly', () => {
      renderComponent();

      const searchInput = screen.getByPlaceholderText('history.searchNamePlaceholder');
      fireEvent.changeText(searchInput, 'Ronaldo');

      expect(screen.getByText('Ronaldo de Assis Moreira')).toBeTruthy();
      expect(screen.queryByText('Lionel Andres Messi')).toBeNull();
      expect(screen.queryByText('Maria Silva')).toBeNull();
    });

    it('filters cumulatively (AND) by name and date', () => {
      renderComponent();

      const slidersButton = screen.getByTestId('sliders-button');
      fireEvent.press(slidersButton);
      const dateFilterButton = screen.getByText(/history.filterData/);
      fireEvent.press(dateFilterButton);

      const nameInput = screen.getByPlaceholderText('history.searchNamePlaceholder');
      fireEvent.changeText(nameInput, 'Maria');

      const valueFilterButton = screen.getByText(/history.filterValor/);
      fireEvent.press(valueFilterButton);

      const valueInput = screen.getByPlaceholderText('history.searchValuePlaceholder');
      fireEvent.changeText(valueInput, '2000');

      expect(screen.getByText('Maria Silva')).toBeTruthy();
      expect(screen.queryByText('Ronaldo de Assis Moreira')).toBeNull();
    });

    it('is case insensitive when filtering by name', () => {
      renderComponent();

      const searchInput = screen.getByPlaceholderText('history.searchNamePlaceholder');
      fireEvent.changeText(searchInput, 'ronaldo');

      expect(screen.getByText('Ronaldo de Assis Moreira')).toBeTruthy();
    });

    it('shows empty state when no transfers match the filter', () => {
      renderComponent();

      const searchInput = screen.getByPlaceholderText('history.searchNamePlaceholder');
      fireEvent.changeText(searchInput, 'Zebra');

      expect(screen.getByText('history.emptyState')).toBeTruthy();
      expect(screen.queryByText('Ronaldo de Assis Moreira')).toBeNull();
    });
  });

  describe('Interaction', () => {
    it('navigates to TransferDetail with correct params when a card is pressed', () => {
      (useTransferHistoryQuery as jest.Mock).mockReturnValue({
        data: mockTransfers,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });

      renderComponent();

      const transferCard = screen.getByText('Ronaldo de Assis Moreira');
      fireEvent.press(transferCard);

      expect(mockNavigate).toHaveBeenCalledWith('TransferDetail', {
        transfer: mockTransfers[0],
      });
    });
  });
});
