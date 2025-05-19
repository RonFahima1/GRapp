import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Platform,
  Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslate, LanguageCode } from '../../context/TranslationContext';

type LanguageSelectorModalProps = {
  isVisible: boolean;
  onClose: () => void;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (language: LanguageCode) => void;
  languages: { code: string; name: string }[];
};

export default function LanguageSelectorModal({
  isVisible,
  onClose,
  selectedLanguage,
  onSelectLanguage,
  languages
}: LanguageSelectorModalProps) {
  const [tempSelectedLanguage, setTempSelectedLanguage] = useState<LanguageCode>(selectedLanguage);
  const { t, isRTL, languages: supportedLanguages } = useTranslate();

  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleCancel = () => {
    handleTap();
    onClose();
  };

  const handleDone = () => {
    handleTap();
    try {
      // Safely apply language change
      onSelectLanguage(tempSelectedLanguage as LanguageCode);
      onClose();
    } catch (error) {
      console.error('Error applying language selection:', error);
      // Stay open if there's an error changing language
    }
  };

  // Use standard translation function
  // No need for fallbacks as all keys are now standardized

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={[styles.modalHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton} hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}>
              <Text style={[styles.cancelText, { textAlign: isRTL ? 'right' : 'left' }]}>{t('cancel') || 'Cancel'}</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('language') || 'Language'}</Text>
            <TouchableOpacity onPress={handleDone} style={styles.headerButton} hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}>
              <Text style={[styles.doneText, { textAlign: isRTL ? 'left' : 'right' }]}>{t('done') || 'Done'}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tempSelectedLanguage}
              onValueChange={(itemValue) => setTempSelectedLanguage(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {languages.map((language) => (
                <Picker.Item 
                  key={language.code} 
                  label={`${language.name} (${supportedLanguages[language.code as LanguageCode]?.nativeName || language.name})`} 
                  value={language.code} 
                />
              ))}
            </Picker>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  modalHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerButton: {
    padding: 5,
  },
  cancelText: {
    fontSize: 16,
    color: '#999999',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  pickerContainer: {
    height: 200,
  },
  picker: {
    height: 200,
  },
  pickerItem: {
    fontSize: 18,
  },
});
