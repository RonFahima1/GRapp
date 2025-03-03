import { useTranslation } from '../../../context/I18nContext';
import LTRLogin from './ltr';
import RTLLogin from './rtl';

export default function Login() {
  const { isRTL } = useTranslation();
  return isRTL ? <RTLLogin /> : <LTRLogin />;
}
