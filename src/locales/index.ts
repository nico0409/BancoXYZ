import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esCO from './es-CO.json';
import ptBR from './pt-BR.json';

const resources = {
  'pt-BR': { translation: ptBR },
  pt: { translation: ptBR },
  'es-CO': { translation: esCO },
  es: { translation: esCO },
};

const deviceLanguage = Localization.getLocales()[0]?.languageTag || 'pt-BR';

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
