import { useTheme } from '@shopify/restyle';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput as RNTextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTransferHistoryQuery, TransferItem } from '../api/useTransferHistoryQuery';

import Box from '@/components/Box';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function TransferHistoryScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme<Theme>();

  const { data, isLoading, isError, refetch, isRefetching } = useTransferHistoryQuery();

  const [searchName, setSearchName] = useState('');

  const filteredTransfers = useMemo(() => {
    if (!data) return [];

    return data.filter((transfer) => {
      return transfer.payeer.name.toLowerCase().includes(searchName.toLowerCase());
    });
  }, [data, searchName]);

  const formatCurrency = (value: number, currency: string) => {
    const locale = i18n.language.includes('es') ? 'es-CO' : 'pt-BR';
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
  };

  const renderItem = ({ item }: { item: TransferItem }) => (
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
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackground }}>
      <Box flex={1} backgroundColor="mainBackground" paddingHorizontal="xl">
        {/* Decorative Top Glow (Optional, simulated with a Box or omitted) */}
        <Box alignItems="center" marginTop="m" marginBottom="l">
          <Text variant="subheader" color="primary" fontWeight="bold" textAlign="center">
            {t('history.title')}
          </Text>
        </Box>

        {/* Search Bar Row */}
        <Box flexDirection="row" alignItems="center" marginBottom="l">
          <Box
            flex={1}
            flexDirection="row"
            alignItems="center"
            borderWidth={1}
            borderColor="textSecondary"
            borderRadius="round"
            paddingHorizontal="m"
            height={50}
            style={{
              borderColor: '#E2E8F0', // slate-200 for a softer border
            }}
          >
            <Search color={theme.colors.textSecondary} size={20} />
            <RNTextInput
              placeholder={t('history.searchNamePlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              value={searchName}
              onChangeText={setSearchName}
              style={{
                flex: 1,
                marginLeft: theme.spacing.s,
                color: theme.colors.text,
                fontSize: 16,
              }}
            />
          </Box>

          <TouchableOpacity activeOpacity={0.7}>
            <Box
              width={50}
              height={50}
              borderRadius="round"
              backgroundColor="mainBackground"
              justifyContent="center"
              alignItems="center"
              marginLeft="m"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <SlidersHorizontal color={theme.colors.text} size={20} />
            </Box>
          </TouchableOpacity>
        </Box>

        {isLoading && (
          <Box flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </Box>
        )}

        {isError && !isLoading && (
          <Box flex={1} alignItems="center" justifyContent="center" marginTop="xl">
            <Text variant="body" color="error" textAlign="center">
              Ocurrió un error al cargar el historial. Revisa tu conexión o la consola.
            </Text>
          </Box>
        )}

        {!isLoading && !isError && (
          <FlatList
            data={filteredTransfers}
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
                  {!data || data.length === 0
                    ? t('transfer.noTransactions')
                    : t('history.emptyState')}
                </Text>
              </Box>
            }
          />
        )}
      </Box>
    </SafeAreaView>
  );
}
