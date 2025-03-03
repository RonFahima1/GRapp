import React, { createContext, useContext } from 'react';
import { I18nextProvider, useTranslation as useTranslationOrg, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import en from '@/locales/en.json';
 

// Initialize i18n
i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  resources: {
    en: { translation: en },
   
  },
  interpolation: {
    escapeValue: false,
  },
});

const I18nContext = createContext(null);

export const I18nProvider = ({ children }) => {
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
  return { t, i18n, changeLanguage: i18nInstance.changeLanguage, currentLanguage: i18nInstance.language };
};