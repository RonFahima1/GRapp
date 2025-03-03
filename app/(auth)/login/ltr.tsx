import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '../../../context/I18nContext';
import { LanguageToggle } from '../../../components/LanguageToggle';
import { PhoneInput } from '../../../components/welcome/PhoneInput';
import { ContinueButton } from '../../../components/welcome/ContinueButton';
import { isValidPhoneNumber } from 'libphonenumber-js';
import styles from './styles';

export default function LTRLogin() {
  const router = useRouter();
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError('');
    
    // Validate phone number
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

    setLoading(true);
    // Add login logic here
    setTimeout(() => {
      setLoading(false);
      router.push('/verify');
    }, 1000);
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
        <Text style={styles.title}>{t('welcome_back', 'Welcome back')}</Text>
        <Text style={styles.subtitle}>{t('login_subtitle', 'Sign in to continue')}</Text>

        <View style={styles.form}>
          <PhoneInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            error={error}
          />
          <ContinueButton 
            onPress={handleLogin}
            loading={loading}
          />
        </View>
      </View>
    </View>
  );
}
