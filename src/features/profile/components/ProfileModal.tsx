import { useTheme } from '@shopify/restyle';
import { useQueryClient } from '@tanstack/react-query';
import { UserCircle, X, LogOut } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

import Box from '@/components/Box';
import LanguageToggle from '@/components/LanguageToggle';
import Text from '@/components/Text';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { Theme } from '@/theme/theme';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileModal({ visible, onClose }: ProfileModalProps) {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    onClose();
    await logout();
    queryClient.clear();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        {/* Fondo oscurecido */}
        <Box flex={1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} />
      </TouchableWithoutFeedback>

      {/* Tarjeta del modal flotando desde abajo */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="mainBackground"
        borderTopLeftRadius="xl"
        borderTopRightRadius="xl"
        padding="xl"
        paddingBottom="xxl"
        shadowColor="text"
        shadowOffset={{ width: 0, height: -5 }}
        shadowOpacity={0.1}
        shadowRadius={10}
        elevation={20}
      >
        <Box flexDirection="row" justifyContent="flex-end" marginBottom="s">
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <X color={theme.colors.textSecondary} size={24} />
          </TouchableOpacity>
        </Box>

        <Box alignItems="center" marginBottom="l">
          <UserCircle color={theme.colors.primary} size={80} strokeWidth={1} />
          <Text variant="subheader" color="text" marginTop="m">
            {user?.name || 'Usuario'}
          </Text>
          <Text variant="caption" color="textSecondary" marginTop="xs">
            {user?.email || 'usuario@bancoxyz.com'}
          </Text>
        </Box>

        <Box
          backgroundColor="cardBackground"
          borderRadius="l"
          padding="m"
          marginBottom="l"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text variant="body" color="text" fontWeight="bold">
            {t('home.language', 'Idioma')}
          </Text>
          <LanguageToggle />
        </Box>

        <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            paddingVertical="m"
            borderWidth={1}
            borderColor="error"
            borderRadius="m"
            backgroundColor="mainBackground"
          >
            <LogOut color={theme.colors.error} size={20} style={{ marginRight: theme.spacing.s }} />
            <Text variant="body" color="error" fontWeight="bold">
              {t('auth.logout', 'Cerrar sesión')}
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Modal>
  );
}
