import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '../../../context/I18nContext';
import { LanguageToggle } from '../../../components/LanguageToggle';
import styles from './styles';

export default function LTRLogin() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError(t('login_error_fields', 'Please fill in all fields'));
      return;
    }

    // Add login logic here
    setError('');
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
          <TextInput
            style={styles.input}
            placeholder={t('email', 'Email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder={t('password', 'Password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>{t('login', 'Login')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>
              {t('forgot_password', 'Forgot password?')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
