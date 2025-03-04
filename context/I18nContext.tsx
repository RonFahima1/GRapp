import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nextProvider, useTranslation as useTranslationOrg, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { I18nManager, Platform, Alert, DevSettings } from 'react-native';
import * as Updates from 'expo-updates';
import * as SecureStore from 'expo-secure-store';
import { LanguageSwitchModal } from '../components/LanguageSwitchModal';

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

// Storage keys
const LANGUAGE_KEY = 'user_language';
const RTL_KEY = 'is_rtl';

// Function to save language to secure storage
const saveLanguage = async (language: string, isRTL: boolean) => {
  try {
    await SecureStore.setItemAsync(LANGUAGE_KEY, language);
    await SecureStore.setItemAsync(RTL_KEY, isRTL.toString());
    console.log('Saved language to secure storage:', language, isRTL);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

// Get the best available language from the device or storage
const getInitialLanguage = async () => {
  try {
    // Try to get language from secure storage first
    const savedLanguage = await SecureStore.getItemAsync(LANGUAGE_KEY);
    const savedRTL = await SecureStore.getItemAsync(RTL_KEY);
    
    console.log('Loaded saved language:', savedLanguage);
    console.log('Loaded saved RTL setting:', savedRTL);
    
    if (savedLanguage) {
      // Apply RTL setting first
      const isRTL = savedRTL === 'true';
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
      return savedLanguage;
    }
    
    // Fallback to default language
    const defaultLang = 'en';
    const isRTL = SUPPORTED_LANGUAGES[defaultLang]?.rtl || false;
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    return defaultLang;
  } catch (error) {
    console.error('Error loading saved language:', error);
    // Fallback to default language
    const defaultLang = 'en';
    const isRTL = SUPPORTED_LANGUAGES[defaultLang]?.rtl || false;
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    return defaultLang;
  }
};

// Initialize i18n with a default language first
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
    lng: 'en', // Will be updated after loading from storage
    supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
    interpolation: {
      escapeValue: false,
    },
  });

// Load the saved language asynchronously
getInitialLanguage().then(initialLanguage => {
  console.log('Setting initial language to:', initialLanguage);
  i18n.changeLanguage(initialLanguage);
});

// Create a context with a more specific type
interface I18nContextType {
  i18n: typeof i18n;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  pendingLanguage: string | null;
  setPendingLanguage: (lang: string | null) => void;
  isRTLSwitch: boolean;
  setIsRTLSwitch: (isRTL: boolean) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider = ({ children }) => {
  // State for the language switch modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
  const [isRTLSwitch, setIsRTLSwitch] = useState(false);

  useEffect(() => {
    // Initialize RTL on mount - this will be handled by getInitialLanguage
    // No need to do anything here as the language is loaded asynchronously
    // when the app starts

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

  // Create the context value
  const contextValue = {
    i18n,
    isModalVisible,
    setIsModalVisible,
    pendingLanguage,
    setPendingLanguage,
    isRTLSwitch,
    setIsRTLSwitch
  };

  const handleConfirmLanguageSwitch = async () => {
    console.log('Provider: Confirming language switch to:', pendingLanguage);
    setIsModalVisible(false);
    if (pendingLanguage) {
      const isRTL = SUPPORTED_LANGUAGES[pendingLanguage]?.rtl || false;
      try {
        // Need to set allowRTL before forceRTL
        console.log('Provider: Setting RTL to:', isRTL);
        await I18nManager.allowRTL(isRTL);
        await I18nManager.forceRTL(isRTL);
        // Small delay to ensure RTL is applied
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('Provider: Changing i18n language to:', pendingLanguage);
        i18n.changeLanguage(pendingLanguage);
        
        // Save language and RTL setting to secure storage
        await saveLanguage(pendingLanguage, isRTL);
        console.log('Provider: Language changed successfully');
        
        // Alert the user and restart the app
        Alert.alert(
          'Restart Required',
          'The language has been changed to: ' + SUPPORTED_LANGUAGES[pendingLanguage]?.name + 
          '. The app will now restart to apply the changes.',
          [{ 
            text: 'OK', 
            onPress: () => {
              console.log('Restarting app...');
              // Restart the app
              try {
                console.log('Attempting to reload the app...');
                
                // Try multiple reload methods
                
                // Method 1: DevSettings (available in development)
                if (DevSettings && typeof DevSettings.reload === 'function') {
                  console.log('Reloading with DevSettings.reload()');
                  DevSettings.reload();
                  return;
                }
                
                // Method 2: Expo Updates
                if (Updates && typeof Updates.reloadAsync === 'function') {
                  console.log('Reloading with Updates.reloadAsync()');
                  Updates.reloadAsync();
                  return;
                }
                
                // Method 3: react-native-restart as a last resort
                try {
                  const RNRestart = require('react-native-restart');
                  if (RNRestart && typeof RNRestart.Restart === 'function') {
                    console.log('Reloading with RNRestart.Restart()');
                    RNRestart.Restart();
                    return;
                  }
                } catch (e) {
                  console.log('RNRestart not available:', e);
                }
                
                throw new Error('No reload method available');
              } catch (error) {
                console.error('Error reloading app:', error);
                // Fallback: Apply language change without restart
                Alert.alert(
                  'Restart Required',
                  'Please manually restart the app to fully apply the language changes.',
                  [{ text: 'OK' }]
                );
              }
            } 
          }]
        );
      } catch (error) {
        console.error('Provider: Error changing language:', error);
      }
    }
    setPendingLanguage(null);
  };

  const handleCancelLanguageSwitch = () => {
    console.log('Provider: Cancelling language switch');
    setIsModalVisible(false);
    setPendingLanguage(null);
  };

  return (
    <I18nextProvider i18n={i18n}>
      <I18nContext.Provider value={contextValue}>
        {children}
        <LanguageSwitchModal
          visible={isModalVisible}
          onConfirm={handleConfirmLanguageSwitch}
          onCancel={handleCancelLanguageSwitch}
          isRTLSwitch={isRTLSwitch}
        />
      </I18nContext.Provider>
    </I18nextProvider>
  );
};

export const useTranslation = () => {
  const i18nContext = useContext(I18nContext);
  const { t, i18n: i18nInstance } = useTranslationOrg();
  
  // Get modal state from context
  const { 
    isModalVisible, 
    setIsModalVisible, 
    pendingLanguage, 
    setPendingLanguage, 
    isRTLSwitch, 
    setIsRTLSwitch 
  } = i18nContext || { 
    isModalVisible: false, 
    setIsModalVisible: () => {}, 
    pendingLanguage: null, 
    setPendingLanguage: () => {}, 
    isRTLSwitch: false, 
    setIsRTLSwitch: () => {} 
  };

  const handleLanguageChange = async (language: string) => {
    console.log('Changing language to:', language, 'current:', i18nInstance.language);
    
    // Don't switch if it's the same language
    if (language === i18nInstance.language) {
      console.log('Same language, not switching');
      return;
    }

    const currentIsRTL = SUPPORTED_LANGUAGES[i18nInstance.language]?.rtl || false;
    const newIsRTL = SUPPORTED_LANGUAGES[language]?.rtl || false;
    
    console.log('RTL status - current:', currentIsRTL, 'new:', newIsRTL);
    
    // Check if we're switching between RTL and LTR or vice versa
    if (currentIsRTL !== newIsRTL) {
      console.log('RTL direction change detected, showing modal');
      setIsRTLSwitch(currentIsRTL ? false : true); // If current is RTL, we're switching to LTR
      setPendingLanguage(language);
      setIsModalVisible(true);
      return;
    }
    
    console.log('No RTL direction change, applying language change directly');
    // If not switching between RTL/LTR, proceed with the change
    await applyLanguageChange(language);
  };

  const applyLanguageChange = async (language: string) => {
    console.log('Applying language change to:', language);
    const isRTL = SUPPORTED_LANGUAGES[language]?.rtl || false;
    try {
      console.log('Setting RTL to:', isRTL);
      // Need to set allowRTL before forceRTL
      await I18nManager.allowRTL(isRTL);
      await I18nManager.forceRTL(isRTL);
      // Small delay to ensure RTL is applied
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log('Changing i18n language to:', language);
      i18nInstance.changeLanguage(language);
      console.log('Language changed successfully');
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // These functions are now handled in the provider

  return { 
    t, 
    i18n: i18nInstance, 
    changeLanguage: handleLanguageChange, 
    currentLanguage: i18nInstance.language,
    supportedLanguages: SUPPORTED_LANGUAGES,
    // Modal related props - no longer needed as the modal is in the provider
    isModalVisible: false,
    isRTLSwitch: false,
    handleConfirmLanguageSwitch: () => {},
    handleCancelLanguageSwitch: () => {}
  };
};