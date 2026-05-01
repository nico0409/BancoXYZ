import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';

import Box from '@/components/Box';
import { useAutoLogout } from '@/features/auth/hooks/useAutoLogout';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { Theme } from '@/theme/theme';

export function AppNavigator() {
  useAutoLogout();
  const { token, isRestoring, restoreSession } = useAuthStore();
  const theme = useTheme<Theme>();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isRestoring) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Box>
    );
  }

  return (
    <NavigationContainer>{token ? <MainTabNavigator /> : <AuthNavigator />}</NavigationContainer>
  );
}
