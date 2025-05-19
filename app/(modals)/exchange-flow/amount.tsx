import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from '../../../hooks/useTranslation';
import { ArrowDown, RefreshCw, Info, ChevronDown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import StandardBackButton from '../../../components/StandardBackButton';

export default function ExchangeAmountScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [activeInput, setActiveInput] = useState('from'); // 'from' or 'to'
  const [exchangeRate, setExchangeRate] = useState(0.92); // Default rate (USD to EUR)
  
  // Get currency codes from params
  const fromCurrency = params.from as string || 'USD';
  const toCurrency = params.to as string || 'EUR';
  
  // Sample currency data
  const currencyData: Record<string, { name: string; flag: string; symbol: string; balance: number }> = {
    USD: { name: 'US Dollar', flag: '🇺🇸', symbol: '$', balance: 1250.00 },
    EUR: { name: 'Euro', flag: '🇪🇺', symbol: '€', balance: 450.30 },
    GBP: { name: 'British Pound', flag: '🇬🇧', symbol: '£', balance: 0 },
    JPY: { name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥', balance: 0 },
    CAD: { name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$', balance: 0 },
    AUD: { name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$', balance: 0 },
    CHF: { name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr', balance: 0 },
    CNY: { name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥', balance: 0 },
    INR: { name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹', balance: 0 },
    MXN: { name: 'Mexican Peso', flag: '🇲🇽', symbol: '$', balance: 0 },
  };
  
  // Get exchange rate based on selected currencies
  useEffect(() => {
    // In a real app, this would fetch the actual exchange rate from an API
    const rates: Record<string, number> = {
      'USD-EUR': 0.92,
      'USD-GBP': 0.78,
      'USD-JPY': 151.72,
      'EUR-USD': 1.09,
      'EUR-GBP': 0.85,
      'EUR-JPY': 165.02,
      'GBP-USD': 1.28,
      'GBP-EUR': 1.18,
      'GBP-JPY': 194.51,
      'JPY-USD': 0.0066,
      'JPY-EUR': 0.0061,
      'JPY-GBP': 0.0051,
    };
    
    const rateKey = `${fromCurrency}-${toCurrency}`;
    const fallbackRateKey = `USD-${toCurrency}`;
    
    if (rates[rateKey]) {
      setExchangeRate(rates[rateKey]);
    } else if (rates[fallbackRateKey]) {
      // Fallback to USD conversion if direct rate not available
      setExchangeRate(rates[fallbackRateKey]);
    } else {
      // Default fallback
      setExchangeRate(1);
    }
  }, [fromCurrency, toCurrency]);
  
  // Calculate the opposite amount when one amount changes
  useEffect(() => {
    if (activeInput === 'from' && fromAmount) {
      const calculated = (parseFloat(fromAmount) * exchangeRate).toFixed(2);
      setToAmount(calculated);
    } else if (activeInput === 'to' && toAmount) {
      const calculated = (parseFloat(toAmount) / exchangeRate).toFixed(2);
      setFromAmount(calculated);
    }
  }, [fromAmount, toAmount, exchangeRate, activeInput]);
  
  // Handle amount input change
  const handleFromAmountChange = (value: string) => {
    setActiveInput('from');
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setFromAmount(value);
    }
  };
  
  const handleToAmountChange = (value: string) => {
    setActiveInput('to');
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setToAmount(value);
    }
  };
  
  // Swap currencies
  const handleSwapCurrencies = () => {
    router.replace({
      pathname: '/(modals)/exchange-flow/amount',
      params: { from: toCurrency, to: fromCurrency }
    });
  };
  
  // Continue to review
  const handleContinue = () => {
    if (parseFloat(fromAmount) > 0) {
      router.push({
        pathname: '/(modals)/exchange-flow/review',
        params: {
          from: fromCurrency,
          to: toCurrency,
          fromAmount,
          toAmount,
          rate: exchangeRate.toString()
        }
      });
    }
  };
  
  // Check if continue button should be enabled
  const isContinueEnabled = parseFloat(fromAmount) > 0 && 
    parseFloat(fromAmount) <= (currencyData[fromCurrency]?.balance || 0);
  
  // Format balance with commas
  const formatBalance = (balance: number) => {
    return balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <StandardBackButton color="#000" />
          <Text style={styles.headerTitle}>{t('exchange_amount')}</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView 
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Exchange Rate Card */}
          <View style={styles.exchangeRateCard}>
            <View style={styles.exchangeRateHeader}>
              <Text style={styles.exchangeRateTitle}>{t('exchange_rate')}</Text>
              <TouchableOpacity style={styles.refreshButton}>
                <RefreshCw color="#007AFF" size={16} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.exchangeRateValue}>
              1 {fromCurrency} = {exchangeRate} {toCurrency}
            </Text>
            
            <Text style={styles.exchangeRateUpdated}>
              {t('updated')}: {new Date().toLocaleTimeString()}
            </Text>
          </View>
          
          {/* From Currency Input */}
          <View style={styles.currencyInputContainer}>
            <View style={styles.currencyInputHeader}>
              <Text style={styles.currencyInputLabel}>{t('from')}</Text>
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>{t('balance')}: </Text>
                <Text style={styles.balanceValue}>
                  {currencyData[fromCurrency]?.symbol}{formatBalance(currencyData[fromCurrency]?.balance || 0)}
                </Text>
              </View>
            </View>
            
            <View style={[
              styles.currencyInput,
              activeInput === 'from' && styles.activeCurrencyInput
            ]}>
              <TouchableOpacity 
                style={styles.currencySelector}
                onPress={() => router.push({
                  pathname: '/(modals)/exchange-flow/select-currency',
                  params: { to: toCurrency }
                })}
              >
                <Text style={styles.currencyFlag}>{currencyData[fromCurrency]?.flag}</Text>
                <Text style={styles.currencyCode}>{fromCurrency}</Text>
                <ChevronDown color="#8E8E93" size={16} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.amountInput}
                value={fromAmount}
                onChangeText={handleFromAmountChange}
                placeholder="0.00"
                placeholderTextColor="#C7C7CC"
                keyboardType="decimal-pad"
                autoFocus
                onFocus={() => setActiveInput('from')}
              />
            </View>
            
            {parseFloat(fromAmount) > currencyData[fromCurrency]?.balance && (
              <Text style={styles.errorText}>{t('insufficient_balance')}</Text>
            )}
          </View>
          
          {/* Swap Button */}
          <TouchableOpacity 
            style={styles.swapButton}
            onPress={handleSwapCurrencies}
          >
            <View style={styles.swapButtonInner}>
              <ArrowDown color="#FFFFFF" size={20} />
            </View>
          </TouchableOpacity>
          
          {/* To Currency Input */}
          <View style={styles.currencyInputContainer}>
            <View style={styles.currencyInputHeader}>
              <Text style={styles.currencyInputLabel}>{t('to')}</Text>
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>{t('balance')}: </Text>
                <Text style={styles.balanceValue}>
                  {currencyData[toCurrency]?.symbol}{formatBalance(currencyData[toCurrency]?.balance || 0)}
                </Text>
              </View>
            </View>
            
            <View style={[
              styles.currencyInput,
              activeInput === 'to' && styles.activeCurrencyInput
            ]}>
              <TouchableOpacity 
                style={styles.currencySelector}
                onPress={() => router.push({
                  pathname: '/(modals)/exchange-flow/select-currency',
                  params: { from: fromCurrency }
                })}
              >
                <Text style={styles.currencyFlag}>{currencyData[toCurrency]?.flag}</Text>
                <Text style={styles.currencyCode}>{toCurrency}</Text>
                <ChevronDown color="#8E8E93" size={16} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.amountInput}
                value={toAmount}
                onChangeText={handleToAmountChange}
                placeholder="0.00"
                placeholderTextColor="#C7C7CC"
                keyboardType="decimal-pad"
                onFocus={() => setActiveInput('to')}
              />
            </View>
          </View>
          
          {/* Fee Information */}
          <View style={styles.feeContainer}>
            <Info color="#8E8E93" size={16} />
            <Text style={styles.feeText}>
              {t('exchange_fee_info', { fee: '0.5%' })}
            </Text>
          </View>
        </ScrollView>
        
        {/* Continue Button */}
        <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              !isContinueEnabled && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={!isContinueEnabled}
          >
            <Text style={styles.continueButtonText}>{t('continue')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    padding: 16,
  },
  exchangeRateCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  exchangeRateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exchangeRateTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  refreshButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exchangeRateValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  exchangeRateUpdated: {
    fontSize: 12,
    color: '#8E8E93',
  },
  currencyInputContainer: {
    marginBottom: 24,
  },
  currencyInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencyInputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 13,
    color: '#8E8E93',
  },
  balanceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  currencyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeCurrencyInput: {
    borderColor: '#007AFF',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
  },
  currencyFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'right',
    padding: 0,
  },
  swapButton: {
    alignSelf: 'center',
    marginVertical: -12,
    zIndex: 1,
  },
  swapButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  feeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  feeText: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
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
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 13,
    color: '#FF3B30',
    marginTop: 8,
  },
});
