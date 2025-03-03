import { TouchableOpacity, Text } from 'react-native';
import { useTranslation } from '@/context/I18nContext';
import styles from './styles';

interface ContinueButtonProps {
  disabled: boolean;
  onPress: () => void;
}

export function ContinueButton({ disabled, onPress }: ContinueButtonProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity 
      style={[styles.continueButton, disabled && styles.continueButtonDisabled]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.continueButtonText, disabled && styles.continueButtonTextDisabled]}>
        {t('continue', 'Continue')}
      </Text>
    </TouchableOpacity>
  );
}
