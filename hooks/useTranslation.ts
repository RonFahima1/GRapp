import { useLanguage } from '../contexts/LanguageContext';
import { getTranslationByPath } from '../translations';

export const useTranslation = () => {
  const { currentLanguage } = useLanguage();
  
  /**
   * Translate a string using the current language
   * @param path Dot notation path to the translation (e.g., 'profile.myAccount')
   * @returns Translated string
   */
  const t = (path: string) => {
    return getTranslationByPath(currentLanguage.translation, path);
  };
  
  return { t, currentLanguage };
};
