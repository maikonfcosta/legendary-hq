import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationPT from './locales/pt-BR.json';
import translationEN from './locales/en-US.json';

const resources = {
  'pt-BR': {
    translation: translationPT
  },
  'en-US': {
    translation: translationEN
  }
};

const savedLanguage = localStorage.getItem('appLanguage') || 'pt-BR';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
