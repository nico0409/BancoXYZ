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
  onOpen?: () => void;
}

export function AnimatedDatePicker({ visible, value, onChange, onOpen }: AnimatedDatePickerProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme<Theme>();
  const [showPicker, setShowPicker] = useState(false);

  const [anim] = useState(() => new Animated.Value(visible ? 1 : 0));
  const [slideX] = useState(() => anim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }));
  const [tomorrow] = useState(() => new Date(Date.now() + 86400000));

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
      }).start(({ finished }) => {
        if (finished) setShowPicker(false);
      });
    }
  }, [visible, anim]);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    onChange(event, date);
  };

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={{ opacity: anim, transform: [{ translateX: slideX }] }}
    >
      <Box marginTop="s">
        <Text variant="caption" color="textSecondary" marginBottom="xs">
          {t('newTransfer.dateLabel')}
        </Text>

        <TouchableOpacity
          testID="date-picker-button"
          onPress={() => {
            setShowPicker(true);
            onOpen?.();
          }}
          activeOpacity={0.7}
        >
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
          <Box marginTop="s">
            <DateTimePicker
              value={value}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={tomorrow}
              onChange={handleChange}
              style={Platform.OS === 'ios' ? { height: 120, width: '100%' } : {}}
            />
            {Platform.OS === 'ios' && (
              <Box marginTop="s">
                <Button
                  label={t('common.accept')}
                  onPress={() => setShowPicker(false)}
                  variant="outline"
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Animated.View>
  );
}
