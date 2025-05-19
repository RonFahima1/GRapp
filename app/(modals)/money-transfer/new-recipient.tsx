import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function NewRecipientScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  
  // Define form data type
  type RecipientFormData = {
    fullName: string;
    accountNumber: string;
    email: string;
    phone: string;
  };

  const [formData, setFormData] = useState<RecipientFormData>({
    fullName: '',
    accountNumber: '',
    email: '',
    phone: ''
  });
  type FormErrors = {
    fullName?: string;
    accountNumber?: string;
    email?: string;
    phone?: string;
  };

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('Full name is required');
      isValid = false;
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = t('Account number is required');
      isValid = false;
    } else if (formData.accountNumber.length < 8) {
      newErrors.accountNumber = t('Account number must be at least 8 characters');
      isValid = false;
    }

    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = t('Invalid email format');
      isValid = false;
    }

    if (formData.phone && !formData.phone.match(/^\+?[0-9]{10,15}$/)) {
      newErrors.phone = t('Invalid phone number');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Create a new recipient object
      const newRecipient = {
        id: Date.now().toString(),
        name: formData.fullName,
        accountNumber: formData.accountNumber,
        email: formData.email,
        phone: formData.phone
      };
      
      // Navigate to amount screen with the new recipient data
      router.push({
        pathname: './amount',
        params: {
          recipientId: newRecipient.id,
          recipientName: newRecipient.name,
          recipientAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
          accountNumber: newRecipient.accountNumber,
          isNewRecipient: 'true'
        }
      });
    }
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
          >
            <ChevronLeft color="#007AFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('New Recipient')}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>{t('Recipient Information')}</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('Full Name')}</Text>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder={t('Full Name')}
                value={formData.fullName}
                onChangeText={(text) => setFormData({...formData, fullName: text})}
                autoCapitalize="words"
              />
              {errors.fullName ? (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              ) : null}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('Account Number')}</Text>
              <TextInput
                style={[styles.input, errors.accountNumber && styles.inputError]}
                placeholder={t('Account Number')}
                value={formData.accountNumber}
                onChangeText={(text) => setFormData({...formData, accountNumber: text})}
                keyboardType="default"
              />
              {errors.accountNumber ? (
                <Text style={styles.errorText}>{errors.accountNumber}</Text>
              ) : null}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('Email (Optional)')}</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder={t('Email (optional)')}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('Phone (Optional)')}</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder={t('Phone Number (optional)')}
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                keyboardType="phone-pad"
              />
              {errors.phone ? (
                <Text style={styles.errorText}>{errors.phone}</Text>
              ) : null}
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {t('You are adding {{name}} ({{account}}) as a recipient', {
                name: formData.fullName,
                account: formData.accountNumber
              })}
            </Text>
            <Text style={styles.infoText}>
              {t('Please ensure all information is correct. The recipient will receive the money based on the account details provided.')}
            </Text>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.continueButton, (!formData.fullName || !formData.accountNumber) && styles.continueButtonDisabled]}
            onPress={handleSubmit}
            disabled={!formData.fullName || !formData.accountNumber}
          >
            <Text style={styles.continueButtonText}>{t('Continue')}</Text>
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
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#007AFF',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#B4D0F5',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
