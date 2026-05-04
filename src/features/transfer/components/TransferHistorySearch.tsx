import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@shopify/restyle';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput as RNTextInput, TouchableOpacity, Platform } from 'react-native';

import Box from '@/components/Box';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

interface TransferHistorySearchProps {
  searchName: string;
  setSearchName: (val: string) => void;
  searchValue: string;
  setSearchValue: (val: string) => void;
  searchDate: string;
  setSearchDate: (val: string) => void;
}

export function TransferHistorySearch({
  searchName,
  setSearchName,
  searchValue,
  setSearchValue,
  searchDate,
  setSearchDate,
}: TransferHistorySearchProps) {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();

  const [activeFilters, setActiveFilters] = useState({ name: true, value: false, date: false });
  const [showFilters, setShowFilters] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchDateObj, setSearchDateObj] = useState<Date | null>(null);

  const toggleFilter = (key: keyof typeof activeFilters) => {
    setActiveFilters((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next[key]) {
        if (key === 'name') setSearchName('');
        if (key === 'value') setSearchValue('');
        if (key === 'date') {
          setSearchDate('');
          setSearchDateObj(null);
          setShowDatePicker(false);
        }
      }
      return next;
    });
  };

  return (
    <Box
      flexDirection="row"
      alignItems="flex-start"
      marginBottom="xl"
      style={{ zIndex: 10, elevation: 10 }}
    >
      <Box flex={1} flexDirection="column" gap="s">
        {activeFilters.name && (
          <Box
            flexDirection="row"
            alignItems="center"
            borderWidth={1}
            borderColor="mainBorder"
            borderRadius="round"
            paddingHorizontal="m"
            height={50}
          >
            <Search color={theme.colors.textSecondary} size={16} />
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
        )}

        {activeFilters.value && (
          <Box
            flexDirection="row"
            alignItems="center"
            borderWidth={1}
            borderColor="mainBorder"
            borderRadius="round"
            paddingHorizontal="m"
            height={50}
          >
            <RNTextInput
              placeholder={t('history.searchValuePlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
              value={searchValue}
              onChangeText={setSearchValue}
              keyboardType="numeric"
              style={{
                flex: 1,
                color: theme.colors.text,
                fontSize: 16,
              }}
            />
          </Box>
        )}

        {activeFilters.date && (
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowDatePicker(true)}>
            <Box
              flexDirection="row"
              alignItems="center"
              borderWidth={1}
              borderColor="mainBorder"
              borderRadius="round"
              paddingHorizontal="m"
              height={50}
            >
              <Text color={searchDate ? 'text' : 'textSecondary'} fontSize={16} numberOfLines={1}>
                {searchDate || t('history.searchDatePlaceholder')}
              </Text>
            </Box>
          </TouchableOpacity>
        )}

        {!activeFilters.name && !activeFilters.value && !activeFilters.date && (
          <Box height={50} justifyContent="center" paddingHorizontal="m">
            <Text color="textSecondary" variant="caption">
              Selecciona un filtro para buscar...
            </Text>
          </Box>
        )}

        {showDatePicker && (
          <Box marginTop="s">
            <DateTimePicker
              value={searchDateObj || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                if (Platform.OS === 'android') {
                  setShowDatePicker(false);
                }
                if (date && event.type !== 'dismissed') {
                  setSearchDateObj(date);
                  setSearchDate(date.toISOString().split('T')[0]); // YYYY-MM-DD
                } else if (Platform.OS === 'ios') {
                  setShowDatePicker(false);
                }
              }}
            />
          </Box>
        )}
      </Box>

      <Box marginLeft="m" style={{ position: 'relative', zIndex: 20, elevation: 20 }}>
        <TouchableOpacity
          testID="sliders-button"
          activeOpacity={0.7}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Box
            width={50}
            height={50}
            borderRadius="round"
            backgroundColor="mainBackground"
            justifyContent="center"
            alignItems="center"
            style={{
              shadowColor: theme.colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <SlidersHorizontal color={theme.colors.text} size={20} />
          </Box>
        </TouchableOpacity>

        {showFilters && (
          <Box
            backgroundColor="mainBackground"
            borderRadius="m"
            paddingVertical="s"
            paddingHorizontal="m"
            style={{
              position: 'absolute',
              top: 60,
              right: 0,
              width: 150,
              shadowColor: theme.colors.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <TouchableOpacity onPress={() => toggleFilter('name')} style={{ paddingVertical: 12 }}>
              <Text
                variant="body"
                color={activeFilters.name ? 'primary' : 'textSecondary'}
                fontWeight={activeFilters.name ? 'bold' : 'normal'}
              >
                {activeFilters.name ? '✓ ' : '  '} {t('history.filterNome') || 'Nome'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFilter('value')} style={{ paddingVertical: 12 }}>
              <Text
                variant="body"
                color={activeFilters.value ? 'primary' : 'textSecondary'}
                fontWeight={activeFilters.value ? 'bold' : 'normal'}
              >
                {activeFilters.value ? '✓ ' : '  '} {t('history.filterValor') || 'Valor'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFilter('date')} style={{ paddingVertical: 12 }}>
              <Text
                variant="body"
                color={activeFilters.date ? 'primary' : 'textSecondary'}
                fontWeight={activeFilters.date ? 'bold' : 'normal'}
              >
                {activeFilters.date ? '✓ ' : '  '} {t('history.filterData') || 'Data'}
              </Text>
            </TouchableOpacity>
          </Box>
        )}
      </Box>
    </Box>
  );
}
