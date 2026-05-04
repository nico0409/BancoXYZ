import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { ArrowUpRight, FileText } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, TouchableOpacity } from 'react-native';

import { useTransferHistoryQuery } from '../api/useTransferHistoryQuery';

import Box from '@/components/Box';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

export function RecentTransfers() {
  const { t, i18n } = useTranslation();
  const theme = useTheme<Theme>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { data, isLoading, isError } = useTransferHistoryQuery();

  const recentTransactions = data?.slice(0, 3) || [];

  const formatCurrency = (value: number, currency: string) => {
    const locale = i18n.language.includes('es') ? 'es-CO' : 'pt-BR';
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Math.abs(value));
  };

  const handleGoToHistory = () => {
    navigation.navigate('HistoryTab');
  };

  if (isLoading) {
    return (
      <Box marginTop="xl" paddingVertical="xl" alignItems="center">
        <ActivityIndicator color={theme.colors.primary} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box marginTop="xl" padding="m" backgroundColor="primaryLight" borderRadius="m">
        <Text variant="caption" color="primary" textAlign="center">
          {t('history.error')}
        </Text>
      </Box>
    );
  }

  return (
    <Box marginTop="xl">
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="m">
        <TouchableOpacity activeOpacity={0.7} onPress={handleGoToHistory}>
          <Text variant="subheader" color="text" fontSize={24}>
            {t('transfer.recentTitle')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} onPress={handleGoToHistory}>
          <Text variant="caption" color="primary" fontWeight="bold">
            {t('transfer.viewAll')}
          </Text>
        </TouchableOpacity>
      </Box>

      {recentTransactions.length === 0 ? (
        <Box
          backgroundColor="cardBackground"
          padding="l"
          borderRadius="m"
          alignItems="center"
          justifyContent="center"
          borderWidth={1}
          borderColor="mainBackground"
          borderStyle="dashed"
        >
          <FileText color={theme.colors.textSecondary} size={32} />
          <Text variant="body" color="textSecondary" marginTop="s" textAlign="center">
            {t('transfer.noTransactions')}
          </Text>
        </Box>
      ) : (
        <Box
          backgroundColor="cardBackground"
          borderRadius="l"
          paddingHorizontal="m"
          paddingVertical="s"
        >
          {recentTransactions.map((tx, index) => (
            <Box
              key={`${tx.payeer.document}-${index}`}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              paddingVertical="m"
              borderBottomWidth={index === recentTransactions.length - 1 ? 0 : 1}
              borderBottomColor="mainBackground"
            >
              <Box flexDirection="row" alignItems="center" flex={1} marginRight="s">
                <Box
                  backgroundColor="primaryLight"
                  padding="s"
                  borderRadius="round"
                  marginRight="m"
                  opacity={0.8}
                >
                  <ArrowUpRight color={theme.colors.primary} size={20} />
                </Box>
                <Box flex={1}>
                  <Text
                    variant="body"
                    color="text"
                    fontWeight="bold"
                    fontSize={16}
                    numberOfLines={1}
                  >
                    {tx.payeer.name}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    {tx.date}
                  </Text>
                </Box>
              </Box>
              <Text
                variant="body"
                color="primary"
                fontWeight="bold"
                fontSize={16}
                textAlign="right"
              >
                - {formatCurrency(tx.value, tx.currency)}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
