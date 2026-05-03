import { useTheme } from '@shopify/restyle';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTransferHistoryQuery } from '../api/useTransferHistoryQuery';
import { TransferHistoryList } from '../components/TransferHistoryList';
import { TransferHistorySearch } from '../components/TransferHistorySearch';

import Box from '@/components/Box';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

export function TransferHistoryScreen() {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();

  const { data, isLoading, isError, refetch, isRefetching } = useTransferHistoryQuery();

  const [searchName, setSearchName] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const filteredTransfers = useMemo(() => {
    if (!data) return [];

    return data.filter((transfer) => {
      const matchesName = transfer.payeer.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesValue = searchValue ? transfer.value.toString().includes(searchValue) : true;
      const matchesDate = searchDate ? transfer.date.includes(searchDate) : true;

      return matchesName && matchesValue && matchesDate;
    });
  }, [data, searchName, searchValue, searchDate]);

  const hasFiltersApplied = Boolean(searchName || searchValue || searchDate);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackground }}>
      <Box flex={1} backgroundColor="mainBackground" paddingHorizontal="xl">
        <Box alignItems="center" marginTop="xl" paddingTop="m" marginBottom="l">
          <Text variant="subheader" color="primary" fontWeight="bold" textAlign="center">
            {t('history.title')}
          </Text>
        </Box>

        <TransferHistorySearch
          searchName={searchName}
          setSearchName={setSearchName}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          searchDate={searchDate}
          setSearchDate={setSearchDate}
        />

        <TransferHistoryList
          data={filteredTransfers}
          isLoading={isLoading}
          isError={isError}
          isRefetching={isRefetching}
          refetch={refetch}
          hasFiltersApplied={hasFiltersApplied}
        />
      </Box>
    </SafeAreaView>
  );
}
