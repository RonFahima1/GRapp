import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator, Keyboard, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, CheckCircle, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function VerifyOTPScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // Get exchange details from params
  const fromCurrency = params.from as string;
  const toCurrency = params.to as string;
  const fromAmount = params.fromAmount as string;
  const toAmount = params.toAmount as string;
  const exchangeRate = params.rate as string;
  const fee = params.fee as string;
  const total = params.total as string;
  
  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null, null, null]);
  
  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 500);
  }, []);
  
  // Handle OTP input change
  const handleOtpChange = (text: string, index: number) => {
    // Clear any previous errors
    setError('');
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (text && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  // Handle OTP verification
  const handleVerifyOtp = () => {
    // Check if OTP is complete
    if (otp.some(digit => digit === '')) {
      setError('Please enter the complete verification code');
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate verification (in a real app, this would call an API)
    setTimeout(() => {
      // For demo purposes, any OTP is valid except "000000"
      const enteredOtp = otp.join('');
      if (enteredOtp === '000000') {
        setError('Invalid verification code');
        setIsVerifying(false);
      } else {
        setIsVerified(true);
        setIsVerifying(false);
        
        // Navigate to confirmation screen after a brief delay
        setTimeout(() => {
          router.push({
            pathname: '/(modals)/exchange-flow/confirmation',
            params: {
              from: fromCurrency,
              to: toCurrency,
              fromAmount,
              toAmount,
              rate: exchangeRate,
              fee,
              total
            }
          });
        }, 1000);
      }
    }, 1500);
  };
  
  // Handle key press for backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          disabled={isVerifying || isVerified}
        >
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification Code</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        {isVerified ? (
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <CheckCircle color="#34C759" size={40} />
            </View>
            <Text style={styles.successText}>Verification Successful</Text>
            <Text style={styles.redirectingText}>Redirecting to confirmation</Text>
          </View>
        ) : (
          <>
            <Text style={styles.instructionText}>
              Enter the 6-digit verification code sent to your phone
            </Text>
            
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <View key={index} style={styles.otpInputContainer}>
                  <TextInput
                    ref={ref => inputRefs.current[index] = ref}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={text => handleOtpChange(text.replace(/[^0-9]/g, ''), index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    onKeyPress={e => handleKeyPress(e, index)}
                    selectionColor="#007AFF"
                  />
                </View>
              ))}
            </View>
            
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={styles.otpHintText}>
                Didn't receive the code? <Text style={styles.resendText}>Resend</Text>
              </Text>
            )}
            
            <TouchableOpacity 
              style={[
                styles.verifyButton,
                (otp.some(digit => digit === '') || isVerifying) && styles.disabledButton
              ]}
              onPress={handleVerifyOtp}
              disabled={otp.some(digit => digit === '') || isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.verifyButtonText}>Verify</Text>
                  <ArrowRight color="#FFFFFF" size={20} />
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 24,
  },
  otpInputContainer: {
    width: 45,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  otpInput: {
    width: '100%',
    height: '100%',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000000',
  },
  otpHintText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 32,
  },
  resendText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 32,
  },
  verifyButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
    shadowOpacity: 0,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  redirectingText: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
