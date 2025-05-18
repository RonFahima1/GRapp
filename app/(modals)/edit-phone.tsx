import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

const EditPhoneScreen = () => {
  const router = useRouter();
  const [phone, setPhone] = useState('555-123-4567');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  // Function to send OTP
  const sendOTP = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setOtpSent(true);
    Alert.alert('OTP Sent', 'A verification code has been sent to your phone number');
  };

  // Function to verify OTP and update phone
  const verifyOTP = () => {
    if (otp.length === 6) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert('Phone Updated', 'Your phone number has been successfully updated', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit code sent to your phone');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with title and back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          <ChevronLeft color="#007AFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phone Number</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.descriptionText}>
          The phone number you provide will be used across all your accounts in the Bank Group
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
          {phone.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={() => setPhone('')}>
              <X size={16} color="#999999" />
            </TouchableOpacity>
          )}
        </View>

        {otpSent && (
          <>
            <Text style={[styles.descriptionText, styles.otpText]}>
              Enter the verification code sent to your phone
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={setOtp}
                placeholder="6-digit code"
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={verifyOTP}>
              <Text style={styles.submitButtonText}>Verify</Text>
            </TouchableOpacity>
          </>
        )}

        {!otpSent && (
          <TouchableOpacity style={styles.submitButton} onPress={sendOTP}>
            <Text style={styles.submitButtonText}>Update</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.privacyText}>
          I confirm that the details provided are accurate and I agree to the legal and privacy terms.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
  },
  backButton: {
    padding: 5,
  },
  rightPlaceholder: {
    width: 30,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    fontFamily: 'System',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  input: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'System',
    height: '100%',
    paddingRight: 30,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  otpText: {
    marginTop: 20,
  },
  privacyText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    fontFamily: 'System',
  },
});

export default EditPhoneScreen;
