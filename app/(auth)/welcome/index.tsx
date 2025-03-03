import { useTranslation } from '@/context/I18nContext';
import WelcomeLTR from './ltr';
import WelcomeRTL from './rtl';

export default function Welcome() {
  const { currentLanguage, supportedLanguages } = useTranslation();
  const isRTL = supportedLanguages[currentLanguage]?.rtl || false;

  return isRTL ? <WelcomeRTL /> : <WelcomeLTR />;
}
