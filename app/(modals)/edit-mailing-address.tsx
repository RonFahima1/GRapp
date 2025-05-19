import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTranslate } from '../../context/TranslationContext';

const EditMailingAddressScreen = () => {
  const router = useRouter();
  const { t, isRTL } = useTranslate();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [address, setAddress] = useState({
    street: '123 Main St.',
    city: 'Springfield',
    zipCode: '12345',
  });

  // Function to send OTP
  const sendOTP = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setOtpSent(true);
    Alert.alert(
      t('editMailingAddress.otp.sentTitle'), 
      t('editMailingAddress.otp.sentMessage')
    );
  };

  // Function to verify OTP and update address
  const verifyOTP = () => {
    if (otp.length === 6) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      Alert.alert(
        t('editMailingAddress.update.successTitle'), 
        t('editMailingAddress.update.successMessage'), 
        [{ text: t('common.ok'), onPress: () => router.back() }]
      );
    } else {
      Alert.alert(
        t('editMailingAddress.otp.invalidTitle'), 
        t('editMailingAddress.otp.invalidMessage')
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with title and back button */}
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity 
          style={[styles.backButton, { left: isRTL ? undefined : 0, right: isRTL ? 0 : undefined }]} 
          onPress={() => router.back()}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          accessibilityLabel={t('common.back')}
        >
          <ChevronLeft color="#007AFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('editMailingAddress.title')}</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.descriptionText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('editMailingAddress.description')}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            value={address.street}
            onChangeText={(text) => setAddress({...address, street: text})}
            placeholder={t('editMailingAddress.fields.street')}
            autoCapitalize="words"
          />
          {address.street.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setAddress({...address, street: ''})}
            >
              <X size={16} color="#999999" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            value={address.city}
            onChangeText={(text) => setAddress({...address, city: text})}
            placeholder={t('editMailingAddress.fields.city')}
            autoCapitalize="words"
          />
          {address.city.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setAddress({...address, city: ''})}
            >
              <X size={16} color="#999999" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            value={address.zipCode}
            onChangeText={(text) => setAddress({...address, zipCode: text})}
            placeholder={t('editMailingAddress.fields.zipCode')}
            keyboardType="number-pad"
          />
          {address.zipCode.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setAddress({...address, zipCode: ''})}
            >
              <X size={16} color="#999999" />
            </TouchableOpacity>
          )}
        </View>

        {otpSent && (
          <>
            <Text style={[styles.descriptionText, styles.otpText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('editMailingAddress.otp.enterCode')}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                value={otp}
                onChangeText={setOtp}
                placeholder={t('editMailingAddress.otp.placeholder')}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={verifyOTP}>
              <Text style={styles.submitButtonText}>{t('editMailingAddress.buttons.verify')}</Text>
            </TouchableOpacity>
          </>
        )}

        {!otpSent && (
          <TouchableOpacity style={styles.submitButton} onPress={sendOTP}>
            <Text style={styles.submitButtonText}>{t('editMailingAddress.buttons.update')}</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.privacyText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('editMailingAddress.privacyConfirmation')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'System',
  },
  backButton: {
    padding: 5,
    position: 'absolute',
    zIndex: 10,
  },
  rightPlaceholder: {
    width: 30,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
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
    fontFamily: 'System',
  },
});

export default EditMailingAddressScreen;
