import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { AlertTriangle, CalendarClock } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TransferNavProp } from '../navigation/TransferNavigator';

import Box from '@/components/Box';
import Button from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

export function TransferErrorScreen() {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const navigation = useNavigation<TransferNavProp<'TransferError'>>();

  const handleRetry = () => {
    navigation.navigate('TransferForm');
  };

  const handleSchedule = () => {
    navigation.navigate('TransferForm');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} backgroundColor="mainBackground" paddingHorizontal="xl" paddingBottom="xl">
        <ScreenHeader />
        <Box justifyContent="center" alignItems="center" marginBottom="l">
          <Box
            backgroundColor="error"
            borderRadius="round"
            position="absolute"
            width={96}
            height={96}
            style={{ opacity: 0.1 }}
          />
          <AlertTriangle color={theme.colors.error} size={48} />
        </Box>

        <Text variant="header" color="text" textAlign="center" marginBottom="m">
          {t('transfer.errorTitle')}
        </Text>
        <Text variant="body" color="textSecondary" textAlign="center" marginBottom="xl">
          {t('transfer.errorMessage')}
        </Text>

        <Box
          backgroundColor="primaryLight"
          padding="l"
          borderRadius="m"
          width="100%"
          alignItems="center"
          marginBottom="xl"
        >
          <CalendarClock
            color={theme.colors.primary}
            size={32}
            style={{ marginBottom: theme.spacing.s }}
          />
          <Text variant="body" color="primary" textAlign="center" fontWeight="bold">
            {t('transfer.schedulePrompt')}
          </Text>
        </Box>

        <Box width="100%" gap="m">
          <Button label={t('transfer.scheduleButton')} onPress={handleSchedule} />
          <Button label={t('transfer.retryButton')} onPress={handleRetry} variant="outline" />
        </Box>
      </Box>
    </SafeAreaView>
  );
}
