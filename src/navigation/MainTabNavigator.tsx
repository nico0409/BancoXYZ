import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@shopify/restyle';
import { Home, Send, List } from 'lucide-react-native';
import React from 'react';

import { HistoryNavigator } from '@/features/transfer/navigation/HistoryNavigator';
import { TransferNavigator } from '@/features/transfer/navigation/TransferNavigator';
import { HomeScreen } from '@/screens/HomeScreen';
import { Theme } from '@/theme/theme';

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
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          tabBarLabel: 'Início',
        }}
      />
      <Tab.Screen
        name="TransferTab"
        component={TransferNavigator}
        options={{
          tabBarIcon: ({ color }) => <Send color={color} size={24} />,
          tabBarLabel: 'Transferir',
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryNavigator}
        options={{
          tabBarIcon: ({ color }) => <List color={color} size={24} />,
          tabBarLabel: 'Histórico',
        }}
      />
    </Tab.Navigator>
  );
}
