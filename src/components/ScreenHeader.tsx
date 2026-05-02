import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import Box from '@/components/Box';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

interface ScreenHeaderProps {
  title?: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const theme = useTheme<Theme>();

  return (
    <Box flexDirection="row" alignItems="center" paddingVertical="m" marginBottom="m">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <ArrowLeft color={theme.colors.primary} size={24} />
      </TouchableOpacity>

      {title && (
        <Text variant="subheader" color="text" marginLeft="m">
          {title}
        </Text>
      )}
    </Box>
  );
}
