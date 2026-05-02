import { Animated } from 'react-native';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'pt-BR',
      changeLanguage: jest.fn(),
    },
  }),
}));

jest.spyOn(Animated, 'timing').mockImplementation(
  () =>
    ({
      start: (callback?: ({ finished }: { finished: boolean }) => void) => {
        if (callback) callback({ finished: true });
      },
      stop: jest.fn(),
      reset: jest.fn(),
    }) as unknown as Animated.CompositeAnimation,
);

jest.spyOn(Animated, 'spring').mockImplementation(
  () =>
    ({
      start: (callback?: ({ finished }: { finished: boolean }) => void) => {
        if (callback) callback({ finished: true });
      },
      stop: jest.fn(),
      reset: jest.fn(),
    }) as unknown as Animated.CompositeAnimation,
);
