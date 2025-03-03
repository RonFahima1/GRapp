import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import styles from './styles/welcome';

export default function Welcome() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

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
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/images/logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to Remit</Text>
        <Text style={styles.subtitle}>Enter your phone number to get started</Text>
        
        <View style={styles.phoneContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.flag}>🇮🇱</Text>
            <Text style={styles.countryCodeText}>+972</Text>
          </View>
          
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={(text) => {
              const numbersOnly = text.replace(/[^0-9]/g, '');
              setPhoneNumber(numbersOnly);
              setError('');
            }}
            placeholder="Enter phone number"
            keyboardType="numeric"
            maxLength={10}
          />
        </View>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.button, phoneNumber.length < 9 && styles.buttonDisabled]}
          onPress={validateAndSendCode}
          disabled={phoneNumber.length < 9}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

