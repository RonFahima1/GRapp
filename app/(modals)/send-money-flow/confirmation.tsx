import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, CheckCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function ConfirmationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  
  const { 
    recipientName, 
    amount, 
    currency, 
    transferType,
    paymentMethod,
    bank
  } = params;
  
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null, null, null]);
  
  // Demo OTP code
  const demoOtp = ['1', '2', '3', '4', '5', '6'];
  
  useEffect(() => {
    // Auto-focus the first input when the screen loads
    const firstInput = inputRefs.current[0];
    if (firstInput) {
      firstInput.focus();
    }
    
    // Start the countdown timer for OTP resend
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleOtpChange = (text: string, index: number) => {
    // Only allow numeric input
    if (/^[0-9]?$/.test(text)) {
      const newOtpCode = [...otpCode];
      newOtpCode[index] = text;
      setOtpCode(newOtpCode);
      
      // Auto-focus next input if a digit was entered
      if (text && index < 5) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };
  
  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to go to previous input
    if (e.nativeEvent.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };
  
  const handleVerifyOtp = () => {
    // Check if all OTP fields are filled
    if (otpCode.every(digit => digit !== '')) {
      setIsVerifying(true);
      
      // Simulate API verification delay
      setTimeout(() => {
        // For demo, we'll check against the demo OTP
        const isOtpCorrect = otpCode.join('') === demoOtp.join('');
        
        if (isOtpCorrect) {
          setIsVerified(true);
          
          // Navigate to success screen after a brief delay
          setTimeout(() => {
            router.push({
              pathname: '/(modals)/send-money/success',
              params: {
                ...params,
                transactionId: `TX${Math.floor(Math.random() * 1000000)}`
              }
            });
          }, 1000);
        } else {
          Alert.alert(
            t('Invalid OTP'),
            t('The OTP code you entered is incorrect. Please try again.'),
            [{ text: 'OK' }]
          );
          setIsVerifying(false);
          
          // Clear OTP fields
          setOtpCode(['', '', '', '', '', '']);
          const firstInput = inputRefs.current[0];
          if (firstInput) {
            firstInput.focus();
          }
        }
      }, 1500);
    } else {
      Alert.alert(
        t('Incomplete OTP'),
        t('Please enter the complete 6-digit OTP code.'),
        [{ text: 'OK' }]
      );
    }
  };
  
  const handleResendOtp = () => {
    if (canResend) {
      // Reset the OTP fields
      setOtpCode(['', '', '', '', '', '']);
      const firstInput = inputRefs.current[0];
      if (firstInput) {
        firstInput.focus();
      }
      
      // Reset the timer
      setSecondsLeft(30);
      setCanResend(false);
      
      // Show confirmation to the user
      Alert.alert(
        t('OTP Resent'),
        t('A new OTP code has been sent to your registered mobile number.'),
        [{ text: 'OK' }]
      );
    }
  };
  
  const getCurrencySymbol = (currencyCode: string): string => {
    const currencySymbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    return currencySymbols[currencyCode] || '$';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            disabled={isVerifying || isVerified}
          >
            <ChevronLeft color={isVerifying || isVerified ? "#C7C7CC" : "#007AFF"} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('Verify Transfer')}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.transferInfoContainer}>
            <Text style={styles.transferInfoTitle}>{t('Transfer Details')}</Text>
            <Text style={styles.transferInfoAmount}>
              {getCurrencySymbol(String(currency))}{parseFloat(String(amount)).toFixed(2)} {String(currency)}
            </Text>
            <Text style={styles.transferInfoRecipient}>{t('to')} {String(recipientName)}</Text>
            <Text style={styles.transferInfoMethod}>
              {t('via')} {String(paymentMethod) === 'bank' ? String(bank) : 'Card ending in 4242'}
            </Text>
          </View>
          
          <View style={styles.otpContainer}>
            <Text style={styles.otpTitle}>{t('Enter Verification Code')}</Text>
            <Text style={styles.otpDescription}>
              {t('We\'ve sent a 6-digit verification code to your registered mobile number.')}
            </Text>
            
            <View style={styles.otpInputContainer}>
              {otpCode.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                    isVerifying || isVerified ? styles.otpInputDisabled : null
                  ]}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  editable={!(isVerifying || isVerified)}
                />
              ))}
            </View>
            
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>
                {canResend 
                  ? t('Didn\'t receive the code?') 
                  : t('Resend code in {{seconds}}s', { seconds: secondsLeft })}
              </Text>
              {canResend && (
                <TouchableOpacity 
                  onPress={handleResendOtp}
                  disabled={isVerifying || isVerified}
                >
                  <Text style={[
                    styles.resendButton,
                    (isVerifying || isVerified) ? styles.resendButtonDisabled : null
                  ]}>
                    {t('Resend')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>{t('Demo Mode')}</Text>
            <Text style={styles.demoText}>
              {t('For this demo, use OTP code:')} {demoOtp.join('')}
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.verifyButton,
              (!otpCode.every(digit => digit !== '') || isVerifying || isVerified) 
                ? styles.verifyButtonDisabled 
                : null
            ]}
            onPress={handleVerifyOtp}
            disabled={!otpCode.every(digit => digit !== '') || isVerifying || isVerified}
          >
            {isVerifying ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : isVerified ? (
              <View style={styles.verifiedContainer}>
                <CheckCircle color="#FFFFFF" size={20} />
                <Text style={styles.verifyButtonText}>{t('Verified')}</Text>
              </View>
            ) : (
              <Text style={styles.verifyButtonText}>{t('Verify & Transfer')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  transferInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transferInfoTitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  transferInfoAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  transferInfoRecipient: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  transferInfoMethod: {
    fontSize: 14,
    color: '#8E8E93',
  },
  otpContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  otpTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  otpDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 24,
    textAlign: 'center',
  },
  otpInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 45,
    height: 56,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  otpInputDisabled: {
    backgroundColor: '#F2F2F7',
    color: '#8E8E93',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  resendButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 4,
  },
  resendButtonDisabled: {
    color: '#C7C7CC',
  },
  demoContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    color: '#007AFF',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#B4D0F5',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
