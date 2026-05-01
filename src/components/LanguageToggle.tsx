import { useTheme } from '@shopify/restyle';
import { Globe } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

import Box from './Box';
import Text from './Text';

import { Theme } from '@/theme/theme';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const theme = useTheme<Theme>();

  const toggleLanguage = () => {
    const currentLang = i18n.language || '';
    const nextLang = currentLang.includes('es') ? 'pt-BR' : 'es-CO';
    i18n.changeLanguage(nextLang);
  };

  return (
    <TouchableOpacity onPress={toggleLanguage} activeOpacity={0.8}>
      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor="primaryLight"
        paddingHorizontal="s"
        paddingVertical="xs"
        borderRadius="round"
      >
        <Globe color={theme.colors.primary} size={16} />
        <Text variant="caption" color="primary" marginLeft="xs" fontWeight="bold">
          {i18n.language?.includes('es') ? 'ES' : 'PT'}
        </Text>
      </Box>
    </TouchableOpacity>
  );
}
