import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import styles from './styles/verify';

export default function Verify() {
  const { phoneNumber } = useLocalSearchParams();
  const { updateRegistrationData } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatPhoneNumber = (number: string) => {
    // Remove the country code and format the number
    const local = number.replace('+972', '0');
    return local.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text[text.length - 1];
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // If code is complete, verify it
    if (index === 5 && text !== '') {
      verifyCode(newCode.join(''));
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyCode = async (fullCode: string) => {
    try {
      // TODO: Call your verification API here
      const isValid = fullCode === '123456'; // Replace with actual verification

      if (isValid) {
        // Store the verified phone number
        updateRegistrationData({ phoneNumber });
        
        // Navigate to registration or login based on user status
        const isExistingUser = false; // Replace with actual user check
        router.replace(isExistingUser ? '/login' : '/register/personal-info');
      } else {
        setError('Invalid verification code');
      }
    } catch (error) {
      setError('Failed to verify code');
    }
  };

  const resendCode = async () => {
    if (timer > 0) return;
    
    setIsResending(true);
    try {
      // TODO: Call your resend code API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTimer(30);
      setCode(['', '', '', '', '', '']);
      setError('');
    } catch (error) {
      setError('Failed to resend code');
    }
    setIsResending(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          {formatPhoneNumber(phoneNumber as string)}
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => inputRefs.current[index] = el}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={styles.resendButton} 
          onPress={resendCode}
          disabled={timer > 0 || isResending}
        >
          {isResending ? (
            <ActivityIndicator color="#0057b8" />
          ) : (
            <Text style={[
              styles.resendText,
              timer > 0 && styles.resendTextDisabled
            ]}>
              {timer > 0 
                ? `Resend code in ${timer}s` 
                : 'Resend code'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}


