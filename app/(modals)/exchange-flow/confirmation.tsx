import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from '../../../hooks/useTranslation';
import { CheckCircle, ArrowRight, Share2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function ExchangeConfirmationScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  // Animation for success checkmark
  const checkmarkScale = new Animated.Value(0);
  
  // Get exchange details from params
  const fromCurrency = params.from as string;
  const toCurrency = params.to as string;
  const fromAmount = params.fromAmount as string;
  const toAmount = params.toAmount as string;
  const exchangeRate = params.rate as string;
  const fee = params.fee as string;
  const total = params.total as string;
  
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
  
  // Generate a random transaction ID
  const transactionId = `TRX${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  // Format date for receipt
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Animate checkmark on mount
  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(checkmarkScale, {
        toValue: 1,
        tension: 40,
        friction: 5,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  // Handle done button
  const handleDone = () => {
    router.push('/(tabs)');
  };
  
  // Handle share receipt
  const handleShareReceipt = () => {
    // In a real app, this would open the share dialog
    console.log('Share receipt');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation */}
        <View style={styles.successContainer}>
          <Animated.View style={[
            styles.checkmarkContainer,
            { transform: [{ scale: checkmarkScale }] }
          ]}>
            <LinearGradient
              colors={['#34C759', '#30B350']}
              style={styles.checkmarkCircle}
            >
              <CheckCircle color="#FFFFFF" size={40} />
            </LinearGradient>
          </Animated.View>
          
          <Text style={styles.successTitle}>{t('exchange_successful')}</Text>
          <Text style={styles.successDescription}>
            {t('exchange_success_description')}
          </Text>
        </View>
        
        {/* Exchange Receipt Card */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptTitle}>{t('exchange_receipt')}</Text>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShareReceipt}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Share2 color="#007AFF" size={20} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{t('date_time')}</Text>
            <Text style={styles.receiptValue}>{formattedDate}, {formattedTime}</Text>
          </View>
          
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{t('transaction_id')}</Text>
            <Text style={styles.receiptValue}>{transactionId}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{t('from')}</Text>
            <View style={styles.currencyDisplay}>
              <Text style={styles.currencyFlag}>{currencyData[fromCurrency]?.flag}</Text>
              <Text style={styles.receiptValue}>
                {currencyData[fromCurrency]?.symbol}{parseFloat(fromAmount).toFixed(2)} {fromCurrency}
              </Text>
            </View>
          </View>
          
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{t('to')}</Text>
            <View style={styles.currencyDisplay}>
              <Text style={styles.currencyFlag}>{currencyData[toCurrency]?.flag}</Text>
              <Text style={styles.receiptValue}>
                {currencyData[toCurrency]?.symbol}{parseFloat(toAmount).toFixed(2)} {toCurrency}
              </Text>
            </View>
          </View>
          
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{t('exchange_rate')}</Text>
            <Text style={styles.receiptValue}>
              1 {fromCurrency} = {exchangeRate} {toCurrency}
            </Text>
          </View>
          
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{t('fee')}</Text>
            <Text style={styles.receiptValue}>
              {currencyData[fromCurrency]?.symbol}{fee} {fromCurrency}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, styles.totalLabel]}>{t('total')}</Text>
            <Text style={[styles.receiptValue, styles.totalValue]}>
              {currencyData[fromCurrency]?.symbol}{total} {fromCurrency}
            </Text>
          </View>
          
          <View style={styles.receiptRow}>
            <Text style={[styles.receiptLabel, styles.totalLabel]}>{t('status')}</Text>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{t('completed')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Done Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity 
          style={styles.doneButton}
          onPress={handleDone}
        >
          <Text style={styles.doneButtonText}>{t('done')}</Text>
          <ArrowRight color="#FFFFFF" size={20} />
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
  content: {
    flex: 1,
    padding: 16,
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  checkmarkContainer: {
    marginBottom: 16,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  successDescription: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  receiptCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  receiptLabel: {
    fontSize: 15,
    color: '#8E8E93',
  },
  receiptValue: {
    fontSize: 15,
    fontWeight: '500',
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginRight: 6,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#34C759',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  doneButton: {
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
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
