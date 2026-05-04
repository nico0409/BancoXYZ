import bankSplashAnimation from '@assets/animations/BANK.json';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import theme from '@/theme/theme';

interface AnimatedSplashScreenProps {
  onAnimationFinish: () => void;
}

export function AnimatedSplashScreen({ onAnimationFinish }: AnimatedSplashScreenProps) {
  const animation = useRef<LottieView>(null);

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        autoPlay
        loop={false}
        source={bankSplashAnimation}
        style={styles.animation}
        onAnimationFinish={onAnimationFinish}
      />
      <Text style={styles.title}>BancoXYZ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.mainBackground,
  },
  animation: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: -20, // Ajuste para que quede más cerca de la animación si es necesario
  },
});
