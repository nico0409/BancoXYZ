import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';
import React from 'react';

import { TransferFormValues } from '../schemas/transferSchema';
import { TransferErrorScreen } from '../screens/TransferErrorScreen';
import { TransferReviewScreen } from '../screens/TransferReviewScreen';
import { TransferScreen } from '../screens/TransferScreen';
import { TransferSuccessScreen } from '../screens/TransferSuccessScreen';

import { Theme } from '@/theme/theme';

export type TransferStackParamList = {
  TransferForm: undefined;
  TransferReview: { transferData: TransferFormValues; isScheduled: boolean };
  TransferError: { failedData?: TransferFormValues };
  TransferSuccess: { isScheduled: boolean };
};

export type TransferNavProp<T extends keyof TransferStackParamList> = NativeStackNavigationProp<
  TransferStackParamList,
  T
>;

export type TransferRouteProp<T extends keyof TransferStackParamList> = RouteProp<
  TransferStackParamList,
  T
>;

const Stack = createNativeStackNavigator<TransferStackParamList>();

export function TransferNavigator() {
  const theme = useTheme<Theme>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.mainBackground },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="TransferForm" component={TransferScreen} />
      <Stack.Screen name="TransferReview" component={TransferReviewScreen} />
      <Stack.Screen name="TransferError" component={TransferErrorScreen} />
      <Stack.Screen
        name="TransferSuccess"
        component={TransferSuccessScreen}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}
