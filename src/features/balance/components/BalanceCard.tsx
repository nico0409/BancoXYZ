import { useTheme } from '@shopify/restyle';
import { Eye, EyeOff } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

import { useBalanceQuery } from '../api/useBalanceQuery';
import { useBalanceVisibilityStore } from '../store/useBalanceVisibilityStore';

import Box from '@/components/Box';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

export function BalanceCard() {
  const { t, i18n } = useTranslation();
  const theme = useTheme<Theme>();
  const { data, isLoading, isError } = useBalanceQuery();

  const isVisible = useBalanceVisibilityStore((state) => state.isBalanceVisible);
  const toggle = useBalanceVisibilityStore((state) => state.toggleBalanceVisibility);

  const formatCurrency = (value: number, serverCurrency?: string) => {
    const locale = i18n.language.includes('es') ? 'es-CO' : 'pt-BR';
    const currency = serverCurrency || (i18n.language.includes('es') ? 'COP' : 'BRL');
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
  };

  return (
    <Box
      backgroundColor="primaryLight"
      padding="l"
      borderRadius="l"
      shadowColor="text"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.05}
      shadowRadius={10}
      elevation={3}
    >
      {/* Encabezado: etiqueta + botón ojo */}
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="s">
        <Text variant="caption" color="textSecondary">
          {t('home.availableBalance')}
        </Text>
        <TouchableOpacity
          onPress={toggle}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isVisible ? (
            <EyeOff color={theme.colors.textSecondary} size={18} />
          ) : (
            <Eye color={theme.colors.textSecondary} size={18} />
          )}
        </TouchableOpacity>
      </Box>

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
      ) : isVisible ? (
        <Text variant="header" color="text" fontSize={36}>
          {formatCurrency(data?.accountBalance || 0, data?.currency)}
        </Text>
      ) : (
        <Text variant="header" color="text" fontSize={36} letterSpacing={4}>
          •••••••
        </Text>
      )}
    </Box>
  );
}
