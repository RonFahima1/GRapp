import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from '../../../context/I18nContext';
import { LanguageToggle } from '../../../components/LanguageToggle';
import { PhoneInput } from '../../../components/welcome/PhoneInput';
import { PasswordInput } from '../../../components/welcome/PasswordInput';
import { ContinueButton } from '../../../components/welcome/ContinueButton';
import { isValidPhoneNumber } from 'libphonenumber-js';
import styles from './styles';

export default function LTRLogin() {
  const router = useRouter();
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = () => {
    setError('');
    
    if (!phoneNumber || !password) {
      setError(t('login_error_fields', 'Please fill in all fields'));
      return;
    }

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
            placeholder={t('enter_phone_number', 'Enter phone number')}
          />
          <View style={styles.ltrPasswordContainer}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t('password', 'Password')}
              placeholderTextColor="#999999"
              style={[styles.ltrPasswordInput, error && styles.inputError]}
              secureTextEntry={!showPassword}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            {isPasswordFocused && (
              <TouchableOpacity 
                style={styles.eyeIconContainer}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={22} 
                  color="#666666" 
                />
              </TouchableOpacity>
            )}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <ContinueButton 
            onPress={handleLogin}
            loading={loading}
            text={t('login', 'Login')}
          />
        </View>
      </View>
    </View>
  );
}
