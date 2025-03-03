import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, I18nManager } from 'react-native';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useTranslation } from '@/context/I18nContext';
import { router } from 'expo-router';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import styles from './styles/welcome';

export default function Welcome() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const { t, currentLanguage, supportedLanguages } = useTranslation();
  const isRTL = supportedLanguages[currentLanguage]?.rtl || false;

  const validateAndSendCode = () => {
    try {
      // Ensure number starts with 0 or 5 for Israel
      const digits = phoneNumber.replace(/\D/g, '');
      if (!digits.match(/^[05]/)) {
        setError('Phone number must start with 0 or 5');
        return;
      }

      // Format the number for validation
      const fullNumber = `+972${digits.startsWith('0') ? digits.slice(1) : digits}`;
      const isValid = isValidPhoneNumber(fullNumber);

      if (!isValid) {
        setError('Please enter a valid phone number');
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
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <LanguageToggle />
      <View style={styles.content}>
        <Image 
          source={require('../assets/images/logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, isRTL && styles.rtlText]}>{t('welcome_to_remit', 'Welcome to Remit')}</Text>
        <Text style={[styles.subtitle, isRTL && styles.rtlText]}>{t('enter_phone_subtitle', 'Enter your phone number to get started')}</Text>
        
        <View style={styles.inputWrapper}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>+972</Text>
            <Text style={styles.flag}>🇮🇱</Text>
          </View>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={(text) => {
              const numbersOnly = text.replace(/[^0-9]/g, '');
              setPhoneNumber(numbersOnly);
              setError('');
            }}
            placeholder={t('enter_phone_number', 'Enter phone number')}
            placeholderTextColor="#999999"
            keyboardType="numeric"
            maxLength={10}
            textAlign="left"
            writingDirection="ltr"
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.continueButton, phoneNumber.length === 0 && styles.continueButtonDisabled]} 
          onPress={validateAndSendCode}
          disabled={phoneNumber.length === 0}
        >
          <Text style={[styles.continueButtonText, phoneNumber.length === 0 && styles.continueButtonTextDisabled]}>
            {t('continue', 'Continue')}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <View style={[styles.loginTextContainer, isRTL && styles.loginTextContainerRTL]}>
            <Text style={[styles.loginText, isRTL && styles.loginTextRTL]}>{t('already_member', 'Already a member?')}</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={[styles.loginLink, isRTL && styles.loginTextRTL]}>{t('login_here', 'Login here')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

