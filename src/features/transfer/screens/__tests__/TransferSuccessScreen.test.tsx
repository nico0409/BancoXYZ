import { ThemeProvider } from '@shopify/restyle';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { TransferSuccessScreen } from '../TransferSuccessScreen';

import theme from '@/theme/theme';

const mockNavigate = jest.fn();
const mockUseRoute = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    reset: jest.fn(),
    getParent: () => ({
      navigate: jest.fn(),
    }),
  }),
  useRoute: () => mockUseRoute(),
}));

jest.mock('lottie-react-native', () => 'LottieView');

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('TransferSuccessScreen Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrar el texto de éxito inmediato cuando isScheduled es false', () => {
    mockUseRoute.mockReturnValue({ params: { isScheduled: false } });

    render(<TransferSuccessScreen />, { wrapper });

    expect(screen.getByText('transferSuccess.successTitle')).toBeTruthy();
    expect(screen.getByText('transferSuccess.successSubtitle')).toBeTruthy();
  });

  it('Caso: Renderizado dinámico de éxito - debería mostrar texto de agendamiento cuando isScheduled es true', () => {
    mockUseRoute.mockReturnValue({ params: { isScheduled: true } });

    render(<TransferSuccessScreen />, { wrapper });

    expect(screen.getByText('transferSuccess.scheduledTitle')).toBeTruthy();
    expect(screen.getByText('transferSuccess.scheduledSubtitle')).toBeTruthy();
  });
});
