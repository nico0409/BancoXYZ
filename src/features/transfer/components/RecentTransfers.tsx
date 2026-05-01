import { useTheme } from '@shopify/restyle';
import { ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@/components/Box';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

// Mock de las últimas 3 transacciones (Prueba cambiando esto a un arreglo vacío [] para ver el Empty State)
const MOCK_TRANSACTIONS = [
  { id: '1', title: 'Transferência enviada', amount: -150.0, date: '01 Mai', type: 'out' },
  { id: '2', title: 'Depósito recebido', amount: 500.0, date: '28 Abr', type: 'in' },
  { id: '3', title: 'Pagamento de conta', amount: -85.5, date: '25 Abr', type: 'out' },
];

export function RecentTransfers() {
  const { t, i18n } = useTranslation();
  const theme = useTheme<Theme>();

  const formatCurrency = (value: number) => {
    const locale = i18n.language.includes('es') ? 'es-CO' : 'pt-BR';
    const currency = i18n.language.includes('es') ? 'COP' : 'BRL';
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Math.abs(value));
  };

  return (
    <Box marginTop="xl">
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="m">
        <Text variant="subheader" color="text">
          {t('transfer.recentTitle')}
        </Text>
        <Text variant="caption" color="primary" fontWeight="bold">
          {t('transfer.viewAll')}
        </Text>
      </Box>

      {MOCK_TRANSACTIONS.length === 0 ? (
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
          {MOCK_TRANSACTIONS.map((tx, index) => (
            <Box
              key={tx.id}
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              paddingVertical="m"
              borderBottomWidth={index === MOCK_TRANSACTIONS.length - 1 ? 0 : 1}
              borderBottomColor="mainBackground"
            >
              <Box flexDirection="row" alignItems="center">
                <Box
                  backgroundColor={tx.type === 'in' ? 'success' : 'primaryLight'}
                  padding="s"
                  borderRadius="round"
                  marginRight="m"
                  opacity={0.8}
                >
                  {tx.type === 'in' ? (
                    <ArrowDownLeft color="white" size={20} />
                  ) : (
                    <ArrowUpRight color={theme.colors.primary} size={20} />
                  )}
                </Box>
                <Box>
                  <Text variant="body" color="text" fontWeight="bold">
                    {tx.title}
                  </Text>
                  <Text variant="caption" color="textSecondary">
                    {tx.date}
                  </Text>
                </Box>
              </Box>
              <Text variant="body" color={tx.type === 'in' ? 'success' : 'text'} fontWeight="bold">
                {tx.type === 'out' ? '-' : '+'} {formatCurrency(tx.amount)}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
