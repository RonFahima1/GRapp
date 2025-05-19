import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Platform, Alert } from 'react-native';
import * as Updates from 'expo-updates';
import * as SecureStore from 'expo-secure-store';

// Import all translation files
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import cn from '../locales/cn.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import he from '../locales/he.json';
import hi from '../locales/hi.json';
import ja from '../locales/ja.json';
import np from '../locales/np.json';
import pt from '../locales/pt.json';
import ro from '../locales/ro.json';
import ru from '../locales/ru.json';
import si from '../locales/si.json';
import th from '../locales/th.json';
import tl from '../locales/tl.json';
import zh from '../locales/zh.json';

// Define supported languages with their display names and RTL status
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English', rtl: false },
  ar: { name: 'Arabic', nativeName: 'العربية', rtl: true },
  cn: { name: 'Chinese (Simplified)', nativeName: '简体中文', rtl: false },
  es: { name: 'Spanish', nativeName: 'Español', rtl: false },
  fr: { name: 'French', nativeName: 'Français', rtl: false },
  he: { name: 'Hebrew', nativeName: 'עברית', rtl: true },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', rtl: false },
  ja: { name: 'Japanese', nativeName: '日本語', rtl: false },
  np: { name: 'Nepali', nativeName: 'नेपाली', rtl: false },
  pt: { name: 'Portuguese', nativeName: 'Português', rtl: false },
  ro: { name: 'Romanian', nativeName: 'Română', rtl: false },
  ru: { name: 'Russian', nativeName: 'Русский', rtl: false },
  si: { name: 'Sinhala', nativeName: 'සිංහල', rtl: false },
  th: { name: 'Thai', nativeName: 'ไทย', rtl: false },
  tl: { name: 'Filipino', nativeName: 'Filipino', rtl: false },
  zh: { name: 'Chinese (Traditional)', nativeName: '繁體中文', rtl: false }
};

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// Storage key for saved language preference
const LANGUAGE_STORAGE_KEY = 'app_language';

// Initialize i18next with default language
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      cn: { translation: cn },
      es: { translation: es },
      fr: { translation: fr },
      he: { translation: he },
      hi: { translation: hi },
      ja: { translation: ja },
      np: { translation: np },
      pt: { translation: pt },
      ro: { translation: ro },
      ru: { translation: ru },
      si: { translation: si },
      th: { translation: th },
      tl: { translation: tl },
      zh: { translation: zh }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Save language preference to secure storage
const saveLanguagePreference = async (languageCode: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(LANGUAGE_STORAGE_KEY, languageCode);
    console.log('Language preference saved:', languageCode);
  } catch (error) {
    console.error('Failed to save language preference:', error);
  }
};

// Load saved language preference
const loadLanguagePreference = async (): Promise<string | null> => {
  try {
    const savedLanguage = await SecureStore.getItemAsync(LANGUAGE_STORAGE_KEY);
    return savedLanguage;
  } catch (error) {
    console.error('Failed to load language preference:', error);
    return null;
  }
};

// Interface for our translation context
interface TranslationContextType {
  currentLanguage: LanguageCode;
  languages: typeof SUPPORTED_LANGUAGES;
  isRTL: boolean;
  changeLanguage: (code: LanguageCode) => Promise<void>;
  t: (key: string, options?: any) => string;
  isChangingLanguage: boolean;
}

// Create the context
const TranslationContext = createContext<TranslationContextType | null>(null);

// Provider component
export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with English as default language
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isRTL, setIsRTL] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  
  // Force set language to English
  useEffect(() => {
    // This ensures we start with English as the default language
    i18n.changeLanguage('en');
  }, []);

  // Initialize language on mount - load saved language preference
  useEffect(() => {
    const initLanguage = async () => {
      // Load saved language preference
      const savedLanguage = await loadLanguagePreference();
      
      if (savedLanguage && Object.keys(SUPPORTED_LANGUAGES).includes(savedLanguage)) {
        const langCode = savedLanguage as LanguageCode;
        const isLangRTL = SUPPORTED_LANGUAGES[langCode].rtl;
        
        // Set RTL layout direction if needed
        if (isLangRTL !== I18nManager.isRTL) {
          I18nManager.allowRTL(isLangRTL);
          I18nManager.forceRTL(isLangRTL);
        }
        
        // Set language in i18n
        i18n.changeLanguage(langCode);
        setCurrentLanguage(langCode);
        setIsRTL(isLangRTL);
      } else {
        // Default to English if no saved preference
        const langCode = 'en';
        const isLangRTL = false;
        
        if (I18nManager.isRTL) {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
        }
        
        i18n.changeLanguage(langCode);
        setCurrentLanguage(langCode);
        setIsRTL(false);
        
        // Save English as the default preference
        await saveLanguagePreference(langCode);
      }
    };
    
    initLanguage();
  }, []);

  // Function to change language with proper RTL handling
  const changeLanguage = async (code: LanguageCode): Promise<void> => {
    try {
      setIsChangingLanguage(true);
      
      if (code === currentLanguage) {
        setIsChangingLanguage(false);
        return;
      }
      
      // Check if RTL status will change
      const newIsRTL = SUPPORTED_LANGUAGES[code].rtl;
      const rtlWillChange = isRTL !== newIsRTL;
      
      // Save preference immediately
      await saveLanguagePreference(code);
      
      // Change language in i18n first
      await i18n.changeLanguage(code);
      setCurrentLanguage(code);
      
      // Force immediate re-render of all components
      // that depend on translations
      
      // If RTL direction needs to change, show confirmation and restart
      if (rtlWillChange) {
        // Update RTL setting
        I18nManager.allowRTL(newIsRTL);
        I18nManager.forceRTL(newIsRTL);
        setIsRTL(newIsRTL);
        
        // Show restart alert
        Alert.alert(
          'Restart Required',
          'The app needs to restart to apply the new layout direction.',
          [
            {
              text: 'Restart Now',
              onPress: async () => {
                if (Platform.OS !== 'web') {
                  try {
                    if (Updates && typeof Updates.reloadAsync === 'function') {
                      // Force reload the entire app to apply new language
                      Updates.reloadAsync();
                    } else {
                      Alert.alert(
                        'Manual Restart Needed',
                        'Please restart the app manually to apply all changes.',
                        [{ text: 'OK' }]
                      );
                    }
                  } catch (error) {
                    console.error('Failed to reload app:', error);
                    Alert.alert(
                      'Manual Restart Needed',
                      'Please restart the app manually to apply all changes.',
                      [{ text: 'OK' }]
                    );
                  }
                }
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        // Even without RTL changes, reload the app
        // This ensures all components get the new language
        setTimeout(() => {
          if (Platform.OS !== 'web' && Updates && typeof Updates.reloadAsync === 'function') {
            Updates.reloadAsync().catch(err => {
              console.error('Failed to reload app for language change:', err);
            });
          }
        }, 500);
      }
    } catch (error) {
      console.error('Failed to change language:', error);
      Alert.alert('Error', 'Failed to change language. Please try again.');
    } finally {
      setIsChangingLanguage(false);
    }
  };

  // Translation function wrapper
  const t = (key: string, options?: any): string => {
    try {
      const translated = i18n.t(key, options);
      // If the translation returns the same key, it means the translation is missing
      // However, still return empty string or the translated value for falsy values
      if (!translated || typeof translated !== 'string' || translated === key) {
        // Check if there's a fallback default in the key structure (e.g. "security.faceID" -> "Face ID")
        const parts = key.split('.');
        const fallbackKey = parts[parts.length - 1];
        // Convert camelCase to Title Case with spaces
        const fallback = fallbackKey
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        return fallback;
      }
      return translated;
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      // Fallback to a formatted version of the key
      const parts = key.split('.');
      const fallbackKey = parts[parts.length - 1];
      const fallback = fallbackKey
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      return fallback;
    }
  };

  // Context value
  const contextValue: TranslationContextType = {
    currentLanguage,
    languages: SUPPORTED_LANGUAGES,
    isRTL,
    changeLanguage,
    t,
    isChangingLanguage
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use the translation context
export const useTranslate = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslate must be used within a TranslationProvider');
  }
  return context;
};
