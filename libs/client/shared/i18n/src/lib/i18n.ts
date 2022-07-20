import i18n from 'i18next';
import jsCookies from 'js-cookie';

import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import viJSON from './translations/vi';
import enJSON from './translations/en';

const resources = {
  vi: { translation: viJSON },
  en: { translation: enJSON },
};

let language: string | null = '';
if (typeof window !== 'undefined')
  language = jsCookies.get('i18nextLng') ?? window?.localStorage?.getItem('i18nextLng') ?? 'vi';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    keySeparator: false,
    // lng: 'vi', // set language default anh overwrite language from LanguageDetector
    fallbackLng: 'vi',
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });

i18n.changeLanguage(language);

export { i18n };
