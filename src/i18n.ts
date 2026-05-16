import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import deTranslations from './locales/de/translation.json';
import enTranslations from './locales/en/translation.json';

const resources = {
  de: { translation: deTranslations },
  en: { translation: enTranslations },
};

// Get device language, fallback to 'en'
const deviceLanguage = getLocales()[0]?.languageCode || 'en';
const language = ['de', 'en'].includes(deviceLanguage) ? deviceLanguage : 'en';

(async () => {
  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language,
      fallbackLng: 'en',
      defaultNS: 'translation',
      interpolation: {
        escapeValue: false, // React already handles escaping
      },
    });
})();

export default i18n;
