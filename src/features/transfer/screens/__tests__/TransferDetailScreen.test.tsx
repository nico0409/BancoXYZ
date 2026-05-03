import { NavigationContainer, useRoute } from '@react-navigation/native';
import { ThemeProvider } from '@shopify/restyle';
import { render, screen, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Share } from 'react-native';

import { TransferDetailScreen } from '../TransferDetailScreen';

import theme from '@/theme/theme';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'es-CO' },
  }),
}));

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
    useRoute: jest.fn(),
  };
});

jest
  .spyOn(Share, 'share')
  .mockImplementation(() => Promise.resolve({ action: Share.sharedAction }));

const mockTransfer = {
  id: '1',
  value: 2500.5,
  currency: 'USD',
  date: '2026-10-15',
  payeer: {
    document: '123456789',
    name: 'Carlos Valderrama',
  },
};

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <TransferDetailScreen />
      </NavigationContainer>
    </ThemeProvider>,
  );

describe('TransferDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null safely if no transfer params are provided (Fallback)', () => {
    (useRoute as jest.Mock).mockReturnValue({ params: {} });

    const { toJSON } = renderComponent();
    expect(toJSON()).toBeNull();
  });

  it('renders data correctly when params are injected', () => {
    (useRoute as jest.Mock).mockReturnValue({ params: { transfer: mockTransfer } });

    renderComponent();

    expect(screen.getByText('Carlos Valderrama')).toBeTruthy();
    expect(screen.getByText('123456789')).toBeTruthy();
    expect(screen.getByText(/2[.,]500/)).toBeTruthy();
    expect(screen.getByText('2026-10-15')).toBeTruthy();

    expect(screen.getByText('CV')).toBeTruthy();
  });

  it('triggers Share API when share button is pressed', async () => {
    (useRoute as jest.Mock).mockReturnValue({ params: { transfer: mockTransfer } });

    renderComponent();

    const shareButton = screen.getByText('history.shareReceipt');
    fireEvent.press(shareButton);

    expect(Share.share).toHaveBeenCalledTimes(1);
    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('Carlos Valderrama'),
      }),
    );
  });
});
