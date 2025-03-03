import { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useTranslation } from '@/context/I18nContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PhoneInput } from '@/components/welcome/PhoneInput';
import { ContinueButton } from '@/components/welcome/ContinueButton';
import { LoginLink } from '@/components/welcome/LoginLink';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { router } from 'expo-router';
import styles from './styles';

export default function WelcomeLTR() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const validateAndSendCode = () => {
    try {
      // Ensure number starts with 0 or 5 for Israel
      const digits = phoneNumber.replace(/\D/g, '');
      if (!digits.match(/^[05]/)) {
        setError(t('phone_error_start', 'Phone number must start with 0 or 5'));
        return;
      }

      // Format the number for validation
      const fullNumber = `+972${digits.startsWith('0') ? digits.slice(1) : digits}`;
      const isValid = isValidPhoneNumber(fullNumber);

      if (!isValid) {
        setError(t('phone_error_invalid', 'Please enter a valid phone number'));
        return;
      }

      router.push({ 
        pathname: '/register',
        params: { phoneNumber: fullNumber }
      });
    } catch (error) {
      setError('Invalid phone number format');
    }
  };

  return (
    <View style={styles.container}>
      <LanguageToggle />
      <View style={styles.content}>
        <Image 
          source={require('../../../assets/images/logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{t('welcome_to_remit', 'Welcome to Remit')}</Text>
        <Text style={styles.subtitle}>{t('enter_phone_subtitle', 'Enter your phone number to get started')}</Text>
        
        <PhoneInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          onError={setError}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <ContinueButton
          disabled={phoneNumber.length === 0}
          onPress={validateAndSendCode}
        />

        <LoginLink isRTL={false} />
      </View>
    </View>
  );
}
