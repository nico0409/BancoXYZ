import { useTheme } from '@shopify/restyle';
import React, { forwardRef } from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native';

import Box from './Box';
import Text from './Text';

import { Theme } from '@/theme/theme';

export interface TextInputProps extends RNTextInputProps {
  label: string;
  error?: string;
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(({ label, error, ...props }, ref) => {
  const theme = useTheme<Theme>();

  return (
    <Box marginBottom="m">
      <Text variant="caption" color="textSecondary" marginBottom="xs">
        {label}
      </Text>

      <Box
        borderWidth={1}
        borderColor={error ? 'error' : 'textSecondary'}
        borderRadius="m"
        paddingHorizontal="m"
        paddingVertical="s"
        backgroundColor="mainBackground"
      >
        <RNTextInput
          ref={ref}
          placeholderTextColor={theme.colors.textSecondary}
          style={{
            color: theme.colors.text,
            fontSize: theme.textVariants.body.fontSize,

            padding: 0,
          }}
          {...props}
        />
      </Box>

      {/* Mensaje de Error (Solo se renderiza si la prop error existe) */}
      {error && (
        <Text variant="caption" color="error" marginTop="xs">
          {error}
        </Text>
      )}
    </Box>
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;
