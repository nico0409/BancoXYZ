import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';
import React from 'react';

import { TransferItem } from '../api/useTransferHistoryQuery';
import { TransferDetailScreen } from '../screens/TransferDetailScreen';
import { TransferHistoryScreen } from '../screens/TransferHistoryScreen';

import { Theme } from '@/theme/theme';

export type HistoryStackParamList = {
  TransferHistory: undefined;
  TransferDetail: { transfer: TransferItem };
};

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export function HistoryNavigator() {
  const theme = useTheme<Theme>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.mainBackground },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="TransferHistory" component={TransferHistoryScreen} />
      <Stack.Screen name="TransferDetail" component={TransferDetailScreen} />
    </Stack.Navigator>
  );
}
