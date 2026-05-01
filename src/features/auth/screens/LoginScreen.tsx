import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { useLoginMutation } from '../api/useLoginMutation';
import { loginSchema, LoginFormValues } from '../schemas/loginSchema';

import Box from '@/components/Box';
import Button from '@/components/Button';
import Text from '@/components/Text';
import TextInput from '@/components/TextInput';

export function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate: loginMutation, isPending } = useLoginMutation();

  const onSubmit = (data: LoginFormValues) => {
    loginMutation(data);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Box flex={1} backgroundColor="mainBackground" padding="xl" justifyContent="center">
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

          <Box marginBottom="xl">
            <Text variant="header" color="primary" marginBottom="s">
              Bem-vindo ao BancoXYZ
            </Text>
            <Text variant="body" color="textSecondary">
              Acesse sua conta para gerenciar suas finanças de forma segura.
            </Text>
          </Box>

          <Box>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="E-mail"
                  placeholder="gabriel@topaz.com"
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
                  label="Senha"
                  placeholder="••••"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                />
              )}
            />

            <Box marginTop="l">
              <Button label="Entrar" onPress={handleSubmit(onSubmit)} isLoading={isPending} />
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
