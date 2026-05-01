import { createTheme } from '@shopify/restyle';
import { moderateScale } from 'react-native-size-matters';

const palette = {
  purplePrimary: '#7C3AED',
  purpleLight: '#EDE9FE',
  white: '#FFFFFF',
  slate50: '#F8FAFC',
  slate800: '#0F172A',
  slate500: '#64748B',
  red500: '#EF4444',
  green500: '#10B981',
  transparent: 'transparent',
};

const theme = createTheme({
  colors: {
    primary: palette.purplePrimary,
    primaryLight: palette.purpleLight,
    mainBackground: palette.white,
    cardBackground: palette.slate50,
    text: palette.slate800,
    textSecondary: palette.slate500,
    error: palette.red500,
    success: palette.green500,
    transparent: palette.transparent,
  },

  spacing: {
    xs: moderateScale(4),
    s: moderateScale(8),
    m: moderateScale(16),
    l: moderateScale(24),
    xl: moderateScale(32),
    xxl: moderateScale(40),
  },
  borderRadii: {
    s: moderateScale(4),
    m: moderateScale(8),
    l: moderateScale(16),
    xl: moderateScale(24),
    round: 9999,
  },

  textVariants: {
    defaults: {
      color: 'text',
      fontSize: moderateScale(16),
      fontFamily: 'System',
    },
    header: {
      fontWeight: 'bold',
      fontSize: moderateScale(34),
      color: 'text',
    },
    subheader: {
      fontWeight: '600',
      fontSize: moderateScale(24),
      color: 'text',
    },
    body: {
      fontSize: moderateScale(16),
      color: 'text',
    },
    caption: {
      fontSize: moderateScale(14),
      color: 'textSecondary',
    },
  },
});

export type Theme = typeof theme;
export default theme;
