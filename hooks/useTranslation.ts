/**
 * Unified translation hook that serves as the single entry point for all translation needs in the app
 * It wraps the i18next translation system and provides additional utilities
 */
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../context/I18nContext';
import { TFunction } from 'i18next';

export interface ExtendedTranslation extends TFunction {
  // Add any extended functionality we might need
  (key: string, options?: Record<string, any>): string;
  // Add support for key not found fallback
  (key: string, defaultValue: string, options?: Record<string, any>): string;
}

export interface TranslationLanguage {
  code: LanguageCode;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

interface TranslationAPI {
  t: ExtendedTranslation;
  currentLanguage: TranslationLanguage;
  i18n: any;
  changeLanguage: (lang: LanguageCode) => Promise<void>;
  getSupportedLanguages: () => Record<string, { name: string; rtl: boolean }>;
  isRTL: boolean;
}

/**
 * Primary hook for translations throughout the app
 * @returns TranslationAPI - Unified API for translations
 */
export const useTranslation = (): TranslationAPI => {
  // Use the i18next translation system
  const { t, i18n } = useI18nextTranslation();
  
  // Get current language from i18next
  const currentLanguageCode = i18n.language as LanguageCode;
  const isRTL = SUPPORTED_LANGUAGES[currentLanguageCode]?.rtl || false;
  
  // Create a compatible interface for components
  const currentLanguage: TranslationLanguage = {
    code: currentLanguageCode,
    name: SUPPORTED_LANGUAGES[currentLanguageCode]?.name || 'English',
    nativeName: SUPPORTED_LANGUAGES[currentLanguageCode]?.name || 'English',
    isRTL
  };

  // Function to change language
  const changeLanguage = async (lang: LanguageCode): Promise<void> => {
    if (lang !== currentLanguageCode) {
      try {
        // Use a proper promise to allow callers to handle errors
        await i18n.changeLanguage(lang);
        console.log(`Language changed successfully to ${lang}`);
      } catch (error) {
        console.error(`Error changing language to ${lang}:`, error);
        throw error; // Re-throw to allow caller to handle
      }
    }
  };

  // Get all supported languages
  const getSupportedLanguages = () => SUPPORTED_LANGUAGES;
  
  return { 
    t: t as ExtendedTranslation,
    currentLanguage, 
    i18n,
    changeLanguage,
    getSupportedLanguages,
    isRTL
  };
};
