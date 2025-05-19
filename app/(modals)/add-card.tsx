import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, Modal } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X as CloseIcon, Wifi, CreditCard, ChevronDown } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient'; 
import { Picker } from '@react-native-picker/picker';

// Consistent styling (can be moved to a shared constants file later)
const IOS_MODAL_BACKGROUND = '#F2F2F7'; // Standard iOS modal background
const IOS_HEADER_BACKGROUND = '#FFFFFF'; // Standard iOS header background
const PRIMARY_TEXT_COLOR = '#000000';
const SUBTLE_BORDER_COLOR = '#D1D1D6';
const SUBTLE_TEXT_COLOR = '#8E8E93'; // Added SUBTLE_TEXT_COLOR
const ACCENT_COLOR = '#007AFF'; // Standard iOS blue
const DESTRUCTIVE_COLOR = '#FF3B30'; // Standard iOS red
const DISABLED_COLOR = '#C7C7CC';

export default function AddCardModal() {
  const { t } = useTranslation();
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState(''); // MM/YY - This will now be display state, derived from month/year
  const [cvv, setCvv] = useState('');

  const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1).padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState<string>(String(new Date().getFullYear()));
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => String(currentYear + i)); // Next 15 years
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')); // 01-12

  // Update display expiryDate when selectedMonth or selectedYear changes internally via picker modal confirm
  const handleConfirmExpiry = () => {
    setExpiryDate(`${selectedMonth}/${selectedYear.slice(-2)}`);
    setShowExpiryPicker(false);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return text;
  };

  const handleAddCard = () => {
    console.log('Card Details:', { cardNumber, expiryDate, cvv });
    router.back();
  };

  const canAdd = cardNumber.length > 10 && expiryDate.length === 5 && cvv.length >= 3;

  const CardPreview = ({ number, expiry }: { number: string; expiry: string }) => {
    return (
      <View style={styles.cardPreviewContainer}>
        <LinearGradient
          colors={['#007AFF', '#00C6FF']}
          style={styles.cardPreview}
        >
          <View style={styles.cardPreviewHeader}>
            <Wifi size={28} color="#FFF" style={{ transform: [{ rotate: '90deg' }]}} />
            <Text style={styles.cardPreviewBank}>BANK</Text>
          </View>
          <Text style={styles.cardPreviewNumber}>{number || '**** **** **** ****'}</Text>
          <View style={styles.cardPreviewFooter}>
            <View style={styles.cardPreviewInfoLeft}>
              <Text style={styles.cardPreviewLabelSmall}>Card Holder</Text>
              <Text style={styles.cardPreviewName}>Client Name</Text>
            </View>
            <View style={styles.cardPreviewInfoRight}>
              <View style={{alignItems: 'flex-end', marginBottom: 5}}>
                <Text style={styles.cardPreviewLabelSmall}>Expires</Text>
                <Text style={styles.cardPreviewExpiry}>{expiry || 'MM/YY'}</Text>
              </View>
              <CreditCard size={30} color="rgba(255,255,255,0.7)" />
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t('addCard.title', 'Add New Card'),
          headerStyle: { backgroundColor: IOS_HEADER_BACKGROUND },
          headerTitleStyle: { color: PRIMARY_TEXT_COLOR, fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <Text style={[styles.headerButtonText, { color: ACCENT_COLOR }]}>
                {t('common.cancel', 'Cancel')}
              </Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleAddCard} style={styles.headerButton} disabled={!canAdd}>
              <Text style={[styles.headerButtonText, { color: canAdd ? ACCENT_COLOR : DISABLED_COLOR, fontWeight: '600' }]}>
                {t('common.add', 'Add')}
              </Text>
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerLargeTitle: false,
        }}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <CardPreview number={cardNumber} expiry={expiryDate} /> 
          <View style={styles.formContainer}> 
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('addCard.cardNumber', 'Card Number')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('addCard.cardNumberPlaceholder', '0000 0000 0000 0000')}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="number-pad"
                maxLength={19} // 16 digits + 3 spaces
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.expiryCvvInputContainer, { marginRight: 7.5 }]}>
                <Text style={styles.label}>{t('addCard.expiryDate', 'Expiry Date')}</Text>
                <TouchableOpacity onPress={() => setShowExpiryPicker(true)} style={styles.inputAsButton}>
                  <Text style={styles.inputAsButtonText}>{expiryDate || 'MM/YY'}</Text>
                  <ChevronDown size={18} color={SUBTLE_TEXT_COLOR} />
                </TouchableOpacity>
              </View>
              <View style={[styles.formGroup, styles.expiryCvvInputContainer, { marginLeft: 7.5 }]}>
                <Text style={styles.label}>{t('addCard.cvv', 'CVV')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('addCard.cvvPlaceholder', '123')}
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Expiry Picker Modal */}
        <Modal
          transparent={true}
          visible={showExpiryPicker}
          animationType="slide"
          onRequestClose={() => setShowExpiryPicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setShowExpiryPicker(false)} // Close on overlay press
          />
          <View style={styles.pickerModalContainer}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={() => setShowExpiryPicker(false)}>
                <Text style={styles.pickerButtonText}>{t('common.cancel', 'Cancel')}</Text>
              </TouchableOpacity>
              <Text style={styles.pickerTitle}>{t('addCard.selectExpiry', 'Select Expiry')}</Text>
              <TouchableOpacity onPress={handleConfirmExpiry}>
                <Text style={[styles.pickerButtonText, styles.pickerButtonDone]}>{t('common.done', 'Done')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pickersRow}>
              <View style={styles.pickerColumn}>
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                  style={styles.pickerComponent}
                  itemStyle={styles.pickerItem}
                >
                  {months.map(month => (
                    <Picker.Item key={month} label={month} value={month} />
                  ))}
                </Picker>
              </View>
              <View style={styles.pickerColumn}>
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={(itemValue) => setSelectedYear(itemValue)}
                  style={styles.pickerComponent}
                  itemStyle={styles.pickerItem}
                >
                  {years.map(year => (
                    <Picker.Item key={year} label={year} value={year} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: IOS_MODAL_BACKGROUND,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 0, 
  },
  contentContainer: {
    paddingVertical: 20, 
    paddingHorizontal: 15, 
  },
  headerButton: {
    paddingHorizontal: Platform.OS === 'ios' ? 0 : 10,
    paddingVertical: 5,
  },
  headerButtonText: {
    fontSize: 17,
  },
  cardPreviewContainer: {
    marginBottom: 30, 
    alignItems: 'center', 
  },
  cardPreview: {
    width: '100%',
    maxWidth: 350, 
    height: 200, 
    borderRadius: 12,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cardPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardPreviewBank: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  cardPreviewNumber: {
    color: '#FFF',
    fontSize: 22, 
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 15, 
  },
  cardPreviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardPreviewLabelSmall: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 9,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  cardPreviewName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  cardPreviewExpiry: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  cardPreviewInfoLeft: {
    flex: 1,
  },
  cardPreviewInfoRight: {
    alignItems: 'flex-end',
  },
  formGroup: {
    paddingHorizontal: 0, 
    paddingVertical: 0, 
    marginBottom: 20, 
  },
  label: {
    fontSize: 15,
    color: PRIMARY_TEXT_COLOR,
    marginBottom: 10, 
  },
  input: {
    fontSize: 17,
    color: PRIMARY_TEXT_COLOR,
    paddingVertical: 12, 
    paddingHorizontal: 10, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 8, 
    borderWidth: StyleSheet.hairlineWidth, 
    borderColor: SUBTLE_BORDER_COLOR,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expiryCvvInputContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  pickerModalContainer: {
    backgroundColor: IOS_MODAL_BACKGROUND, // Use iOS modal background for consistency
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SUBTLE_BORDER_COLOR,
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: PRIMARY_TEXT_COLOR,
  },
  pickerButtonText: {
    fontSize: 17,
    color: '#007AFF', // Standard iOS blue for actions
  },
  pickerButtonDone: {
    fontWeight: '600',
  },
  pickersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10, // Space above pickers
  },
  pickerColumn: {
    flex: 1,
  },
  pickerComponent: {
    // On iOS, height is intrinsic. For Android, might need explicit height.
    width: '100%',
  },
  pickerItem: {
    // Style for individual picker items (iOS only)
    fontSize: 20,
  },
  inputAsButton: { // Style for the TouchableOpacity that looks like an input
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 17,
    color: PRIMARY_TEXT_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: SUBTLE_BORDER_COLOR,
  },
  inputAsButtonText: {
    fontSize: 17,
    color: PRIMARY_TEXT_COLOR,
  },
  formContainer: { // Wrapper for form elements to ensure padding if needed
    // This can be used if you want overall padding for the form distinct from scrollview contentContainer
  }
});
