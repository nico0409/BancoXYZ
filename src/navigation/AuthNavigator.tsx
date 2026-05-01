import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import Box from '@/components/Box';
import Text from '@/components/Text';

const LoginPlaceholder = () => (
  <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="mainBackground">
    <Text variant="header">Login Screen</Text>
  </Box>
);

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginPlaceholder} />
    </Stack.Navigator>
  );
}
