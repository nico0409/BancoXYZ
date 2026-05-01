import { useTheme } from '@shopify/restyle';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';

import { useBalanceQuery } from '../api/useBalanceQuery';

import Box from '@/components/Box';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

export function BalanceCard() {
  const { t, i18n } = useTranslation();
  const theme = useTheme<Theme>();
  const { data, isLoading, isError } = useBalanceQuery();

  const formatCurrency = (value: number) => {
    const locale = i18n.language.includes('es') ? 'es-CO' : 'pt-BR';
    const currency = i18n.language.includes('es') ? 'COP' : 'BRL';
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
  };

  return (
    <Box
      backgroundColor="primaryLight"
      padding="l"
      borderRadius="l"
      // Reemplazamos 'slate800' por 'text', que sí existe en nuestro Theme
      shadowColor="text"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.05}
      shadowRadius={10}
      elevation={3}
    >
      <Text variant="caption" color="textSecondary" marginBottom="s">
        {t('home.availableBalance')}
      </Text>

      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={theme.colors.primary}
          style={{ alignSelf: 'flex-start', marginVertical: 8 }}
        />
      ) : isError ? (
        <Text variant="body" color="error" marginTop="xs">
          {t('home.errorFetching')}
        </Text>
      ) : (
        <Text variant="header" color="text" fontSize={36}>
          {formatCurrency(data?.balance || 0)}
        </Text>
      )}
    </Box>
  );
}
