import { ThemeProvider } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Box from '@/components/Box';
import Text from '@/components/Text';
import theme from '@/theme/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Box
            flex={1}
            backgroundColor="mainBackground"
            justifyContent="center"
            alignItems="center"
          >
            <Box backgroundColor="primaryLight" padding="m" borderRadius="l">
              <Text variant="header" color="primary">
                test de sistema de diseño
              </Text>
              <Text variant="body" color="textSecondary" marginTop="s">
                Arquitectura lista
              </Text>
            </Box>
          </Box>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
