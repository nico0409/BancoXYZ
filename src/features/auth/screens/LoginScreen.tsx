import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'; // <-- Añade TouchableOpacity

import { useLoginMutation } from '../api/useLoginMutation';
import { loginSchema, LoginFormValues } from '../schemas/loginSchema';

import Box from '@/components/Box';
import Button from '@/components/Button';
import LanguageToggle from '@/components/LanguageToggle';
import Text from '@/components/Text';
import TextInput from '@/components/TextInput';

export function LoginScreen() {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate: loginMutation, isPending, isError, error } = useLoginMutation();

  const onSubmit = (data: LoginFormValues) => {
    loginMutation(data);
  };

  const getErrorMessage = () => {
    if (error?.response?.status === 401) return t('auth.errors.unauthorized');
    if (error?.response?.status === 400) return t('auth.errors.badRequest');
    return t('auth.errors.network');
  };

  return (
    <Box flex={1} backgroundColor="mainBackground">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Box flex={1} padding="xl" justifyContent="center">
            <Box
              position="absolute"
              top={-100}
              right={-100}
              width={300}
              height={300}
              borderRadius="round"
              backgroundColor="primary"
              opacity={0.05}
            />

            <Box position="absolute" top={60} right={24} zIndex={10}>
              <LanguageToggle />
            </Box>

            <Box marginBottom="xl">
              <Text variant="header" color="primary" marginBottom="s">
                {t('auth.welcomeTitle')}
              </Text>
              <Text variant="body" color="textSecondary">
                {t('auth.welcomeSubtitle')}
              </Text>
            </Box>

            <Box>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t('auth.emailLabel')}
                    placeholder={t('auth.emailPlaceholder')}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={t('auth.passwordLabel')}
                    placeholder={t('auth.passwordPlaceholder')}
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />

              {isError && (
                <Box backgroundColor="primaryLight" padding="s" borderRadius="m" marginTop="m">
                  <Text variant="caption" color="error" textAlign="center" fontWeight="bold">
                    {getErrorMessage()}
                  </Text>
                </Box>
              )}

              <Box marginTop="l">
                <Button
                  label={t('auth.submitButton')}
                  onPress={handleSubmit(onSubmit)}
                  isLoading={isPending}
                />
              </Box>
            </Box>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
}
