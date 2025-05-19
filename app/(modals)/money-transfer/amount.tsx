import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronDown, Calendar, DollarSign } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function AmountScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  
  const { recipientName, recipientAvatar, accountNumber } = params;
  
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [transferType, setTransferType] = useState('immediate'); // 'immediate', 'scheduled'
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  
  // Available balance (in a real app, this would come from an API)
  const availableBalance = 1250.00;
  
  // Available currencies
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
  ];
  
  const handleContinue = () => {
    if (parseFloat(amount) > 0 && parseFloat(amount) <= availableBalance) {
      router.push({
        pathname: './details',
        params: {
          ...params,
          amount,
          currency: selectedCurrency,
          transferType
        }
      });
    }
  };
  
  const getCurrencySymbol = (currencyCode: string): string => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency ? currency.symbol : '$';
  };

  const handleTransferTypeChange = (type: string): void => {
    setTransferType(type);
    if (type === 'scheduled') {
      // In a real app, you would show a date picker here
      // For this demo, we'll just set a future date
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
          <Text style={styles.headerTitle}>{t('Send Money')}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.recipientInfo}>
            <Text style={styles.recipientLabel}>{t('To')}</Text>
            <Text style={styles.recipientName}>{recipientName}</Text>
            <Text style={styles.accountNumber}>{accountNumber}</Text>
          </View>
          
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>{t('Amount')}</Text>
            
            <View style={styles.currencyInputContainer}>
              <TouchableOpacity 
                style={styles.currencySelector}
                onPress={() => setShowCurrencySelector(!showCurrencySelector)}
              >
                <Text style={styles.currencyCode}>{selectedCurrency}</Text>
                <ChevronDown color="#8E8E93" size={16} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>
            
            {showCurrencySelector && (
              <View style={styles.currencySelectorDropdown}>
                {currencies.map(currency => (
                  <TouchableOpacity
                    key={currency.code}
                    style={[
                      styles.currencyOption,
                      selectedCurrency === currency.code && styles.selectedCurrencyOption
                    ]}
                    onPress={() => {
                      setSelectedCurrency(currency.code);
                      setShowCurrencySelector(false);
                    }}
                  >
                    <Text style={[
                      styles.currencyOptionText,
                      selectedCurrency === currency.code && styles.selectedCurrencyOptionText
                    ]}>
                      {currency.symbol} {currency.code} - {currency.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceText}>
                {t('Available Balance')}: {getCurrencySymbol(selectedCurrency)}{availableBalance.toFixed(2)}
              </Text>
            </View>
          </View>
          
          <View style={styles.transferTypeContainer}>
            <Text style={styles.transferTypeLabel}>{t('When')}</Text>
            
            <View style={styles.transferTypeOptions}>
              <TouchableOpacity
                style={[
                  styles.transferTypeOption,
                  transferType === 'immediate' && styles.selectedTransferTypeOption
                ]}
                onPress={() => handleTransferTypeChange('immediate')}
              >
                <DollarSign 
                  color={transferType === 'immediate' ? "#FFFFFF" : "#8E8E93"} 
                  size={20} 
                />
                <Text style={[
                  styles.transferTypeText,
                  transferType === 'immediate' && styles.selectedTransferTypeText
                ]}>
                  {t('Send Now')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.transferTypeOption,
                  transferType === 'scheduled' && styles.selectedTransferTypeOption
                ]}
                onPress={() => handleTransferTypeChange('scheduled')}
              >
                <Calendar 
                  color={transferType === 'scheduled' ? "#FFFFFF" : "#8E8E93"} 
                  size={20} 
                />
                <Text style={[
                  styles.transferTypeText,
                  transferType === 'scheduled' && styles.selectedTransferTypeText
                ]}>
                  {t('Schedule')}
                </Text>
              </TouchableOpacity>
            </View>
            
            {transferType === 'scheduled' && (
              <View style={styles.scheduledDateContainer}>
                <Text style={styles.scheduledDateText}>
                  {t('Transfer will be scheduled for')}: May 25, 2025
                </Text>
                <TouchableOpacity style={styles.changeDateButton}>
                  <Text style={styles.changeDateButtonText}>{t('Change Date')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.continueButton, 
              (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance) 
                ? styles.continueButtonDisabled 
                : null
            ]}
            onPress={handleContinue}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
          >
            <Text style={styles.continueButtonText}>{t('Continue')}</Text>
          </TouchableOpacity>
          
          {parseFloat(amount) > availableBalance && (
            <Text style={styles.errorText}>
              {t('Amount exceeds available balance')}
            </Text>
          )}
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
  recipientInfo: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  recipientLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  recipientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#8E8E93',
  },
  amountContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  currencyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
  },
  currencySelectorDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currencyOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  selectedCurrencyOption: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  currencyOptionText: {
    fontSize: 16,
    color: '#000000',
  },
  selectedCurrencyOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  balanceContainer: {
    marginTop: 8,
  },
  balanceText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  transferTypeContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  transferTypeLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  transferTypeOptions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  transferTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  selectedTransferTypeOption: {
    backgroundColor: '#007AFF',
  },
  transferTypeText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 8,
  },
  selectedTransferTypeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scheduledDateContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  scheduledDateText: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
  },
  changeDateButton: {
    alignSelf: 'flex-start',
  },
  changeDateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
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
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
