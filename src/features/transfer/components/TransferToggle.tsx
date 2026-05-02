import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, TouchableOpacity } from 'react-native';

import Box from '@/components/Box';
import { Theme } from '@/theme/theme';

interface TransferToggleProps {
  isScheduled: boolean;
  onToggle: (scheduled: boolean) => void;
}

export function TransferToggle({ isScheduled, onToggle }: TransferToggleProps) {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();

  // useState lazy initializer: Animated.Value es un valor de React, no un ref.
  // El linter permite usarlo en el render sin restricciones.
  const [toggleAnim] = useState(() => new Animated.Value(isScheduled ? 1 : 0));
  const [indicatorTranslateX] = useState(() =>
    toggleAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
  );
  const [immediateTextColor] = useState(() =>
    toggleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.mainBackground, theme.colors.textSecondary],
    }),
  );
  const [scheduledTextColor] = useState(() =>
    toggleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.textSecondary, theme.colors.mainBackground],
    }),
  );

  const handlePress = (scheduled: boolean) => {
    Animated.spring(toggleAnim, {
      toValue: scheduled ? 1 : 0,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
    onToggle(scheduled);
  };

  return (
    <Box
      backgroundColor="cardBackground"
      borderRadius="m"
      padding="xs"
      marginBottom="l"
      style={{ overflow: 'hidden' }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: theme.spacing.xs,
          bottom: theme.spacing.xs,
          width: '50%',
          backgroundColor: theme.colors.primary,
          borderRadius: theme.borderRadii.s,
          transform: [{ translateX: indicatorTranslateX }],
        }}
      />

      <Box flexDirection="row">
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => handlePress(false)}
          activeOpacity={0.8}
        >
          <Box padding="s" alignItems="center">
            <Animated.Text
              style={{
                color: immediateTextColor,
                fontWeight: 'bold',
                fontSize: theme.textVariants.body.fontSize,
              }}
            >
              {t('newTransfer.tabImmediate')}
            </Animated.Text>
          </Box>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex: 1 }} onPress={() => handlePress(true)} activeOpacity={0.8}>
          <Box padding="s" alignItems="center">
            <Animated.Text
              style={{
                color: scheduledTextColor,
                fontWeight: 'bold',
                fontSize: theme.textVariants.body.fontSize,
              }}
            >
              {t('newTransfer.tabScheduled')}
            </Animated.Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </Box>
  );
}
