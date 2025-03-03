import { View, Text, TextInput } from 'react-native';
import { useTranslation } from '@/context/I18nContext';
import styles from './styles';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onError: (error: string) => void;
}

export function PhoneInput({ value, onChangeText, onError }: PhoneInputProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.inputWrapper}>
      <View style={styles.countryCode}>
        <Text style={styles.flag}>🇮🇱</Text>
        <Text style={styles.countryCodeText}>+972</Text>
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => {
          const numbersOnly = text.replace(/[^0-9]/g, '');
          onChangeText(numbersOnly);
          onError('');
        }}
        placeholder={t('enter_phone_number', 'Enter phone number')}
        placeholderTextColor="#999999"
        keyboardType="numeric"
        maxLength={10}
        textAlign="left"
        writingDirection="ltr"
      />
    </View>
  );
}
