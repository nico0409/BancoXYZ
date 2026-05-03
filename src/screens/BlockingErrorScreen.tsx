import ErrorConeAnimation from '@assets/animations/Errorcone.json';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@/components/Box';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { errorStore } from '@/store/useErrorStore';

const BlockingErrorScreen = () => {
  const { errorCode, errorMessage } = errorStore.getState();
  const { t } = useTranslation();

  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  const displayMessage =
    errorMessage || (errorCode ? t(`errors.${errorCode}`) : t('common.error_message'));

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
          source={ErrorConeAnimation}
          autoPlay={false}
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </Box>

      <Box width="100%" alignItems="center">
        <Text variant="header" textAlign="center" marginBottom="m">
          {t('common.error_title')}
        </Text>
        <Text variant="body" textAlign="center" color="textSecondary" marginBottom="xl">
          {displayMessage}
        </Text>
      </Box>

      <Box width="100%" marginTop="l">
        <Button
          label={t('common.retry')}
          onPress={() => errorStore.getState().clearError()}
          variant="primary"
        />
      </Box>
    </Box>
  );
};

export default BlockingErrorScreen;
