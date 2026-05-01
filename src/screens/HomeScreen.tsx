import { useTheme } from '@shopify/restyle';
import { useQueryClient } from '@tanstack/react-query';
import { UserCircle } from 'lucide-react-native'; // <-- Icono de Perfil
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, RefreshControl, TouchableOpacity } from 'react-native';

import Box from '@/components/Box';
import Text from '@/components/Text';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { BalanceCard } from '@/features/balance/components/BalanceCard';
import { ProfileModal } from '@/features/profile/components/ProfileModal'; // <-- Importamos el modal de perfil
import { RecentTransfers } from '@/features/transfer/components/RecentTransfers'; // <-- Importamos las transacciones
import { Theme } from '@/theme/theme';

export function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setRefreshing(false);
  }, [queryClient]);

  const handleProfilePress = () => {
    setIsProfileModalVisible(true);
  };

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.xl }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* ENCABEZADO CON PERFIL */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginTop="xl"
          marginBottom="xl"
        >
          <Box flexDirection="row" alignItems="center">
            <TouchableOpacity onPress={handleProfilePress} activeOpacity={0.7}>
              <UserCircle color={theme.colors.primary} size={44} strokeWidth={1.5} />
            </TouchableOpacity>
            <Box marginLeft="m">
              <Text variant="body" color="textSecondary">
                {t('home.greeting')},
              </Text>
              <Text variant="subheader" color="text">
                {user?.name || 'Usuario'}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* DOMINIO: BALANCE */}
        <BalanceCard />

        {/* DOMINIO: TRANSFERENCIAS */}
        <RecentTransfers />
      </ScrollView>

      <ProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
      />
    </Box>
  );
}
