import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from '../../../hooks/useTranslation';
import { ChevronLeft, Search, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SelectCurrencyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  
  type Currency = {
    code: string;
    name: string;
    flag: string;
    rate: string;
  };
  
  const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>([]);
  
  // The system already knows the currency the user has (passed as a parameter)
  const fromCurrency = params.from as string || 'USD'; // Default to USD if not specified
  
  // Set page title
  const pageTitle = params.from ? t('select_target_currency') : t('select_source_currency');

  // Sample data for all available currencies
  const allCurrencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: '1.00' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', rate: '0.92' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: '0.78' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', rate: '151.72' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', rate: '1.37' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rate: '1.52' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', rate: '0.91' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', rate: '7.24' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', rate: '83.15' },
    { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽', rate: '17.50' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', rate: '1.35' },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿', rate: '1.65' },
    { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪', rate: '10.52' },
    { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴', rate: '10.78' },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷', rate: '1,363.45' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷', rate: '5.18' },
    { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰', rate: '7.82' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦', rate: '18.60' },
    { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺', rate: '92.35' },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷', rate: '32.15' },
  ];

  // Filter currencies based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCurrencies(allCurrencies);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allCurrencies.filter(
        currency => 
          currency.code.toLowerCase().includes(query) || 
          currency.name.toLowerCase().includes(query)
      );
      setFilteredCurrencies(filtered);
    }
  }, [searchQuery]);

  // Initialize with all currencies
  useEffect(() => {
    setFilteredCurrencies(allCurrencies);
  }, []);

  // Handle currency selection
  const handleCurrencySelect = (currency: Currency) => {
    // Go directly to amount screen with the selected target currency
    router.push({
      pathname: '/(modals)/exchange-flow/amount',
      params: { from: fromCurrency, to: currency.code }
    });
  };

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
        <Text style={styles.headerTitle}>{pageTitle}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#8E8E93" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search_currency')}
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color="#8E8E93" size={20} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredCurrencies}
        keyExtractor={(item) => item.code}
        style={styles.currencyList}
        contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.currencyItem}
            onPress={() => handleCurrencySelect(item)}
          >
            <View style={styles.currencyItemLeft}>
              <Text style={styles.currencyFlag}>{item.flag}</Text>
              <View>
                <Text style={styles.currencyCode}>{item.code}</Text>
                <Text style={styles.currencyName}>{item.name}</Text>
              </View>
            </View>
            <Text style={styles.currencyRate}>1 USD = {item.rate} {item.code}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('no_currencies_found')}</Text>
          </View>
        }
      />
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000000',
  },
  currencyList: {
    flex: 1,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  currencyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  currencyName: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  currencyRate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
