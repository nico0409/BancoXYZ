import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '@shopify/restyle';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';

import { transferSchema, TransferFormValues } from '../schemas/transferSchema';

import Box from '@/components/Box';
import Button from '@/components/Button';
import Text from '@/components/Text';
import TextInput from '@/components/TextInput';
import { useBalanceQuery } from '@/features/balance/api/useBalanceQuery';
import { BalanceCard } from '@/features/balance/components/BalanceCard';
import { Theme } from '@/theme/theme';

export function TransferScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme<Theme>();

  const [isScheduled, setIsScheduled] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const formatDateToApi = (selectedDate: Date) => {
    return selectedDate.toISOString().split('T')[0];
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      setValue('transferDate', formatDateToApi(selectedDate), { shouldValidate: true });
    }
  };

  const onSubmit = (data: TransferFormValues) => {
    const finalData = {
      ...data,
      transferDate: isScheduled ? data.transferDate : formatDateToApi(new Date()),
    };

    // Aquí a futuro navegaremos a la pantalla de "Review":
    // navigation.navigate('TransferReview', { transferData: finalData });
    console.log('Datos listos para revisión:', finalData);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Box flex={1} backgroundColor="mainBackground" padding="xl">
          <Box marginBottom="xl" marginTop="xl">
            <Text variant="header" color="primary">
              {t('newTransfer.newTransferTitle')}
            </Text>
            <Text variant="body" color="textSecondary">
              {t('newTransfer.newTransferSubtitle')}
            </Text>
          </Box>

          {/* Componente de Saldo */}
          <Box marginBottom="l">
            <BalanceCard />
          </Box>

          {/* Toggle: Ahora vs Agendar */}
          <Box
            flexDirection="row"
            backgroundColor="cardBackground"
            borderRadius="m"
            padding="xs"
            marginBottom="l"
          >
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setIsScheduled(false)}>
              <Box
                backgroundColor={!isScheduled ? 'primary' : 'transparent'}
                padding="s"
                borderRadius="s"
                alignItems="center"
              >
                <Text
                  variant="body"
                  color={!isScheduled ? 'mainBackground' : 'textSecondary'}
                  fontWeight="bold"
                >
                  {t('newTransfer.tabImmediate')}
                </Text>
              </Box>
            </TouchableOpacity>

            <TouchableOpacity style={{ flex: 1 }} onPress={() => setIsScheduled(true)}>
              <Box
                backgroundColor={isScheduled ? 'primary' : 'transparent'}
                padding="s"
                borderRadius="s"
                alignItems="center"
              >
                <Text
                  variant="body"
                  color={isScheduled ? 'mainBackground' : 'textSecondary'}
                  fontWeight="bold"
                >
                  {t('newTransfer.tabScheduled')}
                </Text>
              </Box>
            </TouchableOpacity>
          </Box>

          {/* Formulario */}
          <Box gap="m">
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

            {isScheduled && (
              <Box marginTop="s">
                <Text variant="caption" color="textSecondary" marginBottom="xs">
                  {t('newTransfer.dateLabel')}
                </Text>

                <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    backgroundColor="primaryLight"
                    padding="m"
                    borderRadius="m"
                  >
                    <CalendarIcon color={theme.colors.primary} size={20} />
                    <Text variant="body" color="primary" marginLeft="s" fontWeight="bold">
                      {date.toLocaleDateString(i18n.language)}
                    </Text>
                  </Box>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minimumDate={new Date()}
                    onChange={handleDateChange}
                  />
                )}

                {Platform.OS === 'ios' && showDatePicker && (
                  <Button
                    label="Confirmar Data"
                    onPress={() => setShowDatePicker(false)}
                    variant="outline"
                  />
                )}
              </Box>
            )}

            <Box marginTop="xl">
              <Button label={t('newTransfer.continueButton')} onPress={handleSubmit(onSubmit)} />
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
