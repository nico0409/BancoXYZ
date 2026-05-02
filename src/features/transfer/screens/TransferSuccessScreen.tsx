import bookingAnimation from '@assets/animations/booking.json';
import checkAnimation from '@assets/animations/checktick.json';
import { useNavigation, NavigationProp, ParamListBase, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { TransferRouteProp } from '../navigation/TransferNavigator';

import Box from '@/components/Box';
import Button from '@/components/Button';
import Text from '@/components/Text';

export function TransferSuccessScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<TransferRouteProp<'TransferSuccess'>>();

  const { isScheduled } = route.params;

  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  const handleReturnHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'TransferForm' }],
    });
    navigation.getParent()?.navigate('HomeTab');
  };

  return (
    <Box
      flex={1}
      backgroundColor="mainBackground"
      justifyContent="center"
      alignItems="center"
      padding="xl"
    >
      <Box width={200} height={200} marginBottom="l">
        <LottieView
          ref={animationRef}
          source={isScheduled ? bookingAnimation : checkAnimation}
          autoPlay={false}
          loop={false}
          style={{ width: '100%', height: '100%' }}
        />
      </Box>

      <Text variant="header" color="primary" textAlign="center" marginBottom="s">
        {isScheduled ? t('transferSuccess.scheduledTitle') : t('transferSuccess.successTitle')}
      </Text>

      <Text variant="body" color="textSecondary" textAlign="center" marginBottom="xl">
        {isScheduled
          ? t('transferSuccess.scheduledSubtitle')
          : t('transferSuccess.successSubtitle')}
      </Text>

      <Box height={40} />

      <Box width="100%">
        <Button label={t('transferSuccess.backToHomeButton')} onPress={handleReturnHome} />
      </Box>
    </Box>
  );
}
