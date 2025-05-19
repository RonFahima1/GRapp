import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronDown, Calendar, DollarSign, Clock, Check } from 'lucide-react-native';
import { useTranslate } from '../../../context/TranslationContext';

export default function AmountScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslate();
  const params = useLocalSearchParams();
  
  const { recipientName, recipientAvatar, accountNumber } = params;
  
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [transferType, setTransferType] = useState('immediate'); // 'immediate', 'scheduled'
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  
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
        pathname: '/(modals)/send-money-flow/details',
        params: {
          ...params,
          amount,
          currency: selectedCurrency,
          transferType,
          scheduledDate: transferType === 'scheduled' ? formatDate(selectedDate) : '',
          scheduledTime: transferType === 'scheduled' ? selectedTime : ''
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
    // We handle the scheduled case directly in the button press handler
  };
  
  const openDatePicker = (): void => {
    setShowDatePicker(true);
  };
  
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(isRTL ? 'th' : 'en-US', options);
  };
  
  const handleDateSelection = (date: Date): void => {
    setSelectedDate(date);
  };
  
  const handleTimeSelection = (time: string): void => {
    setSelectedTime(time);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            accessibilityLabel={t('common.back')}
          >
            <ChevronLeft color="#007AFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('sendMoney.title')}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.recipientInfo}>
            <Text style={[styles.recipientLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.to')}</Text>
            <Text style={[styles.recipientName, { textAlign: isRTL ? 'right' : 'left' }]}>{recipientName}</Text>
            <Text style={[styles.accountNumber, { textAlign: isRTL ? 'right' : 'left' }]}>{accountNumber}</Text>
          </View>
          
          <View style={styles.amountContainer}>
            <Text style={[styles.amountLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.amount')}</Text>
            
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
            
            <View style={styles.balanceInfo}>
              <Text style={[styles.balanceText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('sendMoney.availableBalance')}: 
                <Text style={styles.balanceAmount}>
                  {getCurrencySymbol(selectedCurrency)}{availableBalance.toFixed(2)}
                </Text>
              </Text>
            </View>
          </View>
          
          <View style={styles.transferTypeContainer}>
            <Text style={[styles.transferTypeLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.transferType')}</Text>
            
            <View style={[styles.transferTypeButtons, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity 
                style={[styles.transferTypeButton, transferType === 'immediate' && styles.transferTypeButtonActive]}
                onPress={() => handleTransferTypeChange('immediate')}
                accessibilityLabel={t('sendMoney.immediateTransfer')}
              >
                <Text style={[styles.transferTypeButtonText, transferType === 'immediate' && styles.transferTypeButtonTextActive]}>{t('sendMoney.immediateTransfer')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.transferTypeButton, transferType === 'scheduled' && styles.transferTypeButtonActive]}
                onPress={() => handleTransferTypeChange('scheduled')}
                accessibilityLabel={t('sendMoney.scheduledTransfer')}
              >
                <Text style={[styles.transferTypeButtonText, transferType === 'scheduled' && styles.transferTypeButtonTextActive]}>{t('sendMoney.scheduledTransfer')}</Text>
              </TouchableOpacity>
            </View>
            
            {transferType === 'scheduled' && (
              <View style={styles.scheduledDateContainer}>
                <View style={[styles.scheduledDateHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Calendar color="#007AFF" size={20} />
                  <Text style={[styles.scheduledDateTitle, { marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }]}>{t('sendMoney.scheduleDateAndTime')}</Text>
                </View>
                
                <View style={styles.scheduledDateRow}>
                  <Text style={styles.scheduledDateLabel}>{t('sendMoney.date')}:</Text>
                  <TouchableOpacity 
                    style={styles.dateSelector}
                    onPress={openDatePicker}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dateValue}>{formatDate(selectedDate)}</Text>
                    <Calendar color="#007AFF" size={16} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scheduledDateRow}>
                  <Text style={styles.scheduledDateLabel}>{t('sendMoney.time')}:</Text>
                  <TouchableOpacity 
                    style={styles.dateSelector}
                    onPress={openDatePicker}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dateValue}>{selectedTime}</Text>
                    <Clock color="#007AFF" size={16} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.scheduledDateInfo}>
                  <Text style={[styles.scheduledDateInfoText, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.scheduledDateInfoText', { date: formatDate(selectedDate), time: selectedTime })}</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.continueButton, (parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance) && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
            accessibilityLabel={t('sendMoney.continue')}
          >
            <Text style={styles.continueButtonText}>{t('sendMoney.continue')}</Text>
          </TouchableOpacity>
        
          {parseFloat(amount) > availableBalance && (
            <Text style={styles.errorText}>{t('sendMoney.amountExceedsBalance')}</Text>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Date & Time Picker Modal */}
      <Modal
        visible={showDatePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerTitle}>{t('Schedule Transfer')}</Text>
              <TouchableOpacity
                style={styles.datePickerCloseButton}
                onPress={() => setShowDatePicker(false)}
                hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
              >
                <Text style={styles.datePickerCloseText}>{t('Done')}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.datePickerContent}>
              <Text style={styles.datePickerSectionTitle}>{t('Select Date')}</Text>
              <View style={styles.dateOptions}>
                {[0, 1, 2, 3, 7, 14].map(days => {
                  const date = new Date();
                  date.setDate(date.getDate() + days);
                  const isSelected = selectedDate.getDate() === date.getDate() && selectedDate.getMonth() === date.getMonth();

                  return (
                    <TouchableOpacity
                      key={days}
                      style={[styles.dateOption, isSelected && styles.selectedDateOption]}
                      onPress={() => handleDateSelection(date)}
                    >
                      <Text style={[styles.dateOptionDay, isSelected && styles.selectedDateOptionText]}>
                        {days === 0 ? t('Today') : days === 1 ? t('Tomorrow') : formatDate(date)}
                      </Text>
                      {isSelected && (
                        <View style={styles.selectedCheckmark}>
                          <Check color="#FFFFFF" size={12} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.datePickerSectionTitle}>{t('Select Time')}</Text>
              <View style={styles.timeOptions}>
                {['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'].map(time => {
                  const isSelected = selectedTime === time;

                  return (
                    <TouchableOpacity
                      key={time}
                      style={[styles.timeOption, isSelected && styles.selectedTimeOption]}
                      onPress={() => handleTimeSelection(time)}
                    >
                      <Text style={[styles.timeOptionText, isSelected && styles.selectedTimeOptionText]}>
                        {time}
                      </Text>
                      {isSelected && (
                        <View style={styles.selectedCheckmark}>
                          <Check color="#FFFFFF" size={12} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setShowDatePicker(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmButtonText}>{t('Confirm Schedule')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  scheduledDateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduledDateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  scheduledDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scheduledDateLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginRight: 8,
  },
  scheduledDateInfo: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  scheduledDateInfoText: {
    fontSize: 13,
    color: '#007AFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24, // Extra padding for iPhone X+ bottom area
    width: '100%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  datePickerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  datePickerCloseButton: {
    padding: 4,
  },
  datePickerCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  datePickerContent: {
    padding: 16,
  },
  datePickerSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 12,
    marginTop: 16,
  },
  dateOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dateOption: {
    width: '48%',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDateOption: {
    backgroundColor: '#007AFF',
  },
  dateOptionDay: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  selectedDateOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeOption: {
    width: '48%',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTimeOption: {
    backgroundColor: '#007AFF',
  },
  timeOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  selectedTimeOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
