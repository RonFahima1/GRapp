import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, TextInput, Modal, Button, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { ChevronLeft, Filter, Search, X as CloseIcon, ArrowDownRight, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslate } from '../../../context/TranslationContext';

const PRIMARY_COLOR = '#007AFF'; // Standard app blue for interactive elements
const LIGHT_TEXT_COLOR = '#FFFFFF'; // For text on dark/blue backgrounds
const DARK_TEXT_COLOR = '#000000'; // Standard dark text
const IOS_DESTRUCTIVE_RED = '#FF3B30'; // Standard iOS red for destructive actions
const IOS_HEADER_BACKGROUND = '#FFFFFF'; // Or a very light gray like #F7F7F7
const IOS_MODAL_BACKGROUND = '#F2F2F7'; // Typical iOS modal grouped background
const PENDING_COLOR = '#FFA500'; // For pending status, consistent with home screen
const SUBTLE_BORDER_COLOR = '#D1D1D6'; // iOS-like border color

type Transaction = {
  id: string;
  name: string;
  date: string;
  amount: number; // Amount in target currency for exchanges, or primary amount for sent/received
  currency: string; // Target currency for exchanges, or primary currency for sent/received
  originalAmount?: number; // Made optional to resolve lint errors, as its role for exchanges is covered by fromAmount/fromCurrency
  description?: string;
  recipientId?: string;
  photo?: string;
  status?: 'pending' | 'completed' | 'failed';
  type: 'sent' | 'received' | 'exchanged';
  fromCurrency?: string;
  fromAmount?: number;
};

type FilterCriteria = {
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  transactionType?: 'sent' | 'received' | 'exchanged' | 'all';
};

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    name: 'John Doe',
    date: '2024-05-10T10:30:00Z',
    amount: 50.00,
    currency: 'USD',
    description: 'Payment for services',
    recipientId: 'user_john_doe',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'completed',
    type: 'sent',
  },
  {
    id: '2',
    name: 'Alice Smith',
    date: '2024-05-09T14:15:00Z',
    amount: 120.00,
    currency: 'EUR',
    description: 'Birthday gift',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    status: 'completed',
    type: 'received',
  },
  {
    id: '3',
    name: 'Currency Exchange',
    date: '2024-05-08T09:00:00Z',
    amount: 85.00, // Amount in target currency
    currency: 'EUR', // Target currency
    fromCurrency: 'USD', // Source currency
    fromAmount: 100.00,  // Amount in source currency
    description: 'Exchange from USD to EUR',
    photo: 'https://cdn-icons-png.flaticon.com/512/9094/9094407.png', // Generic exchange icon
    status: 'completed',
    type: 'exchanged',
  },
  {
    id: '4',
    name: 'Robert Brown',
    date: '2024-05-07T18:45:00Z',
    amount: 75.50,
    currency: 'USD',
    description: 'Dinner payment',
    photo: 'https://randomuser.me/api/portraits/men/33.jpg',
    status: 'pending',
    type: 'sent',
  },
  {
    id: '5',
    name: 'Emily White',
    date: '2024-05-06T12:00:00Z',
    amount: 200.00,
    currency: 'CAD',
    description: 'Concert tickets refund',
    photo: 'https://randomuser.me/api/portraits/women/34.jpg',
    status: 'completed',
    type: 'received',
  },
  {
    id: '6',
    name: 'Michael Green',
    date: '2024-05-05T11:00:00Z',
    amount: 30.00,
    currency: 'GBP',
    description: 'Coffee with client',
    photo: 'https://randomuser.me/api/portraits/men/35.jpg',
    status: 'completed',
    type: 'sent',
  },
  {
    id: '7',
    name: 'Sophia Loren',
    date: '2024-05-04T16:20:00Z',
    amount: 500.00,
    currency: 'USD',
    description: 'Freelance project payment',
    photo: 'https://randomuser.me/api/portraits/women/36.jpg',
    status: 'completed',
    type: 'received',
  },
  {
    id: '8',
    name: 'David Wilson',
    date: '2024-05-03T08:05:00Z',
    amount: 25.00,
    currency: 'EUR',
    description: 'Book purchase',
    photo: 'https://randomuser.me/api/portraits/men/37.jpg',
    status: 'pending',
    type: 'sent',
  },
  {
    id: '9',
    name: 'Olivia Martinez',
    date: '2024-05-02T20:00:00Z',
    amount: 150.00,
    currency: 'CAD',
    description: 'Online course subscription',
    photo: 'https://randomuser.me/api/portraits/women/38.jpg',
    status: 'completed',
    type: 'sent',
  },
  {
    id: '10',
    name: 'James Johnson',
    date: '2024-05-01T13:13:00Z',
    amount: 99.99,
    currency: 'USD',
    description: 'Software license renewal',
    photo: 'https://randomuser.me/api/portraits/men/39.jpg',
    status: 'completed',
    type: 'received',
  },
  {
    id: '11',
    name: 'Isabella Garcia',
    date: '2024-04-30T17:50:00Z',
    amount: 60.00,
    currency: 'GBP',
    description: 'Gift card',
    photo: 'https://randomuser.me/api/portraits/women/40.jpg',
    status: 'completed',
    type: 'received',
  },
  {
    id: '12',
    name: 'Exchange GBP to USD',
    date: '2024-04-29T10:10:00Z',
    amount: 125.00, // Amount in target USD
    currency: 'USD', // Target currency
    fromCurrency: 'GBP', // Source currency
    fromAmount: 100.00,  // Amount in source GBP
    description: 'Personal currency exchange',
    photo: 'https://cdn-icons-png.flaticon.com/512/9094/9094407.png', 
    status: 'completed',
    type: 'exchanged',
  },
];

export default function TransactionsScreen() {
  const { t, isRTL } = useTranslate();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({ transactionType: 'all' });
  const [tempFilterCriteria, setTempFilterCriteria] = useState<FilterCriteria>({ transactionType: 'all' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<'startDate' | 'endDate' | null>(null);

  const transactions: Transaction[] = useMemo(() => SAMPLE_TRANSACTIONS, []);

  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (searchQuery) {
      result = result.filter(transaction =>
        transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.description && transaction.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (filterCriteria.startDate) {
      result = result.filter(t => new Date(t.date) >= filterCriteria.startDate!);
    }
    if (filterCriteria.endDate) {
      const endOfDay = new Date(filterCriteria.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      result = result.filter(t => new Date(t.date) <= endOfDay);
    }
    if (filterCriteria.minAmount !== undefined) {
      const minAmountValue = filterCriteria.minAmount;
      result = result.filter(t => Math.abs(t.amount) >= minAmountValue);
    }
    if (filterCriteria.maxAmount !== undefined) {
      const maxAmountValue = filterCriteria.maxAmount;
      result = result.filter(t => Math.abs(t.amount) <= maxAmountValue);
    }
    if (filterCriteria.transactionType && filterCriteria.transactionType !== 'all') {
      result = result.filter(t => t.type === filterCriteria.transactionType);
    }

    return result;
  }, [searchQuery, transactions, filterCriteria]);

  const handleTransactionPress = (transaction: Transaction) => {
    router.push({
      pathname: '/(modals)/send-money-flow/amount',
      params: {
        recipientName: transaction.name,
        recipientPhoto: transaction.photo,
      },
    });
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    let amountContent;
    if (item.type === 'exchanged') {
      const amountColorStyle = item.status === 'pending' ? styles.amountPending : styles.amountDefault;
      amountContent = (
        <View style={styles.exchangeDisplayContainer}>
          <Text style={[styles.transactionAmount, styles.exchangeAmountText, amountColorStyle]}>
            -{item.fromAmount?.toFixed(2)} {item.fromCurrency}
          </Text>
          <View style={styles.exchangeToLine}>
            {isRTL ? (
              <ArrowDownLeft
                size={14}
                style={styles.exchangeArrowIcon}
                color={amountColorStyle.color} // Use color from the style object
              />
            ) : (
              <ArrowDownRight
                size={14}
                style={styles.exchangeArrowIcon}
                color={amountColorStyle.color} // Use color from the style object
              />
            )}
            <Text style={[styles.transactionAmount, styles.exchangeAmountText, amountColorStyle]}>
              +{item.amount.toFixed(2)} {item.currency}
            </Text>
          </View>
        </View>
      );
    } else {
      // Existing logic for sent/received
      let amountPrefix = '';
      let amountStyle = styles.amountDefault;
      if (item.status === 'pending') {
        amountStyle = styles.amountPending;
        if (item.type === 'sent') amountPrefix = '-';
      } else {
        if (item.type === 'sent') amountPrefix = '-';
        else if (item.type === 'received') amountPrefix = '+';
      }
      const amountText = `${amountPrefix}${item.currency} ${item.amount.toFixed(2)}`;
      amountContent = (
        <Text style={[styles.transactionAmount, amountStyle]}>
          {amountText}
        </Text>
      );
    }

    return (
      <TouchableOpacity style={styles.transactionItem} onPress={() => handleTransactionPress(item)}>
        <Image source={{ uri: item.photo }} style={styles.transactionAvatar} />
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>{item.name}</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
        <View style={styles.transactionAmountContainer}>
          {amountContent}
          {item.status === 'pending' && (
            <Text style={styles.transactionStatusText}>{t('transactions.status.pending')}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const handleOpenFilters = () => {
    setTempFilterCriteria(JSON.parse(JSON.stringify(filterCriteria)));
    setIsFilterModalVisible(true);
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && datePickerTarget) {
      if (event.type === 'set' || Platform.OS === 'ios') {
        setTempFilterCriteria((prev: FilterCriteria) => ({
          ...prev,
          [datePickerTarget]: selectedDate,
        }));
      }
    }
    setDatePickerTarget(null);
  };

  const showDatepickerFor = (target: 'startDate' | 'endDate') => {
    setDatePickerTarget(target);
    setShowDatePicker(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()} 
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          accessibilityLabel={t('common.back')}
        >
          <ChevronLeft color={PRIMARY_COLOR} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('transactions.allTransactions')}</Text>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={handleOpenFilters} 
          hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
          accessibilityLabel={t('transactions.filter')}
        >
          <Filter color={PRIMARY_COLOR} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchFilterContainer}>
        <View style={[styles.searchContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Search color="#8E8E93" size={18} style={[styles.searchIcon, { marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }]} />
          <TextInput
            style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('transactions.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
        </View>

        {filteredTransactions.length > 0 ? (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContentContainer}
          />
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={[styles.emptyStateText, { textAlign: isRTL ? 'right' : 'left' }]}>{t('transactions.noTransactionsFound')}</Text>
            <Text style={[styles.emptyStateSubText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('transactions.adjustSearchOrFilter')}
            </Text>
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={[styles.modalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.modalTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{t('transactions.filterTransactions')}</Text>
              <TouchableOpacity 
                onPress={() => setIsFilterModalVisible(false)} 
                style={styles.modalCloseButton}
                accessibilityLabel={t('common.close')}
              >
                <CloseIcon color={PRIMARY_COLOR} size={22} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('transactions.filters.transactionType')}:</Text>
              <View style={styles.transactionTypeContainer}>
                {(['all', 'sent', 'received', 'exchanged'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      tempFilterCriteria.transactionType === type && styles.typeButtonSelected,
                    ]}
                    onPress={() => setTempFilterCriteria({ ...tempFilterCriteria, transactionType: type })}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        tempFilterCriteria.transactionType === type && styles.typeButtonTextSelected,
                      ]}
                    >
                      {t(`transactions.filters.types.${type}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('transactions.filters.dateRange')}:</Text>
              <View style={styles.filterInputRow}>
                <TouchableOpacity onPress={() => showDatepickerFor('startDate')} style={[styles.datePickerButton, { flex: 1, marginRight: 5 }]}>
                  <Text style={styles.datePickerButtonText}>
                    {tempFilterCriteria.startDate ? tempFilterCriteria.startDate.toLocaleDateString() : t('transactions.filters.startDate')}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.filterInputSeparator}>-</Text>
                <TouchableOpacity onPress={() => showDatepickerFor('endDate')} style={[styles.datePickerButton, { flex: 1, marginLeft: 5 }]}>
                  <Text style={styles.datePickerButtonText}>
                    {tempFilterCriteria.endDate ? tempFilterCriteria.endDate.toLocaleDateString() : t('transactions.filters.endDate')}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>{t('transactions.filters.amountRangeUSD')}</Text>
              <View style={styles.filterInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 5, textAlign: 'center' }]}
                  placeholder={t('transactions.filters.minAmount')}
                  placeholderTextColor="#C7C7CD"
                  textAlign={isRTL ? 'right' : 'center'}
                  keyboardType="numeric"
                  value={tempFilterCriteria.minAmount !== undefined ? String(tempFilterCriteria.minAmount) : ''}
                  onChangeText={(text) => {
                    const num = parseFloat(text);
                    setTempFilterCriteria((prev: FilterCriteria) => ({ ...prev, minAmount: isNaN(num) ? undefined : num }));
                  }}
                />
                <Text style={styles.filterInputSeparator}>-</Text>
                <TextInput
                  style={[styles.input, { flex: 1, marginLeft: 5, textAlign: 'center' }]}
                  placeholder={t('transactions.filters.maxAmount')}
                  placeholderTextColor="#C7C7CD"
                  textAlign={isRTL ? 'right' : 'center'}
                  keyboardType="numeric"
                  value={tempFilterCriteria.maxAmount !== undefined ? String(tempFilterCriteria.maxAmount) : ''}
                  onChangeText={(text) => {
                    const num = parseFloat(text);
                    setTempFilterCriteria((prev: FilterCriteria) => ({ ...prev, maxAmount: isNaN(num) ? undefined : num }));
                  }}
                />
              </View>
            </View>

            <View style={[styles.modalActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity style={[styles.button, styles.clearButton, { marginLeft: isRTL ? 8 : 0, marginRight: isRTL ? 0 : 8 }]} onPress={() => {
                setTempFilterCriteria({ transactionType: 'all' });
              }}>
                <Text style={styles.clearButtonText}>{t('transactions.filters.clearFilters')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.applyButton, { marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }]} onPress={() => {
                setFilterCriteria(tempFilterCriteria);
                setIsFilterModalVisible(false);
              }}>
                <Text style={styles.applyButtonText}>{t('transactions.filters.applyFilters')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={datePickerTarget && tempFilterCriteria[datePickerTarget] ? tempFilterCriteria[datePickerTarget]! : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: IOS_MODAL_BACKGROUND, // Use iOS-like grouped table view background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10, // Slightly less padding for a tighter iOS header
    backgroundColor: IOS_HEADER_BACKGROUND,
    borderBottomWidth: StyleSheet.hairlineWidth, // Standard iOS hairline border
    borderBottomColor: SUBTLE_BORDER_COLOR,
  },
  headerTitle: {
    fontSize: 17, // Standard iOS header title size
    fontWeight: '600', // Standard iOS header title weight
    color: DARK_TEXT_COLOR,
  },
  backButton: {
    padding: 5,
  },
  filterButton: {
    padding: 5,
  },
  searchFilterContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFF4',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  transactionList: {
    flex: 1,
  },
  listContentContainer: {
    paddingHorizontal: 0, // List items will span close to full width (respecting safe area)
    paddingVertical: 0, // No extra padding; items handle their own vertical padding
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: IOS_HEADER_BACKGROUND, // White background for each item
    paddingHorizontal: 15, // Standard iOS cell content padding
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth, // Standard iOS line separator
    borderBottomColor: SUBTLE_BORDER_COLOR,    // Color for the separator line
  },
  transactionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  transactionDate: {
    fontSize: 13,
    color: '#777777',
    marginTop: 2,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '500', // Regular weight for amounts
  },
  amountDefault: { // For sent, received (completed), and exchanged (completed)
    color: DARK_TEXT_COLOR, 
  },
  amountPending: { // For amounts of pending transactions
    color: PENDING_COLOR,
  },
  transactionPending: { // This style might be redundant if amountPending is used, but kept for structure
    // opacity: 0.7, 
  },
  transactionStatusText: {
    fontSize: 12,
    color: PENDING_COLOR, // Orange for pending status text
    marginTop: 2,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Standard iOS modal overlay dim
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: IOS_MODAL_BACKGROUND, // Consistent iOS modal background
    borderTopLeftRadius: 12, // Standard iOS modal corner radius
    borderTopRightRadius: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Accommodate home indicator
    maxHeight: '90%', // Allow more height for filters
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    // backgroundColor: PRIMARY_COLOR, // REMOVED blue modal header
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SUBTLE_BORDER_COLOR,
  },
  modalTitle: {
    fontSize: 17, // iOS modal title size
    fontWeight: '600',
    color: DARK_TEXT_COLOR,
  },
  modalCloseButton: {
    padding: 8, // Make it easier to tap
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingTop: 15,
  },
  label: {
    fontSize: 13, // Standard iOS form label size
    fontWeight: '400',
    color: '#6D6D72', // iOS label color
    marginBottom: 6,
    marginLeft: Platform.OS === 'ios' ? 4 : 0, // Slight indent for iOS grouped style labels
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: SUBTLE_BORDER_COLOR,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 17, // iOS input text size
    marginBottom: 15,
    color: DARK_TEXT_COLOR,
  },
  datePickerButton: {
    backgroundColor: '#FFFFFF',
    borderColor: SUBTLE_BORDER_COLOR,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    alignItems: 'flex-start', // Align text to left for iOS feel
  },
  datePickerButtonText: {
    fontSize: 17,
    color: DARK_TEXT_COLOR,
  },
  transactionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Or 'flex-start' with spacing
    marginBottom: 20,
    // Consider using UISegmentedControl look-alike if possible or more iOS-native buttons
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: SUBTLE_BORDER_COLOR,
    backgroundColor: '#FFFFFF', // Standard button bg
  },
  typeButtonSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  typeButtonText: {
    fontSize: 15,
    color: DARK_TEXT_COLOR,
  },
  typeButtonTextSelected: {
    color: LIGHT_TEXT_COLOR,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 16, // Add horizontal padding to actions
    paddingBottom: 10, // Ensure buttons are not too close to the edge
    borderTopWidth: StyleSheet.hairlineWidth, // Separator for modal actions
    borderTopColor: SUBTLE_BORDER_COLOR,
    paddingTop: 10, // Space above action buttons
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // iOS touch target size
  },
  applyButton: {
    backgroundColor: PRIMARY_COLOR,
    marginLeft: 8, // Space between buttons
  },
  applyButtonText: {
    color: LIGHT_TEXT_COLOR,
    fontSize: 17,
    fontWeight: '600',
  },
  clearButton: {
    // backgroundColor: SECONDARY_BUTTON_COLOR, // Make it look like a standard destructive button
    marginRight: 8, // Space between buttons
    // borderColor: PRIMARY_COLOR, 
    // borderWidth: 1,
  },
  clearButtonText: {
    color: IOS_DESTRUCTIVE_RED, // Destructive red for clear
    fontSize: 17,
    fontWeight: '400', // Regular weight for clear
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#777777',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 10,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  filterInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterInputSeparator: {
    fontSize: 17,
    color: DARK_TEXT_COLOR,
    marginHorizontal: 5,
  },
  exchangeDisplayContainer: {
    alignItems: 'flex-end', // Ensures the two lines are right-aligned within their container
  },
  exchangeAmountText: {
    // Can be used for specific line-height or font adjustments if needed
    // For now, inherits from transactionAmount
  },
  exchangeToLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2, // Small space between the 'from' and 'to' lines
  },
  exchangeArrowIcon: {
    marginRight: 4, // Space between arrow and the 'to' amount text
  },
});