import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { Search } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';

import { TransferItem } from '../api/useTransferHistoryQuery';

import Box from '@/components/Box';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

interface TransferHistoryListProps {
  data: TransferItem[];
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  refetch: () => void;
  hasFiltersApplied: boolean;
}

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function TransferHistoryList({
  data,
  isLoading,
  isError,
  isRefetching,
  refetch,
  hasFiltersApplied,
}: TransferHistoryListProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme<Theme>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const formatCurrency = (value: number, currency: string) => {
    const locale = i18n.language.includes('es') ? 'es-CO' : 'pt-BR';
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
  };

  const renderItem = ({ item }: { item: TransferItem }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('TransferDetail', { transfer: item })}
    >
      <Box
        backgroundColor="mainBackground"
        paddingVertical="m"
        paddingHorizontal="m"
        borderRadius="xl"
        marginBottom="m"
        flexDirection="row"
        alignItems="center"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <Box
          width={48}
          height={48}
          borderRadius="round"
          backgroundColor="primaryLight"
          justifyContent="center"
          alignItems="center"
        >
          <Text color="primary" fontWeight="bold" fontSize={18}>
            {getInitials(item.payeer.name)}
          </Text>
        </Box>

        <Box flex={1} marginLeft="m">
          <Text variant="body" color="text" fontWeight="bold" fontSize={16}>
            {item.payeer.name}
          </Text>
          <Text variant="caption" color="textSecondary" marginTop="xs">
            Date {item.date}
          </Text>
        </Box>

        <Text color="primary" fontWeight="bold" fontSize={16}>
          {formatCurrency(item.value, item.currency)}
        </Text>
      </Box>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Box>
    );
  }

  if (isError && !isLoading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" marginTop="xl">
        <Text variant="body" color="error" textAlign="center">
          Ocurrió un error al cargar el historial. Revisa tu conexión o la consola.
        </Text>
      </Box>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item.payeer.document}-${index}`}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
        />
      }
      ListEmptyComponent={
        <Box flex={1} alignItems="center" justifyContent="center" marginTop="xl">
          <Search color={theme.colors.textSecondary} size={48} />
          <Text variant="body" color="textSecondary" textAlign="center" marginTop="m">
            {hasFiltersApplied ? t('history.emptyState') : t('transfer.noTransactions')}
          </Text>
        </Box>
      }
    />
  );
}
