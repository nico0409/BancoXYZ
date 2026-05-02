import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTheme } from '@shopify/restyle';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Easing, Platform, TouchableOpacity } from 'react-native';

import Box from '@/components/Box';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

interface AnimatedDatePickerProps {
  visible: boolean;
  value: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
}

export function AnimatedDatePicker({ visible, value, onChange }: AnimatedDatePickerProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme<Theme>();
  const [showPicker, setShowPicker] = useState(false);

  // useState con lazy initializer: se crea una sola vez, es un valor de React (no un ref)
  // por lo que el linter permite usarlo en el render sin restricciones.
  const [anim] = useState(() => new Animated.Value(visible ? 1 : 0));
  const [slideX] = useState(() => anim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }));

  useEffect(() => {
    if (visible) {
      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
        // setShowPicker dentro del callback (async) es válido para el linter
      }).start(({ finished }) => {
        if (finished) setShowPicker(false);
      });
    }
  }, [visible, anim]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={{ opacity: anim, transform: [{ translateX: slideX }] }}
    >
      <Box marginTop="s">
        <Text variant="caption" color="textSecondary" marginBottom="xs">
          {t('newTransfer.dateLabel')}
        </Text>

        <TouchableOpacity onPress={() => setShowPicker((prev) => !prev)} activeOpacity={0.7}>
          <Box
            flexDirection="row"
            alignItems="center"
            backgroundColor="primaryLight"
            padding="m"
            borderRadius="m"
          >
            <CalendarIcon color={theme.colors.primary} size={20} />
            <Text variant="body" color="primary" marginLeft="s" fontWeight="bold">
              {value.toLocaleDateString(i18n.language)}
            </Text>
          </Box>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={value}
            mode="date"
            display="spinner"
            minimumDate={new Date()}
            onChange={onChange}
          />
        )}

        {showPicker && (
          <Button
            label={Platform.OS === 'ios' ? 'Confirmar Data' : 'Confirmar'}
            onPress={() => setShowPicker(false)}
            variant="outline"
          />
        )}
      </Box>
    </Animated.View>
  );
}
