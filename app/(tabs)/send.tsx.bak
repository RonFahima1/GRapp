import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from '@/context/I18nContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowRight,ChevronRight, ChevronDown, Search, Plus, CreditCard as Edit2, Trash2, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getPayoutTypes, getExchangeRates } from '@/services/api';
import { Recipient, PayoutType, Country } from '@/types';

export default function SendScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [payoutTypes, setPayoutTypes] = useState<PayoutType[]>([]);
  const [selectedPayoutType, setSelectedPayoutType] = useState<PayoutType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [showAddRecipient, setShowAddRecipient] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    phone: '',
    email: '',
    accountNumber: '',
  });

  const countries: Country[] = [
    { id: 1, name: 'Mexico', code: 'MX', flag: '🇲🇽', currency: 'MXN' },
    { id: 2, name: 'Philippines', code: 'PH', flag: '🇵🇭', currency: 'PHP' },
    { id: 3, name: 'India', code: 'IN', flag: '🇮🇳', currency: 'INR' },
    { id: 4, name: 'Colombia', code: 'CO', flag: '🇨🇴', currency: 'COP' },
  ];

  const recipients: Recipient[] = [
    { id: 1, name: 'Maria Rodriguez', phone: '+52 55 1234 5678', email: 'maria@example.com', accountNumber: '1234567890', country: countries[0], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80', recent: true },
    { id: 2, name: 'Juan Perez', phone: '+52 55 9876 5432', email: 'juan@example.com', accountNumber: '0987654321', country: countries[0], avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80', recent: true },
    { id: 3, name: 'Ana Lopez', phone: '+63 917 123 4567', email: 'ana@example.com', accountNumber: '2345678901', country: countries[1], avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80', recent: true },
    { id: 4, name: 'Carlos Gomez', phone: '+91 98765 43210', email: 'carlos@example.com', accountNumber: '3456789012', country: countries[2], avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80', recent: false },
    { id: 5, name: 'Sofia Martinez', phone: '+57 300 123 4567', email: 'sofia@example.com', accountNumber: '4567890123', country: countries[3], avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80', recent: false },
  ];

  const [filteredRecipients, setFilteredRecipients] = useState<Recipient[]>(recipients);
  const [recentRecipients, setRecentRecipients] = useState<Recipient[]>(recipients.filter(recipient => recipient.recent));
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);

  useEffect(() => {
    if (searchQuery) {
      setFilteredRecipients(
        recipients.filter(recipient => 
          recipient.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredRecipients(recipients);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedCountry) {
      fetchPayoutTypes();
      fetchExchangeRate();
    }
  }, [selectedCountry]);

  const fetchPayoutTypes = async () => {
    if (!selectedCountry) return;
    
    setIsLoading(true);
    try {
      const data = await getPayoutTypes(selectedCountry.code);
      setPayoutTypes(data);
      if (data.length > 0) {
        setSelectedPayoutType(data[0]);
      }
    } catch (error) {
      console.error('Error fetching payout types:', error);
      Alert.alert('Error', 'Failed to fetch payout types. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExchangeRate = async () => {
    if (!selectedCountry) return;
    
    try {
      const data = await getExchangeRates('USD', selectedCountry.currency);
      setExchangeRate(data.rate);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  const handleSelectRecipient = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setSelectedCountry(recipient.country);
    setShowCountrySelector(false);
  };

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setShowCountrySelector(false);
  };

  const handleAddRecipient = () => {
    if (!newRecipient.name || !newRecipient.phone || !selectedCountry) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // In a real app, this would be an API call to save the recipient
    Alert.alert('Success', 'Recipient added successfully');
    setShowAddRecipient(false);
    setNewRecipient({
      name: '',
      phone: '',
      email: '',
      accountNumber: '',
    });
  };

  const calculateReceivedAmount = () => {
    if (!amount || !exchangeRate) return '0.00';
    return (parseFloat(amount) * exchangeRate).toFixed(2);
  };

  const renderMainContent = () => {
    if (showAddRecipient) {
      return renderAddRecipientForm();
    }

    if (selectedRecipient) {
      return renderTransferDetails();
    }

    return renderRecipientSelection();
  };

  const renderAddRecipientForm = () => {
    return (
      <View style={styles.formContainer}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>{t('add_new_recipient')}</Text>
          <TouchableOpacity onPress={() => setShowAddRecipient(false)}>
            <X color="#333" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('full_name')}</Text>
          <TextInput
            style={styles.textInput}
            value={newRecipient.name}
            onChangeText={(text) => setNewRecipient({...newRecipient, name: text})}
            placeholder={t('enter_full_name')}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('phone_number')}</Text>
          <TextInput
            style={styles.textInput}
            value={newRecipient.phone}
            onChangeText={(text) => setNewRecipient({...newRecipient, phone: text})}
            placeholder={t('enter_phone_number')}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('email_optional')}</Text>
          <TextInput
            style={styles.textInput}
            value={newRecipient.email}
            onChangeText={(text) => setNewRecipient({...newRecipient, email: text})}
            placeholder={t('enter_email')}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('country')}</Text>
          <TouchableOpacity 
            style={styles.countrySelector}
            onPress={() => setShowCountrySelector(true)}
          >
            <Text style={styles.countrySelectorText}>
              {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : t('select_country')}
            </Text>
            <ChevronDown color="#333" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{t('account_number')}</Text>
          <TextInput
            style={styles.textInput}
            value={newRecipient.accountNumber}
            onChangeText={(text) => setNewRecipient({...newRecipient, accountNumber: text})}
            placeholder={t('enter_account_number')}
          />
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddRecipient}
        >
          <Text style={styles.addButtonText}>{t('save_recipient')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTransferDetails = () => {
    if (!selectedRecipient || !selectedCountry) return null;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.recipientCard}>
          <View style={styles.recipientCardHeader}>
            <Text style={styles.recipientCardTitle}>{t('sending_to')}</Text>
            <TouchableOpacity onPress={() => setSelectedRecipient(null)}>
              <Edit2 color="#FF6B6B" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.selectedRecipientInfo}>
            <Image source={{ uri: selectedRecipient.avatar }} style={styles.selectedRecipientAvatar} />
            <View style={styles.selectedRecipientDetails}>
              <Text style={styles.selectedRecipientName}>{selectedRecipient.name}</Text>
              <Text style={styles.selectedRecipientCountry}>{selectedRecipient.country.flag} {selectedRecipient.country.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.amountContainer}>
          <View style={styles.currencySelector}>
            <Text style={styles.currencyText}>USD</Text>
            <ChevronDown color="#333" size={20} />
          </View>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
            placeholderTextColor="#BBBBBB"
          />
        </View>

        <View style={styles.exchangeRateContainer}>
          <Text style={styles.exchangeRateText}>
            {t('exchange_rate')}: 1 USD = {exchangeRate.toFixed(2)} {selectedCountry.currency}
          </Text>
          <Text style={styles.receivedAmountText}>
            {t('recipient_gets')}: {calculateReceivedAmount()} {selectedCountry.currency}
          </Text>
        </View>

        <View style={styles.payoutTypesContainer}>
          <Text style={styles.payoutTypesTitle}>{t('payout_method')}</Text>
          
          {isLoading ? (
            <ActivityIndicator size="small" color="#FF6B6B" />
          ) : (
            <View style={styles.payoutTypesList}>
              {payoutTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.payoutTypeItem,
                    selectedPayoutType?.id === type.id && styles.selectedPayoutType
                  ]}
                  onPress={() => setSelectedPayoutType(type)}
                >
                  <View style={styles.payoutTypeHeader}>
                    <Text style={[
                      styles.payoutTypeName,
                      selectedPayoutType?.id === type.id && styles.selectedPayoutTypeName
                    ]}>
                      {type.name}
                    </Text>
                    {type.discount > 0 && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{type.discount}% OFF</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.payoutTypeDetails}>
                    <Text style={styles.payoutTypeDetail}>
                      {t('fee')}: ${type.fee.toFixed(2)}
                    </Text>
                    <Text style={styles.payoutTypeDetail}>
                      {t('delivery')}: {type.deliveryTime}
                    </Text>
                    <Text style={styles.payoutTypeDetail}>
                      {t('limit')}: ${type.minAmount} - ${type.maxAmount}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    );
  };

  const renderRecipientSelection = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('send_money')}</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search color="#999" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('search_recipients')}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.addRecipientContainer}>
          <TouchableOpacity 
            style={styles.addRecipientButton}
            onPress={() => setShowAddRecipient(true)}
          >
            <Plus color="#FF6B6B" size={20} />
            <Text style={styles.addRecipientText}>{t('add_new_recipient')}</Text>
          </TouchableOpacity>
        </View>

        {recentRecipients.length > 0 && searchQuery === '' && (
          <View style={styles.recentContainer}>
            <Text style={styles.sectionTitle}>{t('recent')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
              {recentRecipients.map((recipient) => (
                <TouchableOpacity 
                  key={recipient.id} 
                  style={styles.recentRecipient}
                  onPress={() => handleSelectRecipient(recipient)}
                >
                  <Image source={{ uri: recipient.avatar }} style={styles.recentAvatar} />
                  <Text style={styles.recentName} numberOfLines={1}>
                    {recipient.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.recipientsContainer}>
          <Text style={styles.sectionTitle}>{t('all_contacts')}</Text>
          {filteredRecipients.map((recipient) => (
            <TouchableOpacity 
              key={recipient.id} 
              style={styles.recipientItem}
              onPress={() => handleSelectRecipient(recipient)}
            >
              <Image source={{ uri: recipient.avatar }} style={styles.recipientAvatar} />
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientName}>{recipient.name}</Text>
                <Text style={styles.recipientCountry}>
                  {recipient.country.flag} {recipient.country.name}
                </Text>
              </View>
              <ChevronRight color="#999" size={20} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {renderMainContent()}

      {showCountrySelector && (
        <View style={styles.countryModal}>
          <View style={styles.countryModalContent}>
            <View style={styles.countryModalHeader}>
              <Text style={styles.countryModalTitle}>{t('select_country')}</Text>
              <TouchableOpacity onPress={() => setShowCountrySelector(false)}>
                <X color="#333" size={24} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {countries.map((country) => (
                <TouchableOpacity
                  key={country.id}
                  style={styles.countryItem}
                  onPress={() => handleSelectCountry(country)}
                >
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <Text style={styles.countryName}>{country.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {(selectedRecipient && selectedPayoutType) && (
        <View style={styles.bottomContainer}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}>
            <Text style={styles.continueButtonText}>{t('continue')}</Text>
            <ArrowRight color="#fff" size={20} />
          </LinearGradient>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 20,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  currencyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  balanceInfo: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  balanceText: {
    fontSize: 14,
    color: '#666',
  },
  balanceAmount: {
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  addRecipientContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addRecipientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#FF6B6B',
  },
  addRecipientText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 10,
  },
  recentContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  recentScroll: {
    paddingLeft: 20,
  },
  recentRecipient: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  recentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  recentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    width: 70,
  },
  recipientsContainer: {
    paddingBottom: 100,
  },
  recipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recipientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  recipientInfo: {
    flex: 1,
    marginLeft: 15,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recipientCountry: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(248, 249, 250, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  countryModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  countryModalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '80%',
    maxHeight: '70%',
    padding: 20,
  },
  countryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  countryName: {
    fontSize: 16,
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  countrySelectorText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  recipientCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  recipientCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recipientCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  selectedRecipientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedRecipientAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  selectedRecipientDetails: {
    flex: 1,
  },
  selectedRecipientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  selectedRecipientCountry: {
    fontSize: 14,
    color: '#666',
  },
  exchangeRateContainer: {
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  exchangeRateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  receivedAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  payoutTypesContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  payoutTypesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  payoutTypesList: {
    marginBottom: 20,
  },
  payoutTypeItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  selectedPayoutType: {
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
  },
  payoutTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  payoutTypeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  selectedPayoutTypeName: {
    color: '#FF6B6B',
  },
  discountBadge: {
    backgroundColor: '#FFE0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  discountText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '700',
  },
  payoutTypeDetails: {
    marginTop: 5,
  },
  payoutTypeDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  spacer: {
    height: 100,
  },
});