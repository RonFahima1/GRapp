import React, { createContext, useContext, useEffect } from 'react';
import { I18nextProvider, useTranslation as useTranslationOrg, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { I18nManager } from 'react-native';

// Import all translations
import en from '../locales/en.json';
import th from '../locales/th.json';
import si from '../locales/si.json';
import np from '../locales/np.json';
import ro from '../locales/ro.json';
import cn from '../locales/cn.json';
import he from '../locales/he.json';
import ar from '../locales/ar.json';
import ru from '../locales/ru.json';
import ja from '../locales/ja.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import pt from '../locales/pt.json';

export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', rtl: false },
  th: { name: 'ไทย', rtl: false },
  si: { name: 'සිංහල', rtl: false },
  np: { name: 'नेपाली', rtl: false },
  ro: { name: 'Română', rtl: false },
  cn: { name: '汉语', rtl: false },
  he: { name: 'עברית', rtl: true },
  ar: { name: 'العربية', rtl: true },
  ru: { name: 'Русский', rtl: false },
  ja: { name: '日本語', rtl: false },
  es: { name: 'Español', rtl: false },
  fr: { name: 'Français', rtl: false },
  pt: { name: 'Português', rtl: false },
};

// Get the best available language from the device
const getDeviceLanguage = () => {
  const defaultLang = 'he';
  const isRTL = SUPPORTED_LANGUAGES[defaultLang]?.rtl || false;
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
  return defaultLang;
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      th: { translation: th },
      si: { translation: si },
      np: { translation: np },
      ro: { translation: ro },
      cn: { translation: cn },
      he: { translation: he },
      ar: { translation: ar },
      ru: { translation: ru },
      ja: { translation: ja },
      es: { translation: es },
      fr: { translation: fr },
      pt: { translation: pt }
    },
    fallbackLng: 'en',
    lng: getDeviceLanguage(),
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
    interpolation: {
      escapeValue: false,
    },
  });

const I18nContext = createContext(null);

export const I18nProvider = ({ children }) => {
  useEffect(() => {
    // Initialize RTL on mount
    const defaultLang = getDeviceLanguage();
    const isRTL = SUPPORTED_LANGUAGES[defaultLang]?.rtl || false;
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

    // Handle RTL setup when language changes
    const handleLanguageChange = async (lng: string) => {
      const isRTL = SUPPORTED_LANGUAGES[lng]?.rtl || false;
      // Reset to LTR first
      await I18nManager.allowRTL(false);
      await I18nManager.forceRTL(false);
      // Then set RTL if needed
      if (isRTL) {
        await new Promise(resolve => setTimeout(resolve, 50));
        await I18nManager.allowRTL(true);
        await I18nManager.forceRTL(true);
      }
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <I18nContext.Provider value={i18n}>
        {children}
      </I18nContext.Provider>
    </I18nextProvider>
  );
};

export const useTranslation = () => {
  const i18n = useContext(I18nContext);
  const { t, i18n: i18nInstance } = useTranslationOrg();
  const handleLanguageChange = async (language: string) => {
    const isRTL = SUPPORTED_LANGUAGES[language]?.rtl || false;
    // Need to set allowRTL before forceRTL
    await I18nManager.allowRTL(isRTL);
    await I18nManager.forceRTL(isRTL);
    // Small delay to ensure RTL is applied
    await new Promise(resolve => setTimeout(resolve, 50));
    i18nInstance.changeLanguage(language);
  };

  return { 
    t, 
    i18n, 
    changeLanguage: handleLanguageChange, 
    currentLanguage: i18nInstance.language,
    supportedLanguages: SUPPORTED_LANGUAGES
  };
};