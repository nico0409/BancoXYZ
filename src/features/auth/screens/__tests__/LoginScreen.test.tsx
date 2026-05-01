import { ThemeProvider } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native';

import { useLoginMutation } from '../../api/useLoginMutation';
import { LoginScreen } from '../LoginScreen';

import theme from '@/theme/theme';

jest.mock('../../api/useLoginMutation', () => ({
  useLoginMutation: jest.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </QueryClientProvider>,
  );
};

describe('LoginScreen', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLoginMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it('renders correctly', () => {
    const { getByText } = renderWithProviders(<LoginScreen />);

    expect(getByText('auth.welcomeTitle')).toBeTruthy();
    expect(getByText('auth.welcomeSubtitle')).toBeTruthy();
    expect(getByText('auth.submitButton')).toBeTruthy();
  });

  it('shows validation errors when submitting empty form', async () => {
    const { getByText } = renderWithProviders(<LoginScreen />);

    const submitButton = getByText('auth.submitButton');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('O e-mail deve ser válido')).toBeTruthy();
      expect(getByText('A senha deve ter pelo menos 4 caracteres')).toBeTruthy();
    });

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<LoginScreen />);

    const emailInput = getByPlaceholderText('auth.emailPlaceholder');
    const passwordInput = getByPlaceholderText('auth.passwordPlaceholder');
    const submitButton = getByText('auth.submitButton');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('displays error message from backend when login fails', () => {
    (useLoginMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
      error: { response: { status: 401 } },
    });

    const { getByText } = renderWithProviders(<LoginScreen />);

    expect(getByText('auth.errors.unauthorized')).toBeTruthy();
  });

  it('shows loading indicator when request is pending', () => {
    (useLoginMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
      error: null,
    });

    const { queryByText, UNSAFE_getByType } = renderWithProviders(<LoginScreen />);

    expect(queryByText('auth.submitButton')).toBeNull();
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});
