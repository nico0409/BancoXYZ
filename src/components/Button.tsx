import { useTheme } from '@shopify/restyle';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import Box from './Box';
import Text from './Text';

import { Theme } from '@/theme/theme';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export default function Button({
  label,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const theme = useTheme<Theme>();

  // Definimos los estilos basados en la variante elegida
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          bg: 'primaryLight' as keyof Theme['colors'],
          text: 'primary' as keyof Theme['colors'],
        };
      case 'outline':
        return {
          bg: 'transparent' as keyof Theme['colors'],
          text: 'primary' as keyof Theme['colors'],
          border: 'primary' as keyof Theme['colors'],
        };
      case 'primary':
      default:
        return {
          bg: 'primary' as keyof Theme['colors'],
          text: 'mainBackground' as keyof Theme['colors'],
        };
    }
  };

  const styles = getVariantStyles();
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity activeOpacity={0.8} disabled={isDisabled} {...props}>
      <Box
        backgroundColor={styles.bg}
        paddingVertical="m"
        paddingHorizontal="xl"
        borderRadius="m"
        alignItems="center"
        justifyContent="center"
        borderWidth={variant === 'outline' ? 1 : 0}
        borderColor={variant === 'outline' ? styles.border : undefined}
        opacity={isDisabled ? 0.6 : 1}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.colors[styles.text]} />
        ) : (
          <Text variant="subheader" fontSize={16} color={styles.text}>
            {label}
          </Text>
        )}
      </Box>
    </TouchableOpacity>
  );
}
