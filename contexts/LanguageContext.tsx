import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, Alert, Platform } from 'react-native';
import * as Updates from 'expo-updates';
import { LANGUAGES, DEFAULT_LANGUAGE_CODE, LanguageInfo, getLanguageByCode } from '../translations';

// Storage key for language preference

const LANGUAGE_STORAGE_KEY = 'app_language';

// Define context type
type LanguageContextType = {
  currentLanguage: LanguageInfo;
  setLanguage: (languageCode: string) => Promise<boolean | void>;
  isLoading: boolean;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: getLanguageByCode(DEFAULT_LANGUAGE_CODE), // Default to English
  setLanguage: async () => {},
  isLoading: true,
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageInfo>(getLanguageByCode(DEFAULT_LANGUAGE_CODE));
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language on mount and set RTL layout
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguageCode = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguageCode) {
          const language = getLanguageByCode(savedLanguageCode);
          setCurrentLanguage(language);
          
          // Set RTL layout based on the saved language
          if (language.isRTL !== I18nManager.isRTL) {
            I18nManager.allowRTL(language.isRTL);
            I18nManager.forceRTL(language.isRTL);
            // We don't need to reload here as this happens on app start
          }
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedLanguage();
  }, []);

  // Function to set language
  const setLanguage = async (languageCode: string): Promise<boolean> => {
    try {
      const newLanguage = getLanguageByCode(languageCode);
      if (!newLanguage) {
        throw new Error(`Language code ${languageCode} not found`);
      }

      // Check if we're changing RTL setting
      const isCurrentRTL = currentLanguage.isRTL;
      const isNewRTL = newLanguage.isRTL;
      const isRTLChanged = isCurrentRTL !== isNewRTL;

      // Save language preference
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      setCurrentLanguage(newLanguage);

      // Handle RTL change if needed
      if (isRTLChanged) {
        // Update RTL setting
        I18nManager.allowRTL(isNewRTL);
        I18nManager.forceRTL(isNewRTL);

        // Show restart alert
        Alert.alert(
          'App Restart Required',
          `To change to ${newLanguage.name}, the app needs to restart to properly display the ${isNewRTL ? 'right-to-left' : 'left-to-right'} layout. The app will close now, please reopen it.`,
          [
            {
              text: 'OK',
              onPress: async () => {
                // Reload app (for Expo)
                if (Platform.OS !== 'web') {
                  try {
                    // Force an immediate reload to apply RTL changes
                    await Updates.reloadAsync();
                  } catch (error) {
                    console.error('Failed to reload app:', error);
                  }
                }
              },
            },
          ],
          { cancelable: false }
        );
      }

      return true;
    } catch (error) {
      console.error('Failed to set language:', error);
      return false;
    }
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    setLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
