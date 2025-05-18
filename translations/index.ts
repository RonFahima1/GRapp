import { Translation } from './types';

// Import all language files
import en from './languages/en';
import es from './languages/es';
import fr from './languages/fr';
import he from './languages/he';
import ar from './languages/ar';
import zh from './languages/zh';
import ru from './languages/ru';
import de from './languages/de';
import ja from './languages/ja';
import ko from './languages/ko';
import pt from './languages/pt';
import it from './languages/it';
import th from './languages/th';
import hi from './languages/hi';
import si from './languages/si';
import fil from './languages/fil';

// Define language metadata
export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  isRTL: boolean;
  translation: Translation;
}

// Export all available languages with their metadata
export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', isRTL: false, translation: en },
  { code: 'es', name: 'Spanish', nativeName: 'Español', isRTL: false, translation: es },
  { code: 'fr', name: 'French', nativeName: 'Français', isRTL: false, translation: fr },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', isRTL: true, translation: he },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true, translation: ar },
  { code: 'zh', name: 'Chinese', nativeName: '中文', isRTL: false, translation: zh },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', isRTL: false, translation: ru },
  { code: 'de', name: 'German', nativeName: 'Deutsch', isRTL: false, translation: de },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', isRTL: false, translation: ja },
  { code: 'ko', name: 'Korean', nativeName: '한국어', isRTL: false, translation: ko },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', isRTL: false, translation: pt },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', isRTL: false, translation: it },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', isRTL: false, translation: th },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isRTL: false, translation: hi },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', isRTL: false, translation: si },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', isRTL: false, translation: fil },
];

// Default language code
export const DEFAULT_LANGUAGE_CODE = 'en';

// Get a language by its code
export const getLanguageByCode = (code: string): LanguageInfo => {
  const language = LANGUAGES.find(lang => lang.code === code);
  if (!language) {
    // Fall back to default language
    return LANGUAGES.find(lang => lang.code === DEFAULT_LANGUAGE_CODE)!;
  }
  return language;
};

// Get a translation string by nested path
export const getTranslationByPath = (
  translation: Translation,
  path: string
): string => {
  const parts = path.split('.');
  let result: any = translation;
  
  for (const part of parts) {
    if (result && typeof result === 'object' && part in result) {
      result = result[part];
    } else {
      console.warn(`Translation path not found: ${path}`);
      return path; // Return the path itself as fallback
    }
  }
  
  return result;
};

// Export types
export * from './types';
