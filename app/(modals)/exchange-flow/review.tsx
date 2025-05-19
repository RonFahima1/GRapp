import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from '../../../hooks/useTranslation';
import { ChevronLeft, CheckCircle, Info, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReviewExchangeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get exchange details from params
  const fromCurrency = params.from as string;
  const toCurrency = params.to as string;
  const fromAmount = params.fromAmount as string;
  const toAmount = params.toAmount as string;
  const exchangeRate = params.rate as string;
  
  // Sample currency data
  const currencyData: Record<string, { name: string; flag: string; symbol: string }> = {
    USD: { name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
    EUR: { name: 'Euro', flag: '🇪🇺', symbol: '€' },
    GBP: { name: 'British Pound', flag: '🇬🇧', symbol: '£' },
    JPY: { name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
    CAD: { name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
    AUD: { name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
    CHF: { name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr' },
    CNY: { name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
    INR: { name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
    MXN: { name: 'Mexican Peso', flag: '🇲🇽', symbol: '$' },
  };
  
  // Calculate fee (0.5% of from amount)
  const feePercentage = 0.5;
  const feeAmount = parseFloat(fromAmount) * (feePercentage / 100);
  const formattedFee = feeAmount.toFixed(2);
  
  // Calculate total amount (from amount + fee)
  const totalAmount = parseFloat(fromAmount) + feeAmount;
  const formattedTotal = totalAmount.toFixed(2);
  
  // Handle exchange confirmation
  const handleConfirmExchange = () => {
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to OTP verification screen
      router.push({
        pathname: '/(modals)/exchange-flow/verify-otp',
        params: {
          from: fromCurrency,
          to: toCurrency,
          fromAmount,
          toAmount,
          rate: exchangeRate,
          fee: formattedFee,
          total: formattedTotal
        }
      });
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          disabled={isProcessing}
        >
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('review_exchange')}</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Exchange Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{t('exchange_summary')}</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('you_send')}</Text>
            <View style={styles.currencyDisplay}>
              <Text style={styles.currencyFlag}>{currencyData[fromCurrency]?.flag}</Text>
              <Text style={styles.summaryValue}>
                {currencyData[fromCurrency]?.symbol}{parseFloat(fromAmount).toFixed(2)} {fromCurrency}
              </Text>
            </View>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('you_receive')}</Text>
            <View style={styles.currencyDisplay}>
              <Text style={styles.currencyFlag}>{currencyData[toCurrency]?.flag}</Text>
              <Text style={styles.summaryValue}>
                {currencyData[toCurrency]?.symbol}{parseFloat(toAmount).toFixed(2)} {toCurrency}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('exchange_rate')}</Text>
            <Text style={styles.summaryValue}>
              1 {fromCurrency} = {exchangeRate} {toCurrency}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('fee')} ({feePercentage}%)</Text>
            <Text style={styles.summaryValue}>
              {currencyData[fromCurrency]?.symbol}{formattedFee} {fromCurrency}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.totalLabel]}>{t('total')}</Text>
            <Text style={[styles.summaryValue, styles.totalValue]}>
              {currencyData[fromCurrency]?.symbol}{formattedTotal} {fromCurrency}
            </Text>
          </View>
        </View>
        
        {/* Delivery Time */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <CheckCircle color="#34C759" size={20} />
            <Text style={styles.infoTitle}>{t('instant_exchange')}</Text>
          </View>
          <Text style={styles.infoDescription}>
            {t('exchange_time_description')}
          </Text>
        </View>
        
        {/* Terms and Conditions */}
        <View style={styles.termsContainer}>
          <Info color="#8E8E93" size={16} />
          <Text style={styles.termsText}>
            {t('exchange_terms')}
          </Text>
        </View>
      </ScrollView>
      
      {/* Confirm Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmExchange}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.confirmButtonText}>{t('confirm_exchange')}</Text>
              <ArrowRight color="#FFFFFF" size={20} />
            </>
          )}
        </TouchableOpacity>
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
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#8E8E93',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  currencyDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyFlag: {
    fontSize: 16,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 12,
  },
  termsText: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
