import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@shopify/restyle';
import { Home, Send, List } from 'lucide-react-native';
import React from 'react';

import Box from '@/components/Box';
import Text from '@/components/Text';
import { Theme } from '@/theme/theme';

const HomePlaceholder = () => (
  <Box flex={1} justifyContent="center" alignItems="center">
    <Text>Inicio</Text>
  </Box>
);
const TransferPlaceholder = () => (
  <Box flex={1} justifyContent="center" alignItems="center">
    <Text>Transferir</Text>
  </Box>
);
const HistoryPlaceholder = () => (
  <Box flex={1} justifyContent="center" alignItems="center">
    <Text>Historial</Text>
  </Box>
);

const Tab = createBottomTabNavigator();

export function MainTabNavigator() {
  const theme = useTheme<Theme>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.mainBackground,
          borderTopColor: theme.colors.cardBackground,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomePlaceholder}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          tabBarLabel: 'Início',
        }}
      />
      <Tab.Screen
        name="TransferTab"
        component={TransferPlaceholder}
        options={{
          tabBarIcon: ({ color }) => <Send color={color} size={24} />,
          tabBarLabel: 'Transferir',
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryPlaceholder}
        options={{
          tabBarIcon: ({ color }) => <List color={color} size={24} />,
          tabBarLabel: 'Histórico',
        }}
      />
    </Tab.Navigator>
  );
}
