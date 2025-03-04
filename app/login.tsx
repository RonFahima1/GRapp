import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, Switch, I18nManager } from 'react-native';
import { router, Link } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useBiometrics } from '../hooks/useBiometrics';
import { secureStorage } from '../utils/secureStorage';
import { useTranslation } from '../context/I18nContext';
import styles from './styles/login';

export default function Login() {
  const { isAvailable, biometricType, authenticate } = useBiometrics();
  const { login } = useAuth();
  const { t, currentLanguage } = useTranslation();
  const isRTL = currentLanguage === 'he' || currentLanguage === 'ar';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [enableBiometric, setEnableBiometric] = useState(false);

  useEffect(() => {
    checkAutoLogin();
  }, []);

  const checkAutoLogin = async () => {
    const biometricEnabled = await secureStorage.getBiometricEnabled();
    if (biometricEnabled && isAvailable) {
      const success = await authenticate();
      if (success) {
        const userData = await secureStorage.getUserData();
        if (userData) {
          // TODO: Implement your login logic here with userData
          router.push('/');
        }
      }
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    // Login using auth context
    await login(formData);
    
    // Save biometric preferences if enabled
    if (enableBiometric && isAvailable) {
      await secureStorage.setBiometricEnabled(true);
    }
    
    router.replace('/');
  };

  return (
    <View style={[styles.container, isRTL && styles.rtlContainer]}>
      <Text style={[styles.title, isRTL && styles.rtlText]}>{t('welcome_back', 'Welcome Back')}</Text>
      
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, isRTL && styles.inputRTL]}
          placeholder={t('email', 'Email')}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999999"
        />
      </View>
      
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, isRTL && styles.inputRTL]}
          placeholder={t('password', 'Password')}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
          placeholderTextColor="#999999"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity 
        style={[styles.button, (!formData.email || !formData.password) && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={!formData.email || !formData.password}
      >
        <Text style={[styles.buttonText, (!formData.email || !formData.password) && styles.buttonTextDisabled]}>
          {t('login', 'Login')}
        </Text>
      </TouchableOpacity>

      {isAvailable && (
        <View style={styles.biometricContainer}>
          <View style={[styles.biometricRow, isRTL && styles.biometricRowRTL]}>
            <Text style={[styles.biometricText, isRTL && styles.biometricTextRTL]}>
              {t('enable_biometric_login', `Enable ${biometricType} login`)}
            </Text>
            <Switch
              value={enableBiometric}
              onValueChange={setEnableBiometric}
            />
          </View>
        </View>
      )}

      {isAvailable && (
        <TouchableOpacity 
          style={styles.biometricButton} 
          onPress={async () => {
            const success = await authenticate();
            if (success) {
              // TODO: Implement biometric login logic
              router.push('/');
            }
          }}
        >
          <Text style={styles.biometricButtonText}>
            Sign in with {biometricType}
          </Text>
        </TouchableOpacity>
      )}

      <View style={[styles.linkContainer, isRTL && styles.linkContainerRTL]}>
        <Text style={isRTL ? styles.rtlText : null}>{t('no_account', "Don't have an account?")} </Text>
        <Link href="/register" style={[styles.link, isRTL && styles.rtlText]}>{t('register', 'Register')}</Link>
      </View>
    </View>
  );
}

