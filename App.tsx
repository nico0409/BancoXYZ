import { ThemeProvider } from '@shopify/restyle';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/api/queryClient';
import { AnimatedSplashScreen } from '@/components/AnimatedSplashScreen';
import { AppNavigator } from '@/navigation/AppNavigator';
import theme from '@/theme/theme';

import '@/locales';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }
  if (!isAnimationComplete) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AnimatedSplashScreen onAnimationFinish={() => setIsAnimationComplete(true)} />
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AppNavigator />
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
