import { useTheme } from '@shopify/restyle';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, RefreshControl } from 'react-native';

import Box from '@/components/Box';
import LanguageToggle from '@/components/LanguageToggle';
import Text from '@/components/Text';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { BalanceCard } from '@/features/balance/components/BalanceCard';
import { Theme } from '@/theme/theme';

export function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setRefreshing(false);
  }, [queryClient]);

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.xl }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginTop="xl"
          marginBottom="xl"
        >
          <Box>
            <Text variant="body" color="textSecondary">
              {t('home.greeting')},
            </Text>
            <Text variant="subheader" color="primary">
              {user?.name || 'Usuario'}
            </Text>
          </Box>
          <LanguageToggle />
        </Box>

        <BalanceCard />
      </ScrollView>
    </Box>
  );
}
