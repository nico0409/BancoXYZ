import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { ArrowLeft, Share2 } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, ScrollView, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HistoryStackParamList } from '../navigation/HistoryNavigator';

import Box from '@/components/Box';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { errorStore } from '@/store/useErrorStore';
import { Theme } from '@/theme/theme';

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function TransferDetailScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme<Theme>();
  const route = useRoute<RouteProp<HistoryStackParamList, 'TransferDetail'>>();
  const navigation = useNavigation();

  const transfer = route.params?.transfer;

  const formatCurrency = (value: number, currency: string) => {
    const locale = i18n.language.includes('es') ? 'es-CO' : 'pt-BR';
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
  };

  const handleShare = async () => {
    if (!transfer) return;
    try {
      const message = `${t('history.shareReceipt') || 'Comprobante de Transferencia'}\n\n${t('history.recipientName') || 'Nombre'}: ${transfer.payeer.name}\n${t('history.recipientDocument') || 'Documento'}: ${transfer.payeer.document}\n${t('history.sentValue') || 'Valor'}: ${formatCurrency(transfer.value, transfer.currency)}\n${t('history.filterData') || 'Fecha'}: ${transfer.date}`;
      await Share.share({ message });
    } catch {
      errorStore
        .getState()
        .setBlockingError('UNKNOWN_ERROR', 'Ocurrio un error al compartir el comprobante', false);
    }
  };

  if (!transfer) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.mainBackground }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Box flex={1} backgroundColor="mainBackground" padding="xl">
          {/* Header */}
          <Box flexDirection="row" alignItems="center" marginBottom="xl">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft color={theme.colors.primary} size={28} />
            </TouchableOpacity>
            <Text variant="subheader" color="text" marginLeft="m" fontWeight="bold">
              {t('history.detailTitle') || 'Detalle del Movimiento'}
            </Text>
          </Box>

          <Box
            backgroundColor="cardBackground"
            padding="xl"
            borderRadius="xl"
            alignItems="center"
            marginBottom="l"
            style={{
              elevation: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            }}
          >
            <Box
              width={64}
              height={64}
              borderRadius="round"
              backgroundColor="primaryLight"
              justifyContent="center"
              alignItems="center"
              marginBottom="m"
            >
              <Text color="primary" fontWeight="bold" fontSize={24}>
                {getInitials(transfer.payeer.name)}
              </Text>
            </Box>

            <Text variant="caption" color="textSecondary" marginBottom="xs">
              {t('history.sentValue') || 'Valor enviado'}
            </Text>
            <Text variant="header" color="primary" fontSize={36}>
              {formatCurrency(transfer.value, transfer.currency)}
            </Text>
            <Box
              marginTop="m"
              paddingHorizontal="m"
              paddingVertical="xs"
              backgroundColor="primaryLight"
              borderRadius="round"
            >
              <Text color="primary" fontWeight="bold" fontSize={12}>
                {transfer.date}
              </Text>
            </Box>
          </Box>

          <Box
            backgroundColor="cardBackground"
            padding="l"
            borderRadius="xl"
            style={{
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            }}
          >
            <Text variant="subheader" color="text" marginBottom="m" fontWeight="bold">
              {t('history.recipientInfo') || 'Información del Destinatario'}
            </Text>

            <DetailRow
              label={t('history.recipientName') || 'Nombre'}
              value={transfer.payeer.name}
            />
            <DetailRow
              label={t('history.recipientDocument') || 'Documento'}
              value={transfer.payeer.document}
            />
            <DetailRow label={t('history.currency') || 'Moneda'} value={transfer.currency} />
            <DetailRow label={t('history.status') || 'Estado'} value="Completado" isLast />
          </Box>

          <Box flex={1} />

          <Box marginTop="xl">
            <Button
              variant="outline"
              label={t('history.shareReceipt') || 'Compartir comprobante'}
              onPress={handleShare}
              icon={<Share2 size={20} color={theme.colors.primary} />}
            />
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper component for detail rows
const DetailRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <Box
    flexDirection="row"
    justifyContent="space-between"
    paddingVertical="m"
    borderBottomWidth={isLast ? 0 : 1}
    borderBottomColor="mainBackground"
  >
    <Text variant="body" color="textSecondary">
      {label}
    </Text>
    <Text variant="body" color="text" fontWeight="bold">
      {value}
    </Text>
  </Box>
);
