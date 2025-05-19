import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from '../../../hooks/useTranslation';
import { ChevronLeft, RefreshCw, ChevronDown, ArrowRight, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function ExchangeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Sample data for popular currencies
  const popularCurrencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: '1.00' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', rate: '0.92' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: '0.78' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', rate: '151.72' },
  ];

  // Sample data for my currencies (user's wallet)
  const myCurrencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', balance: '1,250.00' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', balance: '450.30' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
        >
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('exchange')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
      >
        {/* Exchange Rate Card */}
        <LinearGradient
          colors={['#007AFF', '#34AADC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.exchangeRateCard}
        >
          <View style={styles.exchangeRateHeader}>
            <Text style={styles.exchangeRateTitle}>{t('current_exchange_rate')}</Text>
            <TouchableOpacity style={styles.refreshButton}>
              <RefreshCw color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.exchangeRateContent}>
            <View style={styles.currencyContainer}>
              <Text style={styles.currencyFlag}>🇺🇸</Text>
              <Text style={styles.currencyCode}>USD</Text>
              <Text style={styles.currencyAmount}>1.00</Text>
            </View>
            
            <View style={styles.exchangeRateEquals}>
              <Text style={styles.equalsSign}>=</Text>
            </View>
            
            <View style={styles.currencyContainer}>
              <Text style={styles.currencyFlag}>🇪🇺</Text>
              <Text style={styles.currencyCode}>EUR</Text>
              <Text style={styles.currencyAmount}>0.92</Text>
            </View>
          </View>
          
          <Text style={styles.exchangeRateUpdated}>
            {t('updated')}: {new Date().toLocaleTimeString()}
          </Text>
        </LinearGradient>

        {/* Exchange Action Button */}
        <TouchableOpacity 
          style={styles.exchangeButton}
          onPress={() => router.push('/(modals)/exchange-flow/select-currency')}
        >
          <Text style={styles.exchangeButtonText}>{t('exchange_currency')}</Text>
          <ArrowRight color="#FFFFFF" size={20} />
        </TouchableOpacity>

        {/* My Currencies Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('my_currencies')}</Text>
          
          <View style={styles.currenciesContainer}>
            {myCurrencies.map((currency, index) => (
              <TouchableOpacity 
                key={currency.code} 
                style={[
                  styles.currencyCard,
                  index === myCurrencies.length - 1 && { marginBottom: 0 }
                ]}
                onPress={() => router.push({
                  pathname: '/(modals)/exchange-flow/select-currency',
                  params: { from: currency.code }
                })}
              >
                <View style={styles.currencyCardLeft}>
                  <Text style={styles.currencyCardFlag}>{currency.flag}</Text>
                  <View>
                    <Text style={styles.currencyCardCode}>{currency.code}</Text>
                    <Text style={styles.currencyCardName}>{currency.name}</Text>
                  </View>
                </View>
                <View style={styles.currencyCardRight}>
                  <Text style={styles.currencyCardBalance}>${currency.balance}</Text>
                  <ChevronRight color="#8E8E93" size={16} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Currencies Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('popular_currencies')}</Text>
          
          <View style={styles.currenciesContainer}>
            {popularCurrencies.map((currency, index) => (
              <TouchableOpacity 
                key={currency.code} 
                style={[
                  styles.currencyCard,
                  index === popularCurrencies.length - 1 && { marginBottom: 0 }
                ]}
                onPress={() => router.push({
                  pathname: '/(modals)/exchange-flow/select-currency',
                  params: { to: currency.code }
                })}
              >
                <View style={styles.currencyCardLeft}>
                  <Text style={styles.currencyCardFlag}>{currency.flag}</Text>
                  <View>
                    <Text style={styles.currencyCardCode}>{currency.code}</Text>
                    <Text style={styles.currencyCardName}>{currency.name}</Text>
                  </View>
                </View>
                <View style={styles.currencyCardRight}>
                  <Text style={styles.currencyCardRate}>1 USD = {currency.rate} {currency.code}</Text>
                  <ChevronRight color="#8E8E93" size={16} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  exchangeRateCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  exchangeRateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exchangeRateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exchangeRateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  currencyContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyFlag: {
    fontSize: 24,
    marginRight: 8,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  currencyAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  exchangeRateEquals: {
    flex: 1,
    alignItems: 'center',
  },
  equalsSign: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  exchangeRateUpdated: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  exchangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  exchangeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  currenciesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  currencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  currencyCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyCardFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  currencyCardCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  currencyCardName: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  currencyCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyCardBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  currencyCardRate: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 8,
  },
});
