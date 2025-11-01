import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import translation files
import en from './locales/en/mobile.json';
import tr from './locales/tr/mobile.json';

const resources = {
  en: {
    mobile: en,
  },
  tr: {
    mobile: tr,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: Localization.getLocales()[0]?.languageCode ?? 'en', // detect user language
    fallbackLng: 'en',
    compatibilityJSON: 'v4', // Updated for react-native
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false, // Recommended for react-native
    },
  })
  .catch((error) => {
    console.error('Failed to initialize i18n:', error);
  });

export default i18n;

