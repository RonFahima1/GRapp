import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronDown, Building2, CreditCard, Calendar, Clock } from 'lucide-react-native';
import { useTranslate } from '../../../context/TranslationContext';

export default function DetailsScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslate();
  const params = useLocalSearchParams();
  
  const { 
    recipientName, 
    recipientAvatar, 
    accountNumber, 
    amount, 
    currency, 
    transferType,
    scheduledDate,
    scheduledTime 
  } = params;
  
  // Convert params to proper types
  const amountValue = typeof amount === 'string' ? amount : String(amount);
  const currencyValue = typeof currency === 'string' ? currency : String(currency);
  const transferTypeValue = typeof transferType === 'string' ? transferType : String(transferType);
  const scheduledDateValue = typeof scheduledDate === 'string' ? scheduledDate : '';
  const scheduledTimeValue = typeof scheduledTime === 'string' ? scheduledTime : '';
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank');
  const [selectedBank, setSelectedBank] = useState('Chase');
  const [showBankSelector, setShowBankSelector] = useState(false);
  
  // Sample bank data
  const banks = [
    { id: 1, name: 'Chase', logo: 'https://logo.clearbit.com/chase.com' },
    { id: 2, name: 'Bank of America', logo: 'https://logo.clearbit.com/bankofamerica.com' },
    { id: 3, name: 'Wells Fargo', logo: 'https://logo.clearbit.com/wellsfargo.com' },
    { id: 4, name: 'Citibank', logo: 'https://logo.clearbit.com/citibank.com' },
  ];
  
  const handleContinue = () => {
    router.push({
      pathname: '/(modals)/send-money-flow/confirmation',
      params: {
        ...params,
        paymentMethod: selectedPaymentMethod,
        bank: selectedBank
      }
    });
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
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={[styles.backButton, { left: isRTL ? undefined : 0, right: isRTL ? 0 : undefined }]}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          accessibilityLabel={t('common.back')}
          accessibilityRole="button"
        >
          <ChevronLeft color="#007AFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} accessibilityRole="header">{t('sendMoney.details.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        accessibilityLabel={t('sendMoney.details.title')}
      >
        <View style={styles.summaryContainer}>
          <Text style={[styles.summaryTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.transferSummary')}</Text>
          
          <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.summaryLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.to')}</Text>
            <Text style={[styles.summaryValue, { textAlign: isRTL ? 'right' : 'left' }]}>{String(recipientName)}</Text>
          </View>
          
          <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.summaryLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.amount')}</Text>
            <Text style={[styles.summaryValue, { textAlign: isRTL ? 'right' : 'left' }]}>
              {getCurrencySymbol(currencyValue)}{parseFloat(amountValue).toFixed(2)} {currencyValue}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.summaryLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.when')}</Text>
            {transferTypeValue === 'immediate' ? (
              <Text style={[styles.summaryValue, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.immediateInfo')}</Text>
            ) : (
              <View style={[styles.scheduledTimeContainer, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <View style={[styles.scheduledTimeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Calendar color="#007AFF" size={14} />
                  <Text style={[styles.scheduledTimeText, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }]}>{scheduledDateValue}</Text>
                </View>
                <View style={[styles.scheduledTimeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Clock color="#007AFF" size={14} />
                  <Text style={[styles.scheduledTimeText, { textAlign: isRTL ? 'right' : 'left', marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }]}>{scheduledTimeValue}</Text>
                </View>
              </View>
            )}
          </View>
          
          <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.summaryLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.account')}</Text>
            <Text style={[styles.summaryValue, { textAlign: isRTL ? 'right' : 'left' }]}>{String(accountNumber)}</Text>
          </View>
        </View>
        
        <View style={styles.paymentMethodContainer}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.paymentMethod')}</Text>
          
          <View style={[styles.paymentOptions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                selectedPaymentMethod === 'bank' && styles.selectedPaymentOption
              ]}
              onPress={() => setSelectedPaymentMethod('bank')}
              accessibilityLabel={t('sendMoney.details.bankAccount')}
              accessibilityRole="button"
            >
              <Building2 
                color={selectedPaymentMethod === 'bank' ? "#FFFFFF" : "#8E8E93"} 
                size={24} 
              />
              <Text style={[
                styles.paymentOptionText,
                selectedPaymentMethod === 'bank' && styles.selectedPaymentOptionText,
                { textAlign: isRTL ? 'right' : 'left' }
              ]}>
                {t('sendMoney.details.bankAccount')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.paymentOption,
                selectedPaymentMethod === 'card' && styles.selectedPaymentOption
              ]}
              onPress={() => setSelectedPaymentMethod('card')}
              accessibilityLabel={t('sendMoney.details.creditDebitCard')}
              accessibilityRole="button"
            >
              <CreditCard 
                color={selectedPaymentMethod === 'card' ? "#FFFFFF" : "#8E8E93"} 
                size={24} 
              />
              <Text style={[
                styles.paymentOptionText,
                selectedPaymentMethod === 'card' && styles.selectedPaymentOptionText,
                { textAlign: isRTL ? 'right' : 'left' }
              ]}>
                {t('sendMoney.details.creditDebitCard')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {selectedPaymentMethod === 'bank' && (
          <View style={styles.bankSelectionContainer}>
            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.selectBank')}</Text>
            
            <TouchableOpacity 
              style={[styles.bankSelector, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              onPress={() => setShowBankSelector(!showBankSelector)}
              accessibilityLabel={t('sendMoney.details.selectBank')}
              accessibilityRole="button"
            >
              <View style={[styles.selectedBankInfo, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                {banks.find(bank => bank.name === selectedBank)?.logo && (
                  <Image 
                    source={{ uri: banks.find(bank => bank.name === selectedBank)?.logo }} 
                    style={[styles.bankLogo, { marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }]} 
                  />
                )}
                <Text style={[styles.selectedBankName, { textAlign: isRTL ? 'right' : 'left' }]}>{selectedBank}</Text>
              </View>
              <ChevronDown color="#8E8E93" size={16} />
            </TouchableOpacity>
            
            {showBankSelector && (
              <View style={styles.bankSelectorDropdown}>
                {banks.map(bank => (
                  <TouchableOpacity
                    key={bank.id}
                    style={[
                      styles.bankOption,
                      { flexDirection: isRTL ? 'row-reverse' : 'row' },
                      selectedBank === bank.name && styles.selectedBankOption
                    ]}
                    onPress={() => {
                      setSelectedBank(bank.name);
                      setShowBankSelector(false);
                    }}
                    accessibilityLabel={bank.name}
                    accessibilityRole="button"
                  >
                    <Image source={{ uri: bank.logo }} style={[styles.bankLogo, { marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }]} />
                    <Text style={[
                      styles.bankOptionText,
                      { textAlign: isRTL ? 'right' : 'left' },
                      selectedBank === bank.name && styles.selectedBankOptionText
                    ]}>
                      {bank.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
        
        {selectedPaymentMethod === 'card' && (
          <View style={styles.cardSelectionContainer}>
            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.selectCard')}</Text>
            
            <View style={[styles.cardOption, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={styles.cardIconContainer}>
                <CreditCard color="#007AFF" size={24} />
              </View>
              <View style={[styles.cardInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.cardName, { textAlign: isRTL ? 'right' : 'left' }]}>{t('common.visa')} {t('common.endingIn')} 4242</Text>
                <Text style={[styles.cardExpiry, { textAlign: isRTL ? 'right' : 'left' }]}>{t('common.expires')} 12/25</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.addCardButton}
              accessibilityLabel={t('sendMoney.details.addNewCard')}
              accessibilityRole="button"
            >
              <Text style={[styles.addCardButtonText, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.addNewCard')}</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.feeContainer}>
          <Text style={[styles.feeTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.feeBreakdown')}</Text>
          
          <View style={[styles.feeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.feeLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.transferAmount')}</Text>
            <Text style={[styles.feeValue, { textAlign: isRTL ? 'right' : 'left' }]}>
              {getCurrencySymbol(currencyValue)}{parseFloat(amountValue).toFixed(2)}
            </Text>
          </View>
          
          <View style={[styles.feeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.feeLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.transferFee')}</Text>
            <Text style={[styles.feeValue, { textAlign: isRTL ? 'right' : 'left' }]}>{getCurrencySymbol(currencyValue)}2.50</Text>
          </View>
          
          <View style={[styles.totalRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.totalLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{t('sendMoney.details.total')}</Text>
            <Text style={[styles.totalValue, { textAlign: isRTL ? 'right' : 'left' }]}>
              {getCurrencySymbol(currencyValue)}{(parseFloat(amountValue) + 2.50).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
          accessibilityLabel={t('sendMoney.details.continue')}
          accessibilityRole="button"
        >
          <Text style={styles.continueButtonText}>{t('sendMoney.details.continue')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
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
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  scheduledTimeContainer: {
    alignItems: 'flex-end',
  },
  scheduledTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  scheduledTimeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 6,
  },
  paymentMethodContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  selectedPaymentOption: {
    backgroundColor: '#007AFF',
  },
  paymentOptionText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 8,
  },
  selectedPaymentOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bankSelectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  bankSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
  },
  selectedBankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankLogo: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 8,
  },
  selectedBankName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  bankSelectorDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bankOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  selectedBankOption: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  bankOptionText: {
    fontSize: 16,
    color: '#000000',
  },
  selectedBankOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  cardSelectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  cardExpiry: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  addCardButton: {
    padding: 12,
    alignItems: 'center',
  },
  addCardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  feeContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  feeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  feeLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  feeValue: {
    fontSize: 14,
    color: '#000000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
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
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
