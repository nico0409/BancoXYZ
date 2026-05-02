import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { CheckCircle2, User, Calendar, DollarSign } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTransferMutation } from '../api/useTransferMutation';
import { TransferNavProp, TransferRouteProp } from '../navigation/TransferNavigator';

import Box from '@/components/Box';
import Button from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

export function TransferReviewScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme<Theme>();
  const route = useRoute<TransferRouteProp<'TransferReview'>>();
  const navigation = useNavigation<TransferNavProp<'TransferReview'>>();

  const { transferData } = route.params;

  const { mutate: executeTransfer, isPending } = useTransferMutation();

  const formatCurrency = (value: number) => {
    const locale = i18n.language.includes('es') ? 'es-CO' : 'pt-BR';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: transferData.currency,
    }).format(value);
  };

  const handleConfirm = () => {
    executeTransfer(transferData, {
      onSuccess: () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'TransferSuccess' }],
        });
      },
      onError: () => {
        navigation.navigate('TransferError', { failedData: transferData });
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} backgroundColor="mainBackground" paddingHorizontal="xl" paddingBottom="xl">
        <ScreenHeader />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          {/* Encabezado */}
          <Box marginBottom="xl" marginTop="m" alignItems="center">
            <Box backgroundColor="primaryLight" padding="m" borderRadius="round" marginBottom="m">
              <CheckCircle2 color={theme.colors.primary} size={40} />
            </Box>
            <Text variant="header" color="primary" textAlign="center">
              {t('transferReview.reviewTitle')}
            </Text>
            <Text variant="body" color="textSecondary" textAlign="center" marginTop="s">
              {t('transferReview.reviewSubtitle')}
            </Text>
          </Box>

          {/* Tarjeta de Resumen */}
          <Box backgroundColor="cardBackground" borderRadius="l" padding="l" gap="l">
            {/* Monto */}
            <Box flexDirection="row" alignItems="center">
              <Box backgroundColor="primaryLight" padding="s" borderRadius="round" marginRight="m">
                <DollarSign color={theme.colors.primary} size={24} />
              </Box>
              <Box flex={1}>
                <Text variant="caption" color="textSecondary">
                  {t('transferReview.reviewAmount')}
                </Text>
                <Text variant="subheader" color="text" fontSize={24}>
                  {formatCurrency(transferData.value)}
                </Text>
              </Box>
            </Box>

            <Box height={1} backgroundColor="mainBackground" />

            {/* Destinatario */}
            <Box flexDirection="row" alignItems="center">
              <Box backgroundColor="primaryLight" padding="s" borderRadius="round" marginRight="m">
                <User color={theme.colors.primary} size={24} />
              </Box>
              <Box flex={1}>
                <Text variant="caption" color="textSecondary">
                  {t('transferReview.reviewPayeer')}
                </Text>
                <Text variant="body" color="text" fontWeight="bold">
                  {transferData.payeerDocument}
                </Text>
              </Box>
            </Box>

            <Box height={1} backgroundColor="mainBackground" />

            {/* Fecha */}
            <Box flexDirection="row" alignItems="center">
              <Box backgroundColor="primaryLight" padding="s" borderRadius="round" marginRight="m">
                <Calendar color={theme.colors.primary} size={24} />
              </Box>
              <Box flex={1}>
                <Text variant="caption" color="textSecondary">
                  {t('transferReview.reviewDate')}
                </Text>
                <Text variant="body" color="text" fontWeight="bold">
                  {transferData.transferDate}
                </Text>
              </Box>
            </Box>
          </Box>

          <Box flex={1} minHeight={40} />

          <Box paddingBottom="xl">
            <Button
              label={t('transferReview.confirmButton')}
              onPress={handleConfirm}
              isLoading={isPending}
            />
          </Box>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
}
