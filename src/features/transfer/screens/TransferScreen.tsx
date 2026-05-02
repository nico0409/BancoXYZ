import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedDatePicker } from '../components/AnimatedDatePicker';
import { TransferToggle } from '../components/TransferToggle';
import { TransferStackParamList } from '../navigation/TransferNavigator';
import { transferSchema, TransferFormValues } from '../schemas/transferSchema';

import Box from '@/components/Box';
import Button from '@/components/Button';
import Text from '@/components/Text';
import TextInput from '@/components/TextInput';
import { useBalanceQuery } from '@/features/balance/api/useBalanceQuery';
import { BalanceCard } from '@/features/balance/components/BalanceCard';
import { Theme } from '@/theme/theme';

export function TransferScreen() {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const navigation = useNavigation<NativeStackNavigationProp<TransferStackParamList>>();
  const [isScheduled, setIsScheduled] = useState(false);
  const [date, setDate] = useState(new Date());

  const { data: balanceData } = useBalanceQuery();
  const serverCurrency = balanceData?.currency || 'BRL';

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      payeerDocument: '',
      currency: 'BRL',
      transferDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (balanceData?.currency) {
      setValue('currency', balanceData.currency);
    }
  }, [balanceData?.currency, setValue]);

  const formatDateToApi = (selectedDate: Date) => selectedDate.toISOString().split('T')[0];

  const onSubmit = (data: TransferFormValues) => {
    const finalData = {
      ...data,
      transferDate: isScheduled ? data.transferDate : formatDateToApi(new Date()),
    };

    navigation.navigate('TransferReview', { transferData: finalData });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackground }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Box
            flex={1}
            backgroundColor="mainBackground"
            paddingHorizontal="xl"
            paddingBottom="xl"
            paddingTop="m"
          >
            <Box marginBottom="xl" marginTop="m">
              <Text variant="header" color="primary">
                {t('newTransfer.newTransferTitle')}
              </Text>
              <Text variant="body" color="textSecondary">
                {t('newTransfer.newTransferSubtitle')}
              </Text>
            </Box>

            <Box marginBottom="l">
              <BalanceCard />
            </Box>

            <TransferToggle isScheduled={isScheduled} onToggle={setIsScheduled} />

            <Box gap="m" flex={1}>
              <Controller
                control={control}
                name="payeerDocument"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t('newTransfer.docLabel')}
                    placeholder={t('newTransfer.docPlaceholder')}
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.payeerDocument?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="value"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={`${t('newTransfer.valueLabel')} (${serverCurrency})`}
                    placeholder={t('newTransfer.valuePlaceholder')}
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={(val) => onChange(parseFloat(val) || undefined)}
                    value={value ? value.toString() : ''}
                    error={errors.value?.message}
                  />
                )}
              />

              <AnimatedDatePicker
                visible={isScheduled}
                value={date}
                onChange={(_event, selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                    setValue('transferDate', formatDateToApi(selectedDate), {
                      shouldValidate: true,
                    });
                  }
                }}
              />

              <Box flex={1} justifyContent="flex-end" marginTop="xl">
                <Button label={t('newTransfer.continueButton')} onPress={handleSubmit(onSubmit)} />
              </Box>
            </Box>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
